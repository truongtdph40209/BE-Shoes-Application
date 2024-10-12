const db = require("../config/db");
const { Schema, model } = db;

const OrderStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const PaymentMethod = {
  MOMO: "momo",
  CASH: "cash",
};

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến model User
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus), // Chỉ chấp nhận các giá trị trong OrderStatus
      default: OrderStatus.PENDING,
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
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Shoes", // Tham chiếu đến model Shoes (hoặc sản phẩm bạn muốn)
        required: true,
      },
    ],
    userNote: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    collection: "Orders",
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model Order
const Order = model("Order", OrderSchema);

module.exports = Order;
