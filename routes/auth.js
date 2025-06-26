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
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err });
  }
});

// 🆕 REGISTER (username takrorlansa ham mayli)
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

module.exports = router;
