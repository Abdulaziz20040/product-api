const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://Abdulaziz:8765432112345@cluster0.h5cubol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDBga ulanish muvaffaqiyatli!"))
  .catch((err) => console.log("MongoDBga ulanishda xatolik:", err));

// GET /products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST /products
app.post("/products", async (req, res) => {
  const { name, description, price } = req.body;
  const product = new Product({ name, description, price });
  await product.save();
  res.status(201).json(product);
});

app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});
