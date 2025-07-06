const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  telegram: String,
  phone: String,
  project: String, // ✅ qo‘shildi
  category: String, // ✅ qo‘shildi
  date: String, // ✅ qo‘shildi (sana string holatda)
});

module.exports = mongoose.model("Client", ClientSchema);
