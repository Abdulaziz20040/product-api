const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const Project = require("../models/Project");

// ✅ 1. GET barcha clientlar + ularning projectlari
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();

    const clientsWithProjects = await Promise.all(
      clients.map(async (client) => {
        const projects = await Project.find({ clientId: client._id }).select(
          "title category startDate endDate"
        );

        return {
          id: client._id,
          name: client.name,
          telegram: client.telegram,
          phone: client.phone,
          company: client.company,
          projects,
        };
      })
    );

    res.json(clientsWithProjects);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err });
  }
});

// ✅ 2. GET bitta client (projectsiz)
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Topilmadi" });
    res.json(client);
  } catch (err) {
    res.status(400).json({ message: "Xato ID format" });
  }
});

// ✅ 3. Yangi client yaratish
router.post("/", async (req, res) => {
  try {
    const { name, telegram, phone, company } = req.body;

    const newClient = new Client({
      name,
      telegram,
      phone,
      company,
    });

    await newClient.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ 4. Clientni yangilash
router.patch("/:id", async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedClient) return res.status(404).json({ message: "Topilmadi" });
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ 5. Clientni o‘chirish
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Topilmadi" });

    // ❗ Bog‘langan projectlarni ham o‘chirish (ixtiyoriy)
    await Project.deleteMany({ clientId: req.params.id });

    res.json({ message: "Client va bog‘langan projectlar o‘chirildi" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
