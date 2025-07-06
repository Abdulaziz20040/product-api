const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  desc: String,
  telegram: String,
  phone: String,
  github: String,
  img: String, // ✅ yangi rasm maydoni (URL yoki base64 bo'lishi mumkin)
  technology: [String],
  status: {
    type: String,
    enum: ["band", "bo‘sh"], // ✅ faqat 2 holat
    default: "bo‘sh",
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // ✅ Order modeli bilan bog‘lanadi
    },
  ],
});

module.exports = mongoose.model("Employee", EmployeeSchema);
