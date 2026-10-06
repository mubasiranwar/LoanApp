const BadRequestError = require('../errors/BadRequestError');

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
                dataToValidate = req.body;
                break;
        }

        const { error, value } = schema.validate(dataToValidate);

        if (error) {
            return next(
                new BadRequestError(error.details[0].message)
            );
        }

        if (source === 'query') {
            req.query = value;
        } else if (source === 'params') {
            req.params = value;
        } else {
            req.body = value;
        }

        next();
    };
};

module.exports = validateRequest;