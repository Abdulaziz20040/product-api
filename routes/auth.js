const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
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

// ✅ 1. Hodimni ro'yxatdan o'tkazish
router.post("/register", async (req, res) => {
  const { name, category, desc, telegram, phone, github, technology, img } =
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
      img,
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
    if (!user)
      return res.status(401).json({ message: "Login maʼlumotlari noto‘g‘ri" });
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
      message: "Muvaffaqiyatli login",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        telegram: user.telegram,
        role: user.role,
        img: user.img || null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err });
  }
});

// ✅ 3. Kutilayotganlar
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

// ✅ 5. Tasdiqlanganlar
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

// ✅ 6. Foydalanuvchini yangilash (faqat founder/super_admin)
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.status(200).json({ message: "Yangilandi", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err });
  }
});

// ✅ 7. Bekor qilish
router.delete("/reject/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "So‘rov topilmadi" });
    res.status(200).json({ message: "So‘rov bekor qilindi" });
  } catch (err) {
    res.status(500).json({ message: "Xatolik", error: err });
  }
});

// ✅ 8. Founder ni bir marta yaratish (test maqsad)
router.post("/seedFounder", async (req, res) => {
  try {
    const isExists = await User.findOne({ telegram: "@founder" });
    if (isExists)
      return res.status(400).json({ message: "Founder allaqachon mavjud" });

    const newUser = new User({
      name: "Abdulaziz",
      telegram: "@founder",
      phone: "+998 77 014 50 47",
      role: "founder",
      status: "tasdiqlangan",
      category: "Fullstack",
      desc: "Asosiy tizim boshqaruvchisi",
      github: "",
      img: "https://example.com/founder.jpg",
      technology: ["Node.js", "React"],
      startDate: new Date(),
    });

    await newUser.save();
    res.status(201).json({ message: "✅ Founder yaratildi!" });
  } catch (err) {
    res.status(500).json({ message: "❌ Xatolik", error: err });
  }
});

module.exports = router;
