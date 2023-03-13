const proxy = require('express-http-proxy');

const defaults = {
	path: '',
	skipToNextHandlerFilter(proxyRes) {
		return proxyRes.statusCode === 404;
	},
};

module.exports = function (app, options = {}) {
	const { path, target, ...opts } = { ...defaults, ...options };
	app.use(path, proxy(target, opts));
};
