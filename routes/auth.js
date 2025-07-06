// 🔐 JWT bilan login/register backend (access va refresh token bilan)

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// JWT funksiyalar
const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// 🆕 RO‘YXATDAN O‘TISH (employee) => /auth/register
router.post("/register", async (req, res) => {
  const {
    username,
    password,
    name,
    phone,
    telegram,
    github,
    desc,
    category,
    technology,
  } = req.body;

  if (!username || !password || !name || !category || !technology) {
    return res
      .status(400)
      .json({ message: "Majburiy maydonlar to‘ldirilmagan!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      phone,
      telegram,
      github,
      desc,
      category,
      technology,
      startDate: new Date().toISOString(),
      status: "kutilmoqda",
      role: "employee",
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "So‘rov yuborildi! Admin tasdiqlashi kutilmoqda." });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err });
  }
});

// 🔐 LOGIN => /auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ message: "Foydalanuvchi topilmadi" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Parol noto‘g‘ri" });

    if (user.status !== "tasdiqlangan") {
      return res.status(403).json({ message: "Hisob hali tasdiqlanmagan!" });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.status(200).json({
      message: "Muvaffaqiyatli login!",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err });
  }
});

// ♻️ ACCESS TOKEN YANGILASH => /auth/refresh
router.post("/refresh", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Token yo‘q" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });

    const accessToken = createAccessToken(user);
    res.status(200).json({ accessToken });
  } catch (err) {
    res
      .status(403)
      .json({ message: "Refresh token noto‘g‘ri yoki muddati o‘tgan" });
  }
});

module.exports = router;
