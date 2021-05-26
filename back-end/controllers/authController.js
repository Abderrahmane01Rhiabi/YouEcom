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