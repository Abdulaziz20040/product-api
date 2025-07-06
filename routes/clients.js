const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const Project = require("../models/Project");

// ✅ 1. GET barcha clientlar + asosiy project ma'lumotlari
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();

    const clientsWithProjectInfo = await Promise.all(
      clients.map(async (client) => {
        const project = await Project.findOne({ clientId: client._id })
          .sort({ startDate: 1 }) // startDate bo‘yicha birinchi project
          .select("title category startDate");

        return {
          id: client._id,
          name: client.name,
          telegram: client.telegram,
          phone: client.phone,
          project: project?.title || null,
          category: project?.category || null,
          date: project?.startDate
            ? project.startDate.toISOString().split("T")[0]
            : null,
        };
      })
    );

    res.json(clientsWithProjectInfo);
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

// ✅ 5. Clientni o‘chirish + bog‘langan projectlarni o‘chirish
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Topilmadi" });

    // Bog‘langan projectlarni o‘chirish
    await Project.deleteMany({ clientId: req.params.id });

    res.json({ message: "Client va bog‘langan projectlar o‘chirildi" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
