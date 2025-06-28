const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  category: { type: String, enum: ["web", "mobile"], required: true },
  img: { type: String, required: true },
});

module.exports = mongoose.model("slider", sliderSchema);
