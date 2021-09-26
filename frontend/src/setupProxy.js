/* eslint-disable no-undef, @typescript-eslint/no-var-requires */

const { createProxyMiddleware } = require('http-proxy-middleware');

// proxying all requests matching /app/* routes in development environment
module.exports = app => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: path => path.replace('/api', ''),
    })
  );
};

/* eslint-enable */
