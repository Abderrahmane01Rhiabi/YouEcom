const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');


//Creation de produit => /api/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res ,next) =>{   
    const product = await Product.create(req.body);
    res.status(201).json({
        success : true,
        product 
    })
})

//get all products => /api/products
exports.getProducts = catchAsyncErrors(async (req, res, next) =>{

    const apiFeatures = new APIFeatures(Product.find(), req.query).search();

    const products = await apiFeatures.query;

    res.status(200).json({
        success : true,
        count: products.length,
        products
    })
})

//get single prod details => /api/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) =>{

    const product = await Product.findById(req.params.id); //retourne tous les prod

    if(!product){
        return next(new ErrorHandler('Product not found', 404));   
    }

    res.status(200).json({
        success : true,
        product
    })
})

//update pduct => /api/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) =>{

    let product = await Product.findById(req.params.id); //retourne tous les prod

    if(!product){
        return next(new ErrorHandler('Product not found', 404));   
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    }); 

    res.status(200).json({ 
        success : true,
        product
    })
})

//delete pduct => /api/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) =>{

    const product = await Product.findById(req.params.id); //retourne tous les prod

    if(!product){
        return next(new ErrorHandler('Product not found', 404));   

        /*return res.status(404).json({
            success : false,
            msg : "Product not found"
        })*/
    }

    await product.remove();

    res.status(200).json({
        success : true,
        msg: 'Product is deleted'
    })
})