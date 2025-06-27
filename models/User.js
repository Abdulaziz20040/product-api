// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["super_admin", "employee"], required: true }, // 2 xil: admin yoki hodim
});

module.exports = mongoose.model("User", UserSchema);
