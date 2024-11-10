const Cart = require('../models/Cart_model');
const Product = require('../models/Product_model');
const User = require('../models/User');

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  // const userId = req.params.userId; // ID của người dùng
  const {userId, productId, quantity, size } = req.body; // ID sản phẩm và số lượng
  
  
  try {
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Tìm giỏ hàng của người dùng hoặc tạo mới nếu chưa có
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Tìm sản phẩm trong giỏ hàng
    // Kiểm tra nếu sản phẩm và kích cỡ đã tồn tại
       const cartItem = cart.items.find(item => item.product.equals(productId) && item.size === size);

    if (cartItem) {
      // Nếu sản phẩm đã có, cập nhật số lượng
      cartItem.quantity += quantity;
    } else {
      // Nếu sản phẩm chưa có, thêm sản phẩm mới vào giỏ
      cart.items.push({ product: productId, quantity, size: size  });
    }

    // Tính toán tổng giá trị giỏ hàng
    await cart.calculateTotalPrice();

    // Lưu giỏ hàng
    await cart.save();

    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getCart = async (req, res) => {
  const userId = req.params.id;

  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Tìm giỏ hàng của người dùng và populate để lấy thông tin chi tiết của sản phẩm
    const cart = await Cart.findOne({ user: user._id }).populate('items.product');
    
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Trả về thông tin chi tiết giỏ hàng
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Tăng số lượng sản phẩm trong giỏ hàng
exports.increaseQuantity = async (req, res) => {
  const { itemId } = req.body;
  const userId = req.params.id;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const cartItem = cart.items.id(itemId);
    if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });

    cartItem.quantity += 1;
    await cart.save();

    res.status(200).json({ message: 'Quantity increased', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.decreaseQuantity = async (req, res) => {
  const { itemId } = req.body;
  const userId = req.params.id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const cartItem = cart.items.id(itemId);
    if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });

    // Kiểm tra số lượng của sản phẩm
    if (cartItem.quantity > 1) {
      // Nếu số lượng lớn hơn 1, giảm số lượng
      cartItem.quantity -= 1;
    } else {
      // Nếu số lượng bằng 1, xóa sản phẩm khỏi giỏ hàng
      cart.items.pull(itemId);
    }

    // Tính toán lại tổng giá trị giỏ hàng
    await cart.calculateTotalPrice();

    // Lưu giỏ hàng sau khi cập nhật
    await cart.save();

    res.status(200).json({ message: 'Quantity decreased or item removed', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Xóa một sản phẩm cụ thể khỏi giỏ hàng
exports.removeItem = async (req, res) => {
  const { itemId } = req.body;
  const userId = req.params.id;

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Tìm sản phẩm cần xóa trong giỏ hàng
    const itemIndex = cart.items.findIndex((item) => item._id.equals(itemId));
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    // Xóa sản phẩm khỏi giỏ hàng
    cart.items.splice(itemIndex, 1);

    // Tính toán lại tổng giá trị giỏ hàng
    await cart.calculateTotalPrice();

    // Lưu giỏ hàng sau khi xóa sản phẩm
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



