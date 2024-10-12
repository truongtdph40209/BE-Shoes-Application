// models/Category.js
const db = require("../config/db");
const { Schema, model } = db;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    logo: {
      type: String,
      required: false,
    },
  },
  {
    collection: "Categories",
    timestamps: true, // Tùy chọn để tự động thêm createdAt và updatedAt
  }
);

const Category = model("Category", CategorySchema);
module.exports = Category;
