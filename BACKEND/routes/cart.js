const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/CartController');
const verifyToken = require('../middleWare/authMiddleware');

router.get('/', verifyToken, cartController.getCart);
router.post('/add', verifyToken, cartController.addToCart);
router.put('/update', verifyToken, cartController.updateQuantity);
router.delete('/remove/:productId', verifyToken, cartController.removeItem);
router.post('/merge', verifyToken, cartController.mergeCart);

module.exports = router;