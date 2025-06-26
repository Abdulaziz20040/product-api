const express = require("express");
const router = express.Router();
const History = require("../models/History");

// ✅ Barcha tarixdagi zakazlarni olish
router.get("/", async (req, res) => {
  try {
    const allHistory = await History.find().populate("members");
    res.json(allHistory);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err });
  }
});

// ✅ Bitta tarixdagi zakazni olish
router.get("/:id", async (req, res) => {
  try {
    const history = await History.findById(req.params.id).populate("members");
    if (!history) return res.status(404).json({ message: "Topilmadi" });
    res.json(history);
  } catch (err) {
    res.status(400).json({ message: "Xato ID format" });
  }
});

// ✅ Yangi tarixdagi zakaz qo‘shish (qo‘lda kerak bo‘lsa)
router.post("/", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      startDate,
      endDate,
      desc,
      link,
      github,
      technology,
      members,
      completedAt,
    } = req.body;

    const newHistory = new History({
      name,
      category,
      price,
      startDate,
      endDate,
      desc,
      link,
      github,
      technology,
      members,
      completedAt: completedAt || Date.now(),
    });

    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Tarixdagi zakazni o‘chirish
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await History.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Topilmadi" });
    res.json({ message: "Tarixdagi zakaz o‘chirildi" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
