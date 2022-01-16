const session = require('express-session');
const sessionFileStore = require('session-file-store');
const crypto = require('crypto');

const defaults = {
	persist: true,
	name: '_sid',
	dir: '.sessions',
	secret: crypto.randomBytes(16).toString('hex'),
	resave: false,
	rolling: true,
	saveUninitialized: true,
	cookie: {
		secure: false,
		httpOnly: true,
		sameSite: true,
		maxAge: 86400000,
	},
};

const FileStore = sessionFileStore(session);

module.exports = function (app, options = {}) {
	const {
		persist,
		dir: path,
		secret,
		cookie,
		...opts
	} = { ...defaults, ...options };

	const ttl = (cookie && cookie.maxAge / 1000) || undefined;

	const store = persist
		? typeof persist === 'function'
			? persist({ secret, ttl, })
			: new FileStore({
				reapSyncFallback: true,
				reapInterval: ttl,
				reapAsync: true,
				secret, 
				path, 
				ttl, 
			})
		: undefined;

	app.use(
		session({
			...opts,
			secret,
			cookie,
			store,
		})
	);
};
