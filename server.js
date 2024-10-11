const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch"); // node-fetch를 추가해야 합니다.

const app = express();

// CORS 설정
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "http://43.203.233.134:3000"
        : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// body parser 미들웨어 추가
app.use(express.json());

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

app.get("/api/image-proxy", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");
    res.setHeader("Content-Type", contentType);
    response.body.pipe(res);
  } catch (error) {
    console.error("Error proxying image:", error);
    res.status(500).json({ error: "Failed to proxy image" });
  }
});

// 정적 파일 제공 (프로덕션 모드)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
