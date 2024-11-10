const db = require("../config/db");
const { Schema, model } = db;

// Các phương thức thanh toán
const PaymentMethod = {
  MOMO: "momo",
  CASH: "cash",
};

// Định nghĩa schema cho đơn hàng
const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến model User
      required: true,
    },
    totalPrice: {
      type: Number,
      required: false,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod), // Chỉ chấp nhận các giá trị trong PaymentMethod
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product", // Tham chiếu đến model Product nếu có
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, 
        },
        size: {  // Trường size được thêm vào đây
          type: String,  // Có thể là một chuỗi mô tả như "S", "M", "L"
          required: true, 
        },
      },
    ],
  },
  {
    collection: "Orders",
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Order = model("Order", OrderSchema);

module.exports = Order;
