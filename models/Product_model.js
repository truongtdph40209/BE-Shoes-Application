// models/Product.js
const db = require("../config/db");
const { Schema, model } = db;

// Định nghĩa model Product
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category', // Tham chiếu đến model Category
      },
    ],
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    thumbnail: {
      type: [String],
      required: true,
    },
    userGender: {
      type: [String],
      enum: ['male', 'female', 'unisex'],
    },
  },
  {
    collection: "Products",
    timestamps: true, // Tùy chọn để tự động thêm createdAt và updatedAt
  }
);

// Tạo model Product
const Product = model("Product", ProductSchema);
module.exports = Product;
