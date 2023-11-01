const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('./Controllers/ErrorHandler');
const AppError = require("./utils/appError");

const app = express();
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
})

const tourRouter = require('./routes/tourRouter')
const userRouter = require('./routes/userRouter');




// tour
app.use("/api/v1/tours", tourRouter);

// user
app.use('/api/v1/users', userRouter)

// ErrorHandler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find${req.originalUrl}`, 404))
})

app.use(globalErrorHandler)

module.exports = app;

