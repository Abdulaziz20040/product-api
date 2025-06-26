const express = require("express");
const router = express.Router();
const Partner = require("../models/Partner");
const Project = require("../models/Project");

// ✅ GET barcha hamkorlar + projectlari
router.get("/", async (req, res) => {
  try {
    const partners = await Partner.find();

    const result = await Promise.all(
      partners.map(async (partner) => {
        const projects = await Project.find({ company: partner.name }).select(
          "title category startDate endDate"
        );
        return {
          id: partner._id,
          name: partner.name,
          img: partner.img,
          date: partner.date,
          projects,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err });
  }
});

// ✅ GET bitta hamkor
router.get("/:id", async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Topilmadi" });

    const projects = await Project.find({ company: partner.name }).select(
      "title category startDate endDate"
    );

    res.json({ ...partner.toObject(), projects });
  } catch (err) {
    res.status(400).json({ message: "Xato ID format" });
  }
});

// ✅ POST yangi hamkor
router.post("/", async (req, res) => {
  try {
    const { name, img } = req.body;

    const newPartner = new Partner({ name, img });
    await newPartner.save();

    res.status(201).json(newPartner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ UPDATE
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Partner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Topilmadi" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Partner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Topilmadi" });
    res.json({ message: "O‘chirildi" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
