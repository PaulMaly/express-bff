const methodOverride = require('method-override');
const { json, urlencoded } = require('body-parser');
const createRouter = require('express-file-routing').default;

const defaults = {
    dir: './routes',
    method: '_method',
    methodExports: [],
};

module.exports = function (app, options = {}) {
    const { dir: directory, method, ...opts } = { ...defaults, ...options };

    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(methodOverride(method));

    createRouter(app, {
        directory,
        ...opts,
    });
};
