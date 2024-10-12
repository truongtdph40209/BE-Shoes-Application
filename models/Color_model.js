// models/Color.js
const db = require("../config/db");
const { Schema, model } = db;

const ColorSchema = new Schema(
  {
    colorName: {
      type: String,
      required: false,
    }
  },
  {
    collection: "Colors",
    timestamps: true,
  }
);

const Color = model("Color", ColorSchema);
module.exports = Color;
