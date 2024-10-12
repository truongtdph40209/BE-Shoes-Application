
const db = require("../config/db");
const { Schema, model } = db;

const SizeSchema = new Schema(
  {
    sizeName: {
      type: String,
      required: true,
    }
  },
  {
    collection: "Sizes",
    timestamps: true,
  }
);

const Size = model("Size", SizeSchema);
module.exports = Size;
