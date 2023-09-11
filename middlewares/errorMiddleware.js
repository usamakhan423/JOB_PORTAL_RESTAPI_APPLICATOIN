const errorMiddleware = (err, req, res, next) => {
    console.log(err);
    const defaultErrors = {
        statusCode: 500,
        message: err
    }

    // Create custom user errors
    if (err.name === 'validationError') {
        defaultErrors.statusCode = 400,
        defaultErrors.message = Object.values(err.error).map(item => item.message).join(',')
    }

    res.status(defaultErrors.statusCode).json({ message: defaultErrors.message });
};

export default errorMiddleware;