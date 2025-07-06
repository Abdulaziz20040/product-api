const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  telegram: { type: String, required: true },
  github: String,
  desc: String,
  category: String,
  technology: [String],
  startDate: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["employee", "admin", "founder"],
    default: "employee",
  },
  status: {
    type: String,
    enum: ["kutilmoqda", "tasdiqlangan", "rad etilgan"],
    default: "kutilmoqda",
  },
  img: String,
  jins: {
    type: String,
    enum: ["Erkak", "Ayol"],
  },
});

module.exports = mongoose.model("User", UserSchema);
