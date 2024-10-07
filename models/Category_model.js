// models/Category.js
const db = require("../config/db");
const { Schema, model } = db;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Categories",
    timestamps: true, // Tùy chọn để tự động thêm createdAt và updatedAt
  }
);

const Category = model("Category", CategorySchema);
module.exports = Category;
