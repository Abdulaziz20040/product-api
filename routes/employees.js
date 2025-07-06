const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const Order = require("../models/Order");

// 🔍 Barcha hodimlar + loyihalari
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().populate(
      "projects",
      "name category status"
    );
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err });
  }
});

// 🔍 Bitta hodim
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "projects"
    );
    if (!employee) return res.status(404).json({ message: "Topilmadi" });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: "Xato ID format" });
  }
});

// ➕ Yangi hodim qo‘shish
router.post("/", async (req, res) => {
  try {
    const {
      name,
      category,
      desc,
      telegram,
      phone,
      github,
      img, // ✅ qabul qilish
      technology,
      status,
      projects,
    } = req.body;

    const newEmp = new Employee({
      name,
      category,
      desc,
      telegram,
      phone,
      github,
      img, // ✅ saqlash
      technology,
      status,
      projects,
    });

    await newEmp.save();
    res.status(201).json(newEmp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✏️ Hodimni yangilash
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("projects");
    if (!updated) return res.status(404).json({ message: "Topilmadi" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ❌ Hodimni o‘chirish
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Topilmadi" });
    res.json({ message: "O‘chirildi" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
