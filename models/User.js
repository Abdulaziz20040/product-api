const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // keyinchalik bcrypt qo‘shish mumkin
  role: {
    type: String,
    enum: ["employee", "admin", "founder"],
    default: "employee",
  },

  name: String,
  phone: String,
  telegram: String,
  github: String,
  desc: String,
  category: String, // masalan: Frontend, Backend
  technology: [String],
  startDate: String, // ISO
  status: {
    type: String,
    enum: ["kutilmoqda", "tasdiqlangan", "rad etilgan"],
    default: "kutilmoqda",
  },
});

module.exports = mongoose.model("User", UserSchema);
