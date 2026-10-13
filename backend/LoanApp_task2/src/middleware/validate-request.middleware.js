const BadRequestError = require('../errors/bad-request.error');

const validateRequest = (schema, source = 'body') => {
    return (req, res, next) => {
        let dataToValidate;

        switch (source) {
            case 'query':
                dataToValidate = req.query;
                break;

            case 'params':
                dataToValidate = req.params;
                break;

            case 'body':
            default:
                // Express 5 leaves req.body undefined when no body is sent.
                dataToValidate = req.body ?? {};
                break;
        }

        const { error, value } = schema.validate(dataToValidate);

        if (error) {
            return next(
                new BadRequestError(error.details[0].message)
            );
        }

        if (source === 'query') {
            req.validatedQuery = value;
        } else if (source === 'params') {
            req.params = value;
        } else {
            req.body = value;
        }

        next();
    };
};

module.exports = validateRequest;
