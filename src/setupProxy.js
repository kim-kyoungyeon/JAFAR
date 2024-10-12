const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    ["/api", "/oauth2"],
    createProxyMiddleware({
      target: "http://localhost:3002",
      changeOrigin: true,
      secure: false,
    })
  );
};
