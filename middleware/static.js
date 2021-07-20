const sirv = require('sirv');

const defaults = {
    dir: './static',
};

module.exports = function (app, options = {}) {
    const { dir, ...opts } = { ...defaults, ...options };
    app.use(sirv(dir, opts));
};