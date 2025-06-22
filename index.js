const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// MongoDB ulanish
mongoose
  .connect(
    "mongodb+srv://Abdulaziz:8765432112345@cluster0.h5cubol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDBga ulanish muvaffaqiyatli!"))
  .catch((err) => console.error("MongoDBga ulanishda xatolik:", err));

// GET barcha productlar
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET bitta product
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Topilmadi" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Xato ID format" });
  }
});

// POST yangi product yaratish
app.post("/products", async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const product = new Product({ name, description, price });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH (update)
app.patch("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Topilmadi" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Topilmadi" });
    res.json({ message: "O'chirildi" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});
