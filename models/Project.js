const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: String,
    price: Number,
    startDate: Date,
    endDate: Date,
    category: String,
    link: String,
    github: String,
    company: String, // bu partner.name bilan bog'lanadi
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
