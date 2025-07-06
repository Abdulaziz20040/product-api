const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

// 🔐 Middleware: Token tekshirish
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token yuborilmadi" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res
      .status(403)
      .json({ message: "Token noto‘g‘ri yoki muddati tugagan" });
  }
}

// 🔐 Middleware: Admin yoki Founder bo'lishi kerak
function isAdmin(req, res, next) {
  if (!["founder", "super_admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Ruxsat yo‘q" });
  }
  next();
}

// ✅ Ro'yxatdan o'tish
router.post("/register", async (req, res) => {
  const {
    username,
    password,
    name,
    category,
    desc,
    telegram,
    phone,
    github,
    technology,
    img,
    jins,
  } = req.body;

  try {
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "Bu username allaqachon mavjud" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      category,
      desc,
      telegram,
      phone,
      github,
      technology,
      img,
      jins,
      status: "kutilmoqda",
      role: "employee",
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "✅ So‘rov yuborildi! Admin tasdiqlashi kutilmoqda." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "❌ Ro‘yxatdan o‘tishda xatolik", error: err.message });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Username noto‘g‘ri" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Parol noto‘g‘ri" });

    if (user.status !== "tasdiqlangan")
      return res.status(403).json({ message: "Hali tasdiqlanmagan!" });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "✅ Muvaffaqiyatli login",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        telegram: user.telegram,
        img: user.img,
        jins: user.jins,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
});

// ✅ Kutilayotgan foydalanuvchilar
router.get("/pending", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ status: "kutilmoqda" });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err.message });
  }
});

// ✅ Tasdiqlangan foydalanuvchilar
router.get("/confirmed", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ status: "tasdiqlangan" });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err.message });
  }
});

// ✅ Tasdiqlash
router.put("/confirm/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "tasdiqlangan" },
      { new: true }
    );
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.status(200).json({ message: "Tasdiqlandi", user });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err.message });
  }
});

// ✅ Yangilash
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.status(200).json({ message: "Yangilandi", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err.message });
  }
});

// ✅ Bekor qilish (rad etish)
router.delete("/reject/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "So‘rov topilmadi" });
    res.status(200).json({ message: "So‘rov bekor qilindi" });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err.message });
  }
});

// ✅ Founder yaratish (bir martalik)
router.post("/seedFounder", async (req, res) => {
  try {
    const isExists = await User.findOne({ username: "founder" });
    if (isExists)
      return res.status(400).json({ message: "Founder allaqachon mavjud" });

    const hashedPassword = await bcrypt.hash("123456", 10);

    const newUser = new User({
      username: "founder",
      password: hashedPassword,
      name: "Abdulaziz",
      telegram: "@founder",
      phone: "+998 77 014 50 47",
      role: "founder",
      status: "tasdiqlangan",
      category: "Fullstack",
      desc: "Asosiy tizim boshqaruvchisi",
      github: "",
      img: "https://example.com/founder.jpg",
      jins: "Erkak",
      technology: ["Node.js", "React"],
    });

    await newUser.save();
    res.status(201).json({ message: "✅ Founder yaratildi!" });
  } catch (err) {
    res.status(500).json({ message: "❌ Xatolik", error: err.message });
  }
});

module.exports = router;
