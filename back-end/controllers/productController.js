const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');


exports.newProduct = catchAsyncErrors(async (req, res ,next) =>{   
    
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success : true,
        product 
    })
})

exports.getProducts = catchAsyncErrors(async (req, res, next) =>{

    //result per page
    const resPerPage = 4;
    const productCount = await Product.countDocuments();



    const apiFeatures = new APIFeatures(Product.find(), req.query)
                        .search()
                        .filter()
                        .pagination(resPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
        success : true,
        count: products.length,
        productCount,
        products
    })
})

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

//?
exports.createProductReview = catchAsyncErrors(async (req, res, next) =>{

    const { rating , comment, productId} = req.body;

    const review = {
        user : req.user._id,
        name : req.user.name,
        rating : Number(rating),
        comment
    }

    const product = await Product.findById(productId);
 
    const isReviewd = product.reviews.find( r => r.user.toString() === req.user._id.toString())

    if(isReviewd){
        product.reviews.forEach(review =>{
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating;
            }
        })
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc,0) /product.reviews.length;

    await product.save({ validateBeforeSave : false});

    res.status(200).json({
        success : true
    })
})


exports.getProductReviews = catchAsyncErrors(async (req, res, next) =>{

    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success : true,
        reviews : product.reviews  
    })

})


exports.deleteProductReviews = catchAsyncErrors(async (req, res, next) =>{

    const product = await Product.findById(req.query.productId);

    //id of the review that a want to delete 
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
 
    const numOfReviews = reviews.lenght;
    
    const ratings = product.ratings = product.reviews.reduce((acc, item) => item.rating + acc,0) / reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews, ratings, numOfReviews
    }, {
        new : true,
        runValidators : true,
        useFindAndModify : false
    });

    res.status(200).json({
        success : true
    })

})