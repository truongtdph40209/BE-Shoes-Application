const db = require("../config/db");
const { Schema, model } = db;

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: {
          type: String,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    collection: "Carts",
    timestamps: true,
  }
);

CartSchema.methods.calculateTotalPrice = async function () {
  await this.populate("items.product");

  this.totalPrice = this.items.reduce((acc, item) => {
    const productPrice = item.product?.price || 0; // Sử dụng ?. để xử lý trường hợp product không tồn tại
    return acc + item.quantity * productPrice;
  }, 0);

  return this.totalPrice;
};

// Middleware tính toán totalPrice trước khi lưu
CartSchema.pre("save", async function (next) {
  await this.calculateTotalPrice();
  next();
});

const Cart = model("Cart", CartSchema);
module.exports = Cart;
