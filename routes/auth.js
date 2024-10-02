const express = require('express');
const { signin, signup } = require('../controllers/auth'); // Đảm bảo rằng 'signup' được viết đúng

const router = express.Router();

router.post(`/signup`, signup); // Sửa lỗi chính tả ở đây
router.post(`/signin`, signin);  // Sửa lỗi chính tả ở đây

module.exports = router;
