const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const sequelize = require("../config/db");

(async () => {
  await sequelize.sync();
  const hashed = await bcrypt.hash("admin@123", 10);
  const [admin, created] = await User.findOrCreate({
    where: { email: "admin@college.in" },
    defaults: {
      name: "Platform Admin",
      password_hash: hashed,
      role: "admin",
      status: "active",
    },
  });
  console.log(created ? "✅ Admin created!" : "ℹ️ Admin already exists.");
  process.exit();
})();
