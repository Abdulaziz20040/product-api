const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// GET all projects
router.get("/", async (req, res) => {
  const projects = await Project.find().populate("clientId");
  res.json(projects);
});

// GET project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("clientId");
    if (!project) return res.status(404).json({ message: "Topilmadi" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: "Xato ID format" });
  }
});

// POST new project
router.post("/", async (req, res) => {
  try {
    const {
      title,
      desc,
      price,
      startDate,
      endDate,
      category,
      link,
      github,
      clientId,
    } = req.body;

    const newProject = new Project({
      title,
      desc,
      price,
      startDate,
      endDate,
      category,
      link,
      github,
      clientId,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE
router.patch("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("clientId");

    if (!project) return res.status(404).json({ message: "Topilmadi" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Topilmadi" });
    res.json({ message: "O‘chirildi" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
