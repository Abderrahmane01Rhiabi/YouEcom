const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

//const cloudinary = require('cloudinary');

//Register a user => /api/register

exports.registerUser = catchAsyncErrors( async (req,res,next) =>{

    const {name, email, password} = req.body;

    console.log(name +" "+email+" "+password);

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'avatar/t%C3%A9l%C3%A9charg%C3%A9_2_xersiw',
            url: 'https://res.cloudinary.com/youecom/image/upload/v1622052998/avatar/t%C3%A9l%C3%A9charg%C3%A9_2_xersiw.jpg'
        }
    });

    sendToken(user,200,res); //cookie

    // const token = user.getJwtToken();

    // console.log((token));
    // res.status(201).json({
    //     success: true,
    //     token
    // });
});

//login user => /api/1/login
exports.loginUser= catchAsyncErrors( async (req,res,next) =>{
    const {email, password} = req.body;

    //checks if email and password is entered by user
    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password',400));
    }

    //finding use rin database 
    const user = await User.findOne({email}).select('+password'); //password select is false

    if(!user){
        return next(new ErrorHandler('Invaldid Email or Password', 401));
    }

    //checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invaldid Email or Password', 401));
    }

    sendToken(user,200,res); //cookie

    // const token = user.getJwtToken();
    // res.status(200).json({
    //     success: true,
    //     token
    // })
})

// Forgot password => /api/v1/password/forgot
exports.forgotPass = catchAsyncErrors( async (req,res,next) =>{

    const user = await User.findOne({email : req.body.email});
    console.log(req.body.email);
    
    if(!user){
        return next(new ErrorHandler('user not found with this email',404));
    }

    // get reset token
    const resetToken = user.getResetPassToken();

    await user.save({ validateBeforeSave : false });

    // create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`;
    const message = `Your password reset token is a follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`;//msg to the user

    try {
        
        await sendEmail({
            email: user.email,
            subject: 'YouEcom Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave : false });

        return next(new ErrorHandler(error.message, 500));
    }



})

// reset password => /api/v1/password/reset/:token
exports.resetPass = catchAsyncErrors( async (req,res,next) =>{

    //hash the url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({resetPasswordToken, resetPasswordExpire: {$gt: Date.now()}})

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match', 400));
    }

    // setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

})

// logout user => /api/v1/logout
exports.logout = catchAsyncErrors( async (req,res,next) =>{
    res.cookie('token',null,{
        expires: new Date( Date.now()),
        httpOnly : true //?
    });

    res.status(200).json({
        success: true,
        message : 'Logged out'
    });

})

exports.updateUserProfile = catchAsyncErrors( async (req,res,next) =>{
    const user = await User.findById(req.user.id).select('+password');

    //check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched){
        return next(new ErrorHandler('Old Password is incorrect'));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);

})

exports.getUserProfile = catchAsyncErrors( async (req,res,next) =>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    /*// Update avatar
    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }*/

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})