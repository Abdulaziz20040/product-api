// models/History.js
const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    price: Number,
    startDate: Date,
    endDate: Date,
    desc: String,
    link: String,
    github: String,
    technology: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", HistorySchema);
