const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // ✅ env'ni faollashtirish

// ROUTELAR
const authRoutes = require("./routes/auth");

const projectRoutes = require("./routes/projects");
const clientRoutes = require("./routes/clients");
const orderRoutes = require("./routes/orders");
const employeeRoutes = require("./routes/employees");
const historyRoutes = require("./routes/history");
const partnerRoutes = require("./routes/partners");
const sliderRoutes = require("./routes/sliderRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Barcha domenlarga ruxsat beruvchi CORS middleware
app.use(cors());

// JSON request'larni parse qilish
app.use(express.json());

// ROUTELARNI ULASH
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/clients", clientRoutes);
app.use("/orders", orderRoutes);
app.use("/employees", employeeRoutes);
app.use("/history", historyRoutes);
app.use("/partners", partnerRoutes);
app.use("/sliders", sliderRoutes);

// ✅ MongoDBga ulanish
mongoose
  .connect(
    "mongodb+srv://Abdulaziz:8765432112345@cluster0.h5cubol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ MongoDBga ulanish muvaffaqiyatli!"))
  .catch((err) => console.error("❌ MongoDBga ulanishda xatolik:", err));

// ✅ Server ishga tushirish
app.listen(PORT, () => {
  console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
});
