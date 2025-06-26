const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  desc: String,
  telegram: String,
  phone: String,
  github: String,
  technology: [String],
  status: {
    type: String,
    enum: ["band", "bo‘sh"], // project olgan yoki yo‘q
    default: "bo‘sh",
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Zakazlar modeli
    },
  ],
});

module.exports = mongoose.model("Employee", EmployeeSchema);
