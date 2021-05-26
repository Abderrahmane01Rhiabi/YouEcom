const ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500; //is status code is not existe then 500 

    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        });
    }

    if(process.env.NODE_ENV === 'PRODUCTION'){
        let error = {...err} //?
        
        error.message = err.message;

        //wrong Mongoose object ID
        if(err.name === 'CastError'){
            const msg = `Resource not found. Invalid : ${err.path}`;
            error = new ErrorHandler(msg, 400); //?
        }

        //handling Mongoose validation error 
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value => value.message); //?
            error = new ErrorHandler(message, 400); //?
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message ||  'Internal Server Error'
        });
    }
} 

//explication error | errorHandeler| midelleware error