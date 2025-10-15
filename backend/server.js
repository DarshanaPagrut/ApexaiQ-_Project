const express = require("express");
const cors = require("cors");
const sequelize = require("./src/config/db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));

// Sync models
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database synced!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




