const AppError = require("../utils/appError")

const handleDBerror = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)

}
const sendErrorDev = (err, res) => {
    // log the error
    console.error('Hey developer, fix this error', err)

    // send the error response
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
}
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err
    });  
    } else {
        res.status(500).json({
            status: 'Error',
            message: 'Something went wrong...',
            error:err
        })
    }
    
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
         sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign(err);
        if (error.name === 'CastError')  error = handleDBerror(error)
        sendErrorProd(error, res) 
    }
    
}