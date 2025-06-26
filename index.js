const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects"); // ✅ QO‘SHILDI
const clientRoutes = require("./routes/clients");
const orderRoutes = require("./routes/orders");
const employeeRoutes = require("./routes/employees");
const historyRoutes = require("./routes/history");
const partnerRoutes = require("./routes/partners");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ROUTELARNI ULASH
app.use("/auth", authRoutes); // POST /api/auth/login | /register
app.use("/projects", projectRoutes);
app.use("/clients", clientRoutes); // ➕ qo‘shing
app.use("/orders", orderRoutes); // http://localhost:3000/orders
app.use("/employees", employeeRoutes);
app.use("/history", historyRoutes); // ➕ Tarix routeni ulash
app.use("/partners", partnerRoutes);

// MongoDB ULANISH
mongoose
  .connect(
    "mongodb+srv://Abdulaziz:8765432112345@cluster0.h5cubol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ MongoDBga ulanish muvaffaqiyatli!"))
  .catch((err) => console.error("❌ MongoDBga ulanishda xatolik:", err));

// SERVER TUSHURISH
app.listen(PORT, () => {
  console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
});
