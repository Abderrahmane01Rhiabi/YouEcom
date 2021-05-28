const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Checks if user is authenticated or not
exports.isAuthUser = catchAsyncErrors( async (req,res,next)=>{

    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHandler('Login first to access this resource',401))
    }      

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    req.user = await User.findById(decoded.id);
    
    next();
})

// Handling users roles
exports.authRoles = (...roles) =>{
    return (req,res,next) => {
        console.log(req.user.role);
        if(!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to access this ressource`, 403)
            );
        }
        next();
    }
}