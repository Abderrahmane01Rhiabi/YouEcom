//to push data in the database mongoose

const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDB = require('../config/database');

const products = require('../data/products');

//dotenv 
dotenv.config({path : 'back-end/config/config.env'})

connectDB();

const seedProducts = async () =>{
    try {
        
            await Product.deleteMany();
            console.log('Products are deleted');
  
            await Product.insertMany(products);
            console.log('Products are added');

            process.exit();


    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedProducts();