import axios from "axios";

axios
  //.get("http://3.39.251.48:8080/api/data", {
  .get("http://localhost:8080/api/data", {
    withCredentials: true, // 쿠키나 인증 정보를 함께 보내는 경우
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("There was an error!", error);
  });
const { createProxyMiddleware } = require("http-proxy-middleware");

app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:8080",
    changeOrigin: true,
  })
);
