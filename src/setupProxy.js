const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    ["/api", "/oauth2"],
    createProxyMiddleware({
      target: "http://3.39.251.48:8080",
      changeOrigin: true,
      onProxyRes: function (proxyRes, req, res) {
        // CORS 헤더 설정
        //proxyRes.headers["Access-Control-Allow-Origin"] = "http://43.203.233.134:3000";
        proxyRes.headers["Access-Control-Allow-Origin"] = "http://43.203.233.134:8888"; // 포트를 80으로 변경

        proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
        
        // 쿠키 SameSite 속성 설정
        if (proxyRes.headers["set-cookie"]) {
          const cookies = proxyRes.headers["set-cookie"].map(cookie =>
            cookie.replace(/; secure/gi, "; SameSite=None; Secure")
          );
          proxyRes.headers["set-cookie"] = cookies;
        }
      },
    })
  );
};