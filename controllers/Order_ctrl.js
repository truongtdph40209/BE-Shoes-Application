const Order = require("../models/Order_model");
const Cart = require("../models/Cart_model"); // Giả sử bạn có model Cart
const Product = require("../models/Product_model"); // Giả sử bạn có model Product
// Tạo đơn hàng mới
// exports.createOrder = async (req, res) => {
//   try {
//     const { userId,totalPrice, paymentMethod, shippingAddress, phoneNumber, cartId } = req.body;

//     // Tạo đối tượng đơn hàng mới
//     const newOrder = new Order({
//       user: userId,
//       totalPrice,
//       paymentMethod,
//       shippingAddress,
//       phoneNumber,
//       cart:cartId,
//     });

//     const cart = await Cart.findById(cartId).populate('cartItems.productId'); // Giả sử cartItems chứa các sản phẩm trong giỏ

//     let calculatedTotalPrice = 0;
//     const products = cart.cartItems.map(item => {
//       calculatedTotalPrice += item.productId.price * item.quantity; // Tổng giá trị = giá sản phẩm * số lượng
//       return {
//         productId: item.productId._id, // Lưu productId
//         quantity: item.quantity, // Lưu số lượng
//       };
//     });
//     // Lưu đơn hàng vào cơ sở dữ liệu
//     await newOrder.save();

//     // Trả về kết quả
//     res.status(201).json({
//       message: "Order created successfully",
//       order: newOrder,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error creating order",
//       error: err.message,
//     });
//   }
// };
exports.createOrder = async (req, res) => {
  try {
    const { userId, paymentMethod, shippingAddress, phoneNumber, cartId } = req.body;

    // Lấy giỏ hàng từ database dựa trên cartId
    const cart = await Cart.findById(cartId).populate('items.product'); // Giả sử cartItems chứa các sản phẩm trong giỏ

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // Tính tổng giá trị đơn hàng từ các sản phẩm trong giỏ
    let calculatedTotalPrice = 0;
    const products = cart.items.map(item => {
      calculatedTotalPrice += item.product.price * item.quantity; // Tổng giá trị = giá sản phẩm * số lượng
      return {
        productId: item.product._id, // Lưu productId
        quantity: item.quantity, // Lưu số lượng
        size: item.size,
      };
    });

    // Tạo đối tượng đơn hàng mới
    const newOrder = new Order({
      user: userId,
      totalPrice: calculatedTotalPrice, // Gán tổng giá trị tính toán vào trường totalPrice
      paymentMethod,
      shippingAddress,
      phoneNumber,
      products, // Lưu các sản phẩm trong đơn hàng
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await newOrder.save();

    // Trả về kết quả
    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating order",
      error: err.message,
    });
  }
};


//   try {
//     // Lấy tất cả các đơn hàng của người dùng, nếu có userId trong params
//     const userId = req.params.id;

//     // Kiểm tra nếu userId có tồn tại
//     if (!userId) {
//       return res.status(400).json({
//         message: "User ID is required",
//       });
//     }

//     // Tìm tất cả các đơn hàng của người dùng với userId
//     const orders = await Order.find({ user: userId }).populate("products"); // Populate Cart để lấy thông tin giỏ hàng

//     // Nếu không tìm thấy đơn hàng
//     if (orders.length === 0) {
//       return res.status(404).json({
//         message: "No orders found for this user",
//       });
//     }

//     // Trả về danh sách các đơn hàng
//     res.status(200).json({
//       message: "Orders fetched successfully",
//       orders,
//     });
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     res.status(500).json({
//       message: "Error fetching orders",
//       error: err.message,
//     });
//   }
// };

exports.getOrders = async (req, res) => {
  try {
    // Lấy tất cả các đơn hàng của người dùng, nếu có userId trong params
    const userId = req.params.id;

    // Kiểm tra nếu userId có tồn tại
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    // Tìm tất cả các đơn hàng của người dùng với userId và populate thông tin sản phẩm (name và price)
    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId", // Populate thông tin chi tiết của sản phẩm
        select: "name price images", // Lấy tên và giá sản phẩm
      });

    // Nếu không tìm thấy đơn hàng
    if (orders.length === 0) {
      return res.status(404).json({
        message: "No orders found for this user",
      });
    }

    // Trả về danh sách các đơn hàng với thông tin sản phẩm chi tiết
    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({
      message: "Error fetching orders",
      error: err.message,
    });
  }
};

