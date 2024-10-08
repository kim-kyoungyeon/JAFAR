from fastapi import FastAPI, Form, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import openai
from openai import OpenAIError
import requests
from io import BytesIO
import boto3
from botocore.exceptions import NoCredentialsError
import pymysql

# OpenAI API 키 설정 (환경 변수 사용 권장)
#openai.api_key = ""

app = FastAPI()

# SQLAlchemy 설정
DATABASE_URL = "mysql+pymysql://root:0000@localhost/mysql"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# S3 설정
s3 = boto3.client('s3')
BUCKET_NAME = 'jafar-jv-s-buckett'

# 데이터베이스 모델 정의 (이미지 URL 저장)
class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)  # VARCHAR의 길이를 255로 설정
    image_url = Column(String(255), nullable=False)  # 이 필드도 같은 방식으로 설정


# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# AWS S3에 이미지 업로드 함수
def upload_image_to_s3(image_data, image_name):
    try:
        s3.upload_fileobj(
            BytesIO(image_data),
            BUCKET_NAME,
            image_name,
            ExtraArgs={'ContentType': 'image/jpeg'}
        )
        image_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{image_name}"
        return image_url
    except NoCredentialsError:
        print("Credentials not available")
        return None


# Dependency: 요청할 때마다 새로운 데이터베이스 세션을 생성하고, 완료 후 종료
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 기본 폼을 렌더링하는 엔드포인트
@app.get("/", response_class=HTMLResponse)
def get_form():
    return """
<html>
    <head>
        <title>Generate Image</title>
        <style>
            /* 스크롤 바를 적용할 영역에 스타일 추가 */
            #image-list {
                height: 200px;
                overflow-y: scroll;
                border: 1px solid #ccc;
                padding: 10px;
            }

            /* 이미지를 표시할 영역에 스타일 추가 */
            #image-display {
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <h1>Generate Image with OpenAI</h1>
        <form action="/submit" method="post">
            <label for="description">Description:</label>
            <input type="text" id="description" name="description" required>
            <button type="submit">Generate Image</button>
        </form>

        <h2>Saved Images</h2>
        <div id="image-list">
            <ul id="image-items">
                <!-- JS로 데이터를 불러와 추가할 예정 -->
            </ul>
        </div>

        <!-- 이미지를 표시할 영역 -->
        <div id="image-display">
            <h3>Selected Image</h3>
            <img id="selected-image" src="" alt="No image selected" style="max-width: 500px;"/>
        </div>

        <script>
            // 페이지 로드 시 서버에서 이미지 목록을 가져와 표시하는 함수
            async function loadImages() {
                const response = await fetch('/images');
                const images = await response.json();

                const imageList = document.getElementById('image-items');
                imageList.innerHTML = '';  // 기존 목록 초기화

                images.forEach(image => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `ID: ${image.id}, Name: ${image.name}`;
                    listItem.style.cursor = 'pointer';

                    // 클릭 시 해당 이미지 가져오기
                    listItem.addEventListener('click', () => loadImage(image.id));
                    imageList.appendChild(listItem);
                });
            }

            // 이미지 ID로 이미지를 가져와 표시하는 함수
            async function loadImage(imageId) {
                const imgElement = document.getElementById('selected-image');
                imgElement.src = `/get-image/${imageId}`;  // 이미지 엔드포인트 호출하여 이미지 표시
            }

            // 페이지가 로드될 때 이미지 목록을 불러옴
            window.onload = loadImages;
        </script>
    </body>
</html>
    """


# 이미지 생성, 다운로드 및 데이터베이스 저장 엔드포인트
@app.post("/submit", response_class=HTMLResponse)
async def handle_form(description: str = Form(...), db: Session = Depends(get_db)):
    try:
        # OpenAI API 호출로 이미지 생성
        response = openai.Image.create(
            prompt=description,
            n=1,
            size="512x512"
        )

        # 생성된 이미지 URL 추출
        image_url = response['data'][0]['url']
        image_name = f"{description}.jpg"

        # 이미지 다운로드
        image_data = requests.get(image_url).content

        # S3에 이미지 업로드
        s3_image_url = upload_image_to_s3(image_data, image_name)
        if s3_image_url is None:
            return HTMLResponse(content=f"<h1>Error: Failed to upload image to S3</h1>")

        # 데이터베이스에 이미지 URL 저장
        new_image = Image(name=description, image_url=s3_image_url)
        db.add(new_image)
        db.commit()
        db.refresh(new_image)

        # 결과 페이지 반환
        return f"""
        <html>
            <body>
                <h1>Generated Image</h1>
                <img src="{s3_image_url}" alt="Generated Image">
                <p>Image Name: {description}</p>
                <p><a href="/">Generate another image</a></p>
            </body>
        </html>
        """
    except OpenAIError as e:
        return HTMLResponse(content=f"<h1>Error: Failed to generate image. {str(e)}</h1>")


@app.get("/images")
async def get_image_list(db: Session = Depends(get_db)):
    images = db.query(Image).all()  # 모든 이미지 조회
    return [{"id": image.id, "name": image.name, "url": image.image_url} for image in images]


# 이미지 조회 엔드포인트
@app.get("/get-image/{image_id}")
async def get_image(image_id: int, db: Session = Depends(get_db)):
    image = db.query(Image).filter(Image.id == image_id).first()
    if image:
        # 이미지 URL을 리다이렉트하여 클라이언트에서 바로 S3에서 이미지를 로드
        return RedirectResponse(url=image.image_url)
    return {"error": "Image not found"}
