const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: String,
    price: Number,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["faol", "nofaol", "kutilmoqda", "tugatildi", "endi boshlandi"],
      default: "kutilmoqda",
    },
    desc: String,
    link: String,
    github: String,
    technology: [String], // texnologiyalar ro‘yxati (masalan, ["React", "Node.js"])
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // yoki "Employee", agar hodimlar shu modelda
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
