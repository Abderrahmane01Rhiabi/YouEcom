const express = require('express');
const router = express.Router();
const { newOrder, myOrders, getSingleOrder, allOrders, updateOrder, deleteOrder } = require('../controllers/orderController');

const { isAuthUser, authRoles } = require('../middlewares/auth');
 
router.route('/order/new').post(isAuthUser,newOrder);
router.route('/order/:id').get(isAuthUser,getSingleOrder);
router.route('/orders/me').get(isAuthUser,myOrders);

router.route('/admin/orders/').get(isAuthUser, authRoles('admin'), allOrders);
router.route('/admin/order/:id').put(isAuthUser, authRoles('admin'), updateOrder);

router.route('/admin/order/:id').delete(isAuthUser, authRoles('admin'), deleteOrder);

module.exports = router;
 