// import React from "react";
// const proxy = React.lazy(() => import("http-proxy-middleware"));
// // const proxy = require("http-proxy-middleware");

// module.exports = function (app) {
//   app.use(proxy("/api", { target: "http://localhost:5000" }));
// };

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};
