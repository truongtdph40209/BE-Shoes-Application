// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/Order_ctrl");

// Tạo đơn hàng mới
router.post("/order", orderController.createOrder);

// Lấy danh sách tất cả đơn hàng
router.get("/order", orderController.getAllOrders);

// Lấy chi tiết đơn hàng theo ID
router.get("/order/:id", orderController.getOrderById);

// Cập nhật đơn hàng theo ID
router.put("/order/:id", orderController.updateOrder);

// Xóa đơn hàng theo ID
router.delete("/order/:id", orderController.deleteOrder);

module.exports = router;
