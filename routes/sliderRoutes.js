const express = require("express");
const router = express.Router();
const Slider = require("../models/Slider"); // model nomi "Slider"

// ➕ Yangi slider qo‘shish
router.post("/", async (req, res) => {
  try {
    const newSlider = await Slider.create(req.body);
    res.status(201).json(newSlider);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📥 Barcha sliderlar
router.get("/", async (req, res) => {
  try {
    const sliders = await Slider.find();
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🖊 ID bo‘yicha yangilash
router.put("/:id", async (req, res) => {
  try {
    const updated = await Slider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ O‘chirish
router.delete("/:id", async (req, res) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);
    res.json({ message: "Slider o‘chirildi" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
