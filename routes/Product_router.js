// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/Product_ctrl');

// Định nghĩa các route

// Tạo mới một sản phẩm
router.post('/product', createProduct); // POST /product

// Lấy tất cả sản phẩm
router.get('/product', getAllProducts); // GET /product

// Lấy một sản phẩm theo ID
router.get('/product:id', getProductById); // GET /product/:id

// Cập nhật một sản phẩm theo ID
router.put('/product:id', updateProduct); // PUT /product/:id

// Xóa một sản phẩm theo ID
router.delete('/product:id', deleteProduct); // DELETE /product/:id

// Xuất router
module.exports = router;
