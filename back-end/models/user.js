const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6,'Your password must be longer than 6 characters'],
        select: false,  //dont displeyt the password of the user
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default : 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken :String,
    resetPasswordExpire: Date

});

// Encrypte password
userSchema.pre('save', async function(next) {

    if(!this.isModified('password')){
        next(); //if the password is not modified so its ok
    }

    this.password = await bcrypt.hash(this.password, 10); //strong of hash

});

// Compare user password
userSchema.methods.comparePassword = async function(pass){
    return await bcrypt.compare(pass,this.password);
}

// Return JWT token ou dok les val raj deja kaynin f config
userSchema.methods.getJwtToken = function(){
    return jwt.sign({ id : this._id}, process.env.JWT_SECRET, 
        {
            expiresIn: process.env.JWT_EXPIRES_TIME
        });
}

// generate password reset token
userSchema.methods.getResetPassToken = function(){
    // token generate 
    const resetToken = crypto.randomBytes(20).toString('hex'); //pasqe buffer -> toString
    console.log("resetToken : "+resetToken);

    //hash and set to resetPassToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log("resetPasswordToken : "+this.resetPasswordToken);
    console.log("1 : "+crypto.createHash('sha256'));
    console.log("2 : "+crypto.createHash('sha256').update(resetToken));
    console.log("3 : "+crypto.createHash('sha256').update(resetToken).digest('hex'));

    // set token exprire time 
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; //apres 30 min
    console.log("resetPasswordExpire "+this.resetPasswordExpire);

    return resetToken; // after we have to decripte and matcher with restpasstoken

}

module.exports = mongoose.model('User',userSchema);
