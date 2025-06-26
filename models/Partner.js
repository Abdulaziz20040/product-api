const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Partner", PartnerSchema);
