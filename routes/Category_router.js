// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/Category_ctrl');

router.post('/category', createCategory); 
router.get('/category', getAllCategories); 
router.get('/category/:id', getCategoryById); 
router.put('/category/:id', updateCategory); 
router.delete('/category/:id', deleteCategory); 

module.exports = router;
