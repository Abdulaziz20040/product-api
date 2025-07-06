const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  telegram: String,
  phone: String,
  company: String,
});

module.exports = mongoose.model("Client", ClientSchema);
