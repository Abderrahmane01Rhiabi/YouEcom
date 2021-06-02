const mongoose = require('mongoose');

//Collection
const productSchema = new mongoose.Schema({
    //field
    name : { //Documment 
        type : String,
        required : [true, 'Please enter product name'],
        trim : true, //explique => "hello " ou " hello " => "hello"
        maxLength : [200, 'Product name cannot exceed 100 characters']
    },

    price : {
        type : Number,
        required : [true, 'Please enter product price'],
        default : 0.0,
        maxLength : [6, 'Product price cannot exceed 6 characters']
    },

    description : {
        type : String,
        required : [true, 'Please enter product description'],
    },

    images : [
        {
            public_id : {
                type : String,
                required : true
            },
            url : {
                type : String,
                required : true
            }
        }
    ],

    category : {
        type : String,
        required : [true, 'Please select category for this product'],
        enum : { //explique
            values : [
                'Electronies','Cameras','Laptop','Accessories','Headohones',
                'Food','Books','Clothes','Shoes','Beauty/Health','Sports',
                'Outdoor','Home'
            ],
            msg : 'Please select correct category for product' //value is not suported
        }
    },

    seller : {
        type : String,
        required : [true, 'Please enter product seller']
    },

    stock : {
        type : Number,
        required : [true, 'Please enter product stock'],
        default : 0,
        maxLength : [5, 'Product stock cannot exceed 5 characters']
    },
    
    ratings : {
        type : Number,
        default : 0
    },
    
    numberOfReviews : {
        type: Number,
        default : 0
    },
    
    reviews : [
        {
            user : {
                type : mongoose.Schema.ObjectId,
                ref : 'User', //?
                required : true
            },
            name:{
                type : String,
                required : true
            },
            rating:{
                type : Number,
                required : true
            },
            comment:{
                type : String,
                required : true
            }
        }
    ],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User', //?
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('Product',productSchema); 
