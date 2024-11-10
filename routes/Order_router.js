// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/Order_ctrl");

router.post("/order", orderController.createOrder);
router.get("/order/:id", orderController.getOrders);

module.exports = router;
