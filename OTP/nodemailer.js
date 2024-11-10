// nodemailer.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Cấu hình Nodemailer để gửi email
const transporter = nodemailer.createTransport({
  service: 'gmail', // Thay bằng dịch vụ email của bạn nếu không phải Gmail
  auth: {
    user: 'trinhdinhtruong2109@gmail.com', // Email của bạn
    pass: 'futt phnh pmrv lftt', // Mật khẩu email (có thể là mật khẩu ứng dụng nếu bạn sử dụng Gmail với xác minh 2 bước)
  },
});

// Tạo OTP ngẫu nhiên
const generateOTP = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); // Tạo OTP dài 6 ký tự
};

// Gửi OTP qua email
const sendOTP = async (email) => {
  const otp = generateOTP();

  const mailOptions = {
    from: 'trinhdinhtruong2109@gmail.com', // Địa chỉ email người gửi
    to: email, // Địa chỉ email người nhận
    subject: 'Mã OTP để lấy lại mật khẩu', // Tiêu đề email
    text: `Mã OTP của bạn là: ${otp}. Vui lòng sử dụng mã này để đặt lại mật khẩu.`, // Nội dung email
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP đã được gửi tới email:', email);

    // Lưu OTP vào bộ nhớ tạm để xác minh sau
    // Thêm thời gian hết hạn vào OTP (Ví dụ 5 phút)
    otpCache[email] = { otp, expirationTime: Date.now() + 5 * 60 * 1000 }; 

    return otp; // Trả OTP để có thể lưu vào cơ sở dữ liệu hoặc cache
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    throw new Error('Không thể gửi OTP đến email.');
  }
};

// Lưu OTP vào bộ nhớ tạm
const otpCache = {};

module.exports = { sendOTP, otpCache };
