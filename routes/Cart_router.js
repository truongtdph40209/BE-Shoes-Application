const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/Cart_ctrl");
const auth = require("../controllers/auth"); // Middleware xác thực người dùng

// // Thêm sản phẩm vào giỏ hàng
router.post("/cart", ctrl.addToCart);
router.get("/cart/:id", ctrl.getCart);
router.post('/cart/increase/:id', ctrl.increaseQuantity);
router.post('/cart/decrease/:id', ctrl.decreaseQuantity);
router.post('/cart/remove/:id', ctrl.removeItem);

module.exports = router;
