// 🔐 Admin Panel uchun to‘liq Auth tizimi (Node.js + JWT)

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

// 🔐 Middleware: Token tekshiruv
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token yuborilmadi" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token noto‘g‘ri yoki muddati tugagan" });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== "super_admin" && req.user.role !== "founder") {
    return res.status(403).json({ message: "Ruxsat yo‘q" });
  }
  next();
}

// ✅ 1. Register (so‘rov yuborish)
router.post("/register", async (req, res) => {
  const { name, category, desc, telegram, phone, github, technology } =
    req.body;
  try {
    const newUser = new User({
      name,
      category,
      desc,
      telegram,
      phone,
      github,
      technology,
      status: "kutilmoqda",
      startDate: new Date(),
      role: "employee",
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "So‘rov yuborildi! Admin tasdiqlashi kutilmoqda." });
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err });
  }
});

// ✅ 2. Login
router.post("/login", async (req, res) => {
  const { telegram, phone } = req.body;
  try {
    const user = await User.findOne({ telegram, phone });
    if (!user) {
      return res.status(401).json({ message: "Login maʼlumotlari noto‘g‘ri" });
    }
    if (user.status !== "tasdiqlangan") {
      return res.status(403).json({ message: "Hali tasdiqlanmagan!" });
    }

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
      message: "Muvaffaqiyatli login",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        telegram: user.telegram,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err });
  }
});

// ✅ 3. Kutilayotgan foydalanuvchilar (admin)
router.get("/pending", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ status: "kutilmoqda" }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err });
  }
});

// ✅ 4. Tasdiqlash
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
    res.status(500).json({ message: "Xatolik", error: err });
  }
});

// ✅ 5. Tasdiqlangan foydalanuvchilar
router.get("/confirmed", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ status: "tasdiqlangan" }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err });
  }
});

// 🔧 Faqat bir marta ishlatiladigan Founder yaratish route (test purpose)
router.post("/seedFounder", async (req, res) => {
  try {
    const isExists = await User.findOne({ telegram: "@founder" });
    if (isExists)
      return res.status(400).json({ message: "Founder allaqachon mavjud" });

    const newUser = new User({
      name: "Asosiy Founder",
      telegram: "@founder",
      phone: "+998 91 000 00 00",
      role: "founder",
      status: "tasdiqlangan",
      category: "Fullstack",
      desc: "Asosiy tizim boshqaruvchisi",
      github: "",
      technology: ["Node.js", "React"],
      startDate: new Date(),
    });

    await newUser.save();
    res.status(201).json({ message: "✅ Founder yaratildi!" });
  } catch (err) {
    res.status(500).json({ message: "❌ Xatolik", error: err });
  }
});

// ✅ 6. Bekor qilish (admin rad etadi)
router.delete("/reject/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "So‘rov topilmadi" });
    res.status(200).json({ message: "So‘rov bekor qilindi" });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err });
  }
});

module.exports = router;

/*
Frontend URL:
✅ POST /auth/register — So‘rov yuborish (kutilmoqda)
✅ POST /auth/login — Login qilish
✅ GET /auth/pending — Admin uchun kutilayotganlar
✅ PUT /auth/confirm/:id — Admin tasdiqlaydi
✅ DELETE /auth/reject/:id — Admin rad etadi
✅ GET /auth/confirmed — Tasdiqlanganlar
*/
