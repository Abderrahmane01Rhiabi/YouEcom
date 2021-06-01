const express = require('express');
const router = express.Router();
const { newOrder, myOrders, getSingleOrder, allOrders } = require('../controllers/orderController');

const { isAuthUser, authRoles } = require('../middlewares/auth');
 
router.route('/order/new').post(isAuthUser,newOrder);
router.route('/order/:id').get(isAuthUser,getSingleOrder);
router.route('/orders/me').get(isAuthUser,myOrders);

router.route('/admin/orders/').get(isAuthUser, authRoles('admin'), allOrders);

module.exports = router;
