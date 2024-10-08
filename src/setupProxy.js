const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    ["/api", "/oauth2"],
    createProxyMiddleware({
      target: "http://3.39.251.48:8080",
      changeOrigin: true,
      cookieDomainRewrite: "localhost",
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers["Access-Control-Allow-Origin"] =
          "http://localhost:3000";
        proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
      },
    })
  );
};
