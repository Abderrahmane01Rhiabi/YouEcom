const express = require('express');
const router = express.Router();
const { getProducts ,newProduct ,getSingleProduct ,updateProduct ,deleteProduct, createProductReview, getProductReviews, deleteProductReviews} = require('../controllers/productController');

const { isAuthUser, authRoles } = require('../middlewares/auth');
 
router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);

router.route('/admin/product/new').post(isAuthUser, authRoles('admin'), newProduct); //simple test
router.route('/admin/product/:id').put(isAuthUser, authRoles('admin'), updateProduct);
router.route('/admin/product/:id').delete(isAuthUser, authRoles('admin'), deleteProduct);

router.route('/review').put(isAuthUser, createProductReview);
router.route('/reviews').get(isAuthUser, getProductReviews);
router.route('/reviews').delete(isAuthUser, deleteProductReviews);

module.exports = router;
