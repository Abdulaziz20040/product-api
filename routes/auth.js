const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: "Login yoki parol noto‘g‘ri" });
    }

    res.status(200).json({
      message: "Muvaffaqiyatli login!",
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err });
  }
});

// 🆕 REGISTER
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ message: "Barcha maydonlar to‘ldirilishi shart!" });
  }

  try {
    const newUser = new User({ username, password, role });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Foydalanuvchi muvaffaqiyatli yaratildi!" });
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err });
  }
});

// 📄 HAMMA FOYDALANUVCHILAR
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err });
  }
});

// 🔍 BIR FOYDALANUVCHINI OLIB KELISH
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err });
  }
});

// ✏️ FOYDALANUVCHINI TAHRIRLASH
router.put("/users/:id", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, password, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    res.status(200).json({ message: "Tahrirlandi", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err });
  }
});

// ❌ FOYDALANUVCHINI O‘CHIRISH
router.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }
    res.status(200).json({ message: "O‘chirildi!" });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err });
  }
});

module.exports = router;
