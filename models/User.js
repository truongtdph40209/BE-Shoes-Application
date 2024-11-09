
const db = require("../config/db");
const { Schema, model } = db;


const UserSchema = new Schema(
  {
    name: { type: String, default: function() { return this.email.split('@')[0]; } },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    password: { type: String, minlength: 6, required: true },
    address: { type: String, required: false },
    avatar: { 
      type: String, 
      default: "../public/images/default-avatar-profile-icon-vector-social-media-user-image-182145777.webp"
    }
  },
  {
    collection: "Users",
    timestamps: true,
  }
);

const User = model("User", UserSchema);
module.exports = User;  
