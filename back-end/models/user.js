const mongoose = require('mongoose');
const { stringify } = require('querystring');
const { default: validator } = require('validator');

//Collection
const userSchema = new mongoose.Schema({

    name: {
        type : String,
        required: [true, 'Please enter your name'],
        maxlength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: string,
        required: [true, 'Please enter your password'],
        minlength: [6,'Your password must be longer than 6 characters']
    }

});


module.exports = mongoose.model('User',userSchema);
