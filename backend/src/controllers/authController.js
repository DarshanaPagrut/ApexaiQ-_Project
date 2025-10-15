const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Student = require("../models/studentModel");
const Alumni = require("../models/alumniModel");
const StudentMaster = require("../models/studentMasterModel");
const AlumniMaster = require("../models/alumniMasterModel");
require("dotenv").config();

// Helper function: Normalize name
const normalizeName = (name) => name.trim().toLowerCase();

// ==========================
// REGISTER
// ==========================
exports.register = async (req, res) => {
  try {
    const { role, name, email, password, college_id, year_of_study, branch, graduation_year, linkedin_url } = req.body;

    // Basic validation
    if (!role || !name || !email || !password || (role === "student" && (!college_id || !year_of_study || !branch)) || (role === "alumni" && (!graduation_year || !branch))) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Determine status based on master list
    let status = "active";

    if (role === "student") {
      const studentMaster = await StudentMaster.findOne({
        where: {
          normalized_name: normalizeName(name),
          branch,
          graduation_year: year_of_study,
        },
      });
      if (!studentMaster) status = "pending";
    }

    if (role === "alumni") {
      const alumniMaster = await AlumniMaster.findOne({
        where: {
          normalized_name: normalizeName(name),
          branch,
          graduation_year,
        },
      });
      if (!alumniMaster) status = "pending";
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role,
      status,
    });

    // Create role-specific record
    if (role === "student") {
      await Student.create({
        user_id: user.id,
        college_id,
        year_of_study,
        branch,
        linkedin_url,
      });
    } else if (role === "alumni") {
      await Alumni.create({
        user_id: user.id,
        graduation_year,
        branch,
        linkedin_url,
      });
    }

    // Return response
    if (status === "pending") {
      return res.status(200).json({ message: "Registration pending verification by admin." });
    }
    return res.status(201).json({ message: "Registration successful", userId: user.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// LOGIN
// ==========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.status === "pending") return res.status(403).json({ message: "Your account is pending verification" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token, userId: user.id, role: user.role, name: user.name });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
