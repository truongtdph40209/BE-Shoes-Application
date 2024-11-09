const { registerSchema } = require("../Schemas/auth");
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

exports.signup = async(req, res) => {
    //    lấy dữ liệu từ user gửi lên
    const { email, password, name, confirmPassword, address, avatar } = req.body;
    // kiểm tra xem dữ liệu có hợp lệ không
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map((message) => message.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            messages,
        });
    }
    // kiểm tra xem username đã tồn tại chưa
    const exitEmail = await User.findOne({ email });
    // const exitUser = await User.findOne({ name });
    // if (exitUser) {
    //     return res.status(StatusCodes.BAD_REQUEST).json({
    //         messages: ["Tên tài khoản đã tồn tại"],
    //     });
    // }
    if (exitEmail) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            messages: ["Email đã tồn tại"],
        });
    }

    // mã hóa password
    const hashedPassword = await bcryptjs.hash(password, 10);
    const role = (await User.countDocuments({})) === 0 ? "admin" : "user";
    // lưu vào database
    const useName = req.body.name;
    const user = await User.create({
        ...req.body,
        password: hashedPassword,
        role,
    });
    User.password = undefined;
    return res.status(StatusCodes.CREATED).json({
        user,
    });
};
exports.signin = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
            messages: ["Email không tồn tại"],
        });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            messages: ["Mật khẩu không chính xác"],
        });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, "123456", {
        expiresIn: "7d",
    });
    return res.status(StatusCodes.OK).json({
        user: {
            email: user.email,
            role: user.role // Thêm thông tin vai trò
        },
        token,
    });
};
exports.checkrole = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const { id } = jwt.verify(token, "123456");
        const acc = await User.findById(id);
        if (acc.role != "admin") {
            return res.status(401).json({ message: "Bạn không có quyền " });
        }
        next();
    } catch (error) {
        console.log(error);
    }
}
exports.logout = async(req, res) => {};

exports.getUserData = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "123456");
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
        return res.status(StatusCodes.OK).json(user);
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
    }
};

// Middleware xác thực token
exports.authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET || "123456", (err, user) => {
        if (err) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
        }
        req.user = user;
        next();
    });
};

// exports.authenticateToken2 = (req, res, next) => {
//     const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });
  
//     try {
//       const decoded = jwt.verify(token, '123456'); // Thay 'secretKey' bằng khóa bí mật của bạn
//       req.user = decoded;
//       next();
//     } catch (error) {
//       res.status(400).json({ message: 'Invalid token' });
//     }
//   };