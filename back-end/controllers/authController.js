const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

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

    const token = user.getJwtToken();

    console.log((token));
    res.status(201).json({
        success: true,
        token
    });
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

    const token = user.getJwtToken();
    res.status(200).json({
        success: true,
        token
    })
})
