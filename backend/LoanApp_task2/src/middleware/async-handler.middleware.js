// Wraps an async controller so any thrown error / rejected promise is forwarded
// to the error middleware. Controllers no longer need their own try/catch.
const asyncHandler = (handler) => (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);

module.exports = asyncHandler;
