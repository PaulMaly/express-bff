const SSE = require('express-sse');

const defaults = {
    path: '/data',
};

module.exports = function (app, options = {}) {

    const { path, initial, ...opts } = { ...defaults, ...options };

    const sse = new SSE(initial, opts);

    app.use((req, res, next) => {
        res.sse = sse;
        return next();
    });

    app.get(path, sse.init);
};