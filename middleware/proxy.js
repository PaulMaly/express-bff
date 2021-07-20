const { createProxyMiddleware } = require('http-proxy-middleware');

const defaults = {
    path: '**'
};

module.exports = function (app, options = {}) {
    const { path, ...opts } = { ...defaults, ...options };
    app.use(createProxyMiddleware(path, opts));
};
