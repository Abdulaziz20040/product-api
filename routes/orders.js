// routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const History = require("../models/History"); // ✅ Tarix modeli

// ✅ GET barcha zakazlar
router.get("/", async (req, res) => {
  const orders = await Order.find().populate("members");
  res.json(orders);
});

// ✅ GET zakaz by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("members");
    if (!order) return res.status(404).json({ message: "Topilmadi" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: "Xato ID format" });
  }
});

// ✅ POST yangi zakaz
router.post("/", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      startDate,
      endDate,
      status,
      desc,
      link,
      github,
      technology,
      members,
    } = req.body;

    const newOrder = new Order({
      name,
      category,
      price,
      startDate,
      endDate,
      status,
      desc,
      link,
      github,
      technology,
      members,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ PATCH zakazni yangilash
router.patch("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findById(req.params.id);
    if (!updatedOrder) return res.status(404).json({ message: "Topilmadi" });

    const prevStatus = updatedOrder.status;
    Object.assign(updatedOrder, req.body);

    // Agar status "tugatildi" bo‘lsa, Historyga qo‘shamiz va Orderdan o‘chiramiz
    if (req.body.status === "tugatildi" && prevStatus !== "tugatildi") {
      const historyEntry = new History({
        name: updatedOrder.name,
        category: updatedOrder.category,
        price: updatedOrder.price,
        startDate: updatedOrder.startDate,
        endDate: updatedOrder.endDate,
        desc: updatedOrder.desc,
        link: updatedOrder.link,
        github: updatedOrder.github,
        technology: updatedOrder.technology,
        members: updatedOrder.members,
        completedAt: new Date(),
      });

      await historyEntry.save();
      await updatedOrder.deleteOne();

      return res.json({ message: "Zakaz tarixga ko‘chirildi" });
    }

    await updatedOrder.save();
    const populated = await updatedOrder.populate("members");
    res.json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE zakaz
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Topilmadi" });
    res.json({ message: "O‘chirildi" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
