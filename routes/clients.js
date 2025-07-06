const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// ✅ Barcha clientlar
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();

    // id ni to‘g‘ri ko‘rsatish va kerakli maydonlarni chiqarish
    const result = clients.map((client) => ({
      id: client._id,
      name: client.name,
      telegram: client.telegram,
      phone: client.phone,
      project: client.project,
      category: client.category,
      date: client.date,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err });
  }
});

// ✅ Yangi client yaratish
router.post("/", async (req, res) => {
  try {
    const { name, telegram, phone, project, category, date } = req.body;

    const newClient = new Client({
      name,
      telegram,
      phone,
      project,
      category,
      date,
    });

    await newClient.save();

    res.status(201).json({
      id: newClient._id,
      name: newClient.name,
      telegram: newClient.telegram,
      phone: newClient.phone,
      project: newClient.project,
      category: newClient.category,
      date: newClient.date,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Bitta client (id orqali)
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Topilmadi" });

    res.json({
      id: client._id,
      name: client.name,
      telegram: client.telegram,
      phone: client.phone,
      project: client.project,
      category: client.category,
      date: client.date,
    });
  } catch (err) {
    res.status(400).json({ message: "Xato ID format" });
  }
});

// ✅ Client yangilash
router.patch("/:id", async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedClient) return res.status(404).json({ message: "Topilmadi" });

    res.json({
      id: updatedClient._id,
      name: updatedClient.name,
      telegram: updatedClient.telegram,
      phone: updatedClient.phone,
      project: updatedClient.project,
      category: updatedClient.category,
      date: updatedClient.date,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Client o‘chirish
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Topilmadi" });

    res.json({ message: "Client o‘chirildi" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
