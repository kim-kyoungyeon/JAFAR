const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
require("dotenv").config();
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    credentials: true,
  })
);

app.use(express.json());

// AWS S3 설정
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// S3 이미지 조회 API
app.get("/api/images", async (req, res) => {
  const { keyword } = req.query;
  console.log("Received keyword:", keyword); // 디버깅: 키워드 로깅

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: keyword,
  };

  console.log("S3 params:", params); // 디버깅: S3 파라미터 로깅

  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3.send(command);

    console.log("S3 response:", JSON.stringify(data, null, 2)); // 디버깅: S3 응답 로깅

    if (!data.Contents || data.Contents.length === 0) {
      return res
        .status(404)
        .json({ error: "No images found for the given keyword" });
    }

    const images = await Promise.all(
      data.Contents.filter(
        (item) =>
          !item.Key.endsWith("/") &&
          (item.Key.endsWith(".jpg") ||
            item.Key.endsWith(".png") ||
            item.Key.endsWith(".jpeg"))
      ).map(async (item) => {
        const url = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
        try {
          await axios.head(url);
          return url;
        } catch (error) {
          console.error(`Error checking image ${url}:`, error);
          return null;
        }
      })
    );

    const validImages = images.filter((url) => url !== null);

    console.log("Filtered images:", images); // 디버깅: 필터링된 이미지 URL 로깅

    // 랜덤으로 3개의 이미지 선택 (또는 전체 이미지가 3개 미만이면 전체 반환)
    const shuffled = validImages.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(3, validImages.length));
    res.json(selected);
  } catch (error) {
    console.error("Error fetching images from S3:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch images", details: error.message });
  }
});

// 이미지 프록시 API
app.get("/api/image-proxy", async (req, res) => {
  const { url } = req.query;
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        Origin: "http://localhost:3000",
      },
    });
    res.set("Content-Type", response.headers["content-type"]);
    res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.set("Access-Control-Allow-Credentials", "true");
    res.send(response.data);
  } catch (error) {
    console.error("Error proxying image:", error);
    res.status(500).send("Failed to proxy image");
  }
});
const UPLOAD_DIR = path.join(__dirname, "uploads");

// 선택된 이미지 처리 API
app.post("/api/select-image", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    // 이미지 데이터 가져오기
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(imageResponse.data, "binary");

    // Java API로 이미지 정보 전송
    const saveResponse = await axios.post(
      "http://3.39.251.48:8080/pictures/save",
      {
        url: imageUrl,
        format: "png", // 이미지 형식에 따라 변경 필요
        width: 512, // 실제 이미지 크기에 맞게 조정 필요
        height: 512, // 실제 이미지 크기에 맞게 조정 필요
        file: imageBuffer.toString("base64"),
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.json({
      message: "Image selected and saved successfully",
      saveResponse: saveResponse.data,
    });
  } catch (error) {
    console.error("Error processing selected image:", error);
    res.status(500).json({ error: "Failed to process selected image" });
  }
});

// 이미지 생성 API
app.post("/api/generate-image", async (req, res) => {
  try {
    const generationResponse = await axios.post(
      "http://3.39.251.48:8080/api/generate-image",
      req.body,
      {
        headers: { "Content-Type": "application/json" },
        responseType: "arraybuffer",
      }
    );
    const fileName = `generated_${Date.now()}.png`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    await fs.writeFile(filePath, generationResponse.data);

    // 3. Java API로 이미지 정보 전송
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
    const saveResponse = await axios.post(
      "http://3.39.251.48:8080/pictures/save",
      {
        url: imageUrl,
        format: "png",
        width: 512, // 예시 값, 실제 이미지 크기에 맞게 조정 필요
        height: 512, // 예시 값, 실제 이미지 크기에 맞게 조정 필요
        file: generationResponse.data.toString("base64"), // 바이너리 데이터를 Base64로 인코딩
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.json({
      imageUrl: imageUrl,
      saveResponse: saveResponse.data,
    });
  } catch (error) {
    console.error("Error in image generation and saving process:", error);
    res.status(500).json({ error: "Failed to generate and save image" });
  }
});

// 정적 파일 제공
app.use("/uploads", express.static(UPLOAD_DIR));

// 정적 파일 제공 (React 빌드 파일)
app.use(express.static(path.join(__dirname, "build")));

const PORT = process.env.NODE_ENV === "production" ? 3000 : 3002;

// 모든 요청을 React 앱으로 라우팅
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Environment variables:");
  console.log("AWS_REGION:", process.env.AWS_REGION);
  console.log("S3_BUCKET_NAME:", process.env.S3_BUCKET_NAME);
  console.log(
    "AWS_ACCESS_KEY_ID:",
    process.env.AWS_ACCESS_KEY_ID ? "SET" : "NOT SET"
  );
  console.log(
    "AWS_SECRET_ACCESS_KEY:",
    process.env.AWS_SECRET_ACCESS_KEY ? "SET" : "NOT SET"
  );
});
