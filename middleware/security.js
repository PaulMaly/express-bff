const helmet = require('helmet');
const csurf = require('csurf');
const ssl = require('ssl-express-www');
const crypto = require('crypto');
const corsMiddleware = require('cors');

const defaults = {
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", (_, res) => `'nonce-${res.locals.nonce}'`],
		},
	},
};

module.exports = function (app, options = {}) {
	const { csrf, secure, cors, ...opts } = { ...defaults, ...options };

	app.use(setNonce, helmet(opts));

	csrf !== false && app.use(csurf(csrf), setCsrf);
	secure !== false && app.use(ssl);
	cors !== false && app.use(corsMiddleware(cors));
};

function setCsrf(req, res, next) {
	res.locals.csrfToken = req.csrfToken();
	return next();
}

function setNonce(req, res, next) {
	res.locals.nonce = crypto.randomBytes(16).toString('hex');
	return next();
}
