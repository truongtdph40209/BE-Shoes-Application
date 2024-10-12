// models/Product.js
const db = require("../config/db");
const { Schema, model } = db;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
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
    colors: [
      {
        type: String, 
      },
    ],
    sizes: [
      {
        type: String,  
      },
    ],
    images: [
      {
        type: String,  
      },
    ],
    userGender: {
      type: [String],
      enum: ['male', 'female', 'unisex'],
    },
  },
  {
    collection: "Products",
    timestamps: true,
  }
);

const Product = model("Product", ProductSchema);
module.exports = Product;
