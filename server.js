const express = require("express");
const cors = require("cors");
const path = require("path");
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

const app = express();

// CORS 설정
app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json());

// 정적 파일 제공 (React 빌드 파일)
app.use(express.static(path.join(__dirname, "build")));

// AWS S3 설정
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// API 라우트
app.get("/api/images", async (req, res) => {
  const { keyword } = req.query;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: keyword,
  };

  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3.send(command);
    const images = data.Contents.filter((item) => !item.Key.endsWith("/")).map(
      (item) =>
        `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`
    );
    res.json(images);
  } catch (error) {
    console.error("Error fetching images from S3:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// 모든 요청을 React 앱으로 라우팅
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
