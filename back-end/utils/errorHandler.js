class ErrorHandler extends Error{ //herite from error

    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);

        /*
            const myObject = {};
            Error.captureStackTrace(myObject);
            myObject.stack;  // Similar to `new Error().stack`
        */
    }
}


module.exports = ErrorHandler;