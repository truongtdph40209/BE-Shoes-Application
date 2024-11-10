// otp_router.js
const express = require('express');
const { sendOTP, otpCache } = require('./nodemailer'); // Import từ nodemailer.js
const router = express.Router();
const User = require('../models/User'); // Giả sử bạn có model User để thao tác với cơ sở dữ liệu
const bcrypt = require('bcryptjs');

// Route gửi OTP qua email
router.post('/forgotPassword', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email là bắt buộc' });
  }

  try {
    // Gửi OTP qua email
    const otp = await sendOTP(email);

    return res.status(200).json({
      message: 'OTP đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư.',
      otp: otp, // Trả OTP để lưu vào database hoặc cache nếu cần
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi gửi OTP', error: error.message });
  }
});

// Route xác minh OTP
router.post('/verifyOTP', async (req, res) => {
  const { email, otpEntered } = req.body;

  if (!email || !otpEntered) {
    return res.status(400).json({ message: 'Email và OTP là bắt buộc' });
  }

  try {
    // Xác minh OTP
    const storedOtp = otpCache[email];

    if (!storedOtp) {
      return res.status(400).json({ message: 'OTP không tồn tại hoặc đã hết hạn.' });
    }

    if (otpEntered === storedOtp.otp && Date.now() < storedOtp.expirationTime) {
      return res.status(200).json({ message: 'OTP hợp lệ. Bạn có thể thay đổi mật khẩu.' });
    } else {
      return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi xác minh OTP', error: error.message });
  }
});

// Route thay đổi mật khẩu
router.post('/changePassword', async (req, res) => {
  const { email, newPassword, otpEntered } = req.body;

  if (!email || !newPassword || !otpEntered) {
    return res.status(400).json({ message: 'Email, mật khẩu mới và OTP là bắt buộc' });
  }

  try {
    // Kiểm tra OTP hợp lệ
    const storedOtp = otpCache[email];
    if (!storedOtp || otpEntered !== storedOtp.otp || Date.now() > storedOtp.expirationTime) {
      return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn.' });
    }

    // Cập nhật mật khẩu mới
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Lưu mật khẩu mới vào cơ sở dữ liệu
    await user.save();

    return res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi thay đổi mật khẩu', error: error.message });
  }
});

module.exports = router;
