const fs = require('fs');

const defaults = {
	template: 'index',
};

module.exports = function (app, options = {}) {
	const { template, handler, ...opts } = { ...defaults, ...options };

	if (typeof handler !== 'function') return;
	if (typeof template !== 'string' && typeof template !== 'function') return;

	if ( ! app.get('view engine')) {
		app.engine('html', templateEngine);
		app.set('view engine', 'html');
	}

	app.use(async (req, res, next) => {
		try {
			const locals = await handler(req);

			if (typeof template === 'function') {
				template = template(req);
			}

			return res.render(template, locals);
		} catch (err) {
			return next(err);
		}
	});
};

function renderInsertions(template, insertion, prefix = '') {
	prefix && (prefix += '.');
	return insertion
		? Object.entries(insertion).reduce((template, [placeholder, insertion]) => {
				if (typeof insertion === 'object') {
					return insertion === null ? template : renderInsertions(template, insertion, `${prefix}${placeholder}`);
				}
				return template.replace(`%${prefix.toUpperCase()}${placeholder.toUpperCase()}%`, insertion);
		  }, template)
		: template;
}

function templateEngine(filePath, options, callback) {
	fs.readFile(filePath, (err, content) => {
		if (err) return callback(err);
		const html = renderInsertions(content.toString(), options).replace(/(%(.*)%)/g, '');
		return callback(null, html);
	});
}
