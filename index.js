const mongoose = require("mongoose");
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// MongoDB ga ulanish
mongoose
  .connect(
    "mongodb+srv://Abdulaziz:8765432112345@cluster0.h5cubol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDBga ulanish muvaffaqiyatli!"))
  .catch((err) => console.log("MongoDBga ulanishda xatolik:", err));

// Product schema va model
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

// Barcha mahsulotlarni olish
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Yangi mahsulot qo'shish
app.post("/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// Mahsulotni o'chirish
app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Mahsulot o'chirildi" });
});

// Server ishga tushadi
app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});
