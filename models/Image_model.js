// models/Image.js
const db = require("../config/db");
const { Schema, model } = db;

const ImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    }
  },
  {
    collection: "Images",
    timestamps: true,
  }
);

const Image = model("Image", ImageSchema);
module.exports = Image;
