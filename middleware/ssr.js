const defaults = {
    template: `
        <!DOCTYPE html>
        <html>
            <head>
                <meta name="csrf-token" content="%CSRFTOKEN%">
                %HEAD%
                %CSS%
            </head>
            <body>
                %HTML%
            </body>
        </html>
    `,
};

module.exports = function (app, options = {}) {
    const { template, handler, ...opts } = { ...defaults, ...options };

    if (typeof handler !== 'function') return;
    if (typeof template !== 'string' && typeof template !== 'function') return;

    app.use(async (req, res, next) => {
        try {
            const locals = await handler(req);

            if (typeof template === 'function') {
                template = template(req);
            }

            const html = Object.entries({ ...res.locals, ...(locals || {}) })
                                .reduce((template, [placeholder, insertion]) => {
                                    return template.replace(`%${placeholder.toUpperCase()}%`, insertion);
                                }, template);

            return res.send(html);
        } catch(err) {
            return next(err);
        }
    });
};