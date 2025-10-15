const csv = require("csv-parser");
const fs = require("fs");
const AlumniMaster = require("../models/alumniMasterModel");
const StudentMaster = require("../models/studentMasterModel");
const User = require("../models/userModel");
const { Op } = require("sequelize");

// ==========================
// UPLOAD ALUMNI MASTER CSV
// ==========================
exports.uploadAlumniMaster = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file required" });

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (const row of results) {
          await AlumniMaster.create({
            name: row.name,
            graduation_year: parseInt(row.graduation_year),
            branch: row.branch,
            normalized_name: row.name.trim().toLowerCase(),
          });
        }
        fs.unlinkSync(req.file.path);
        res.status(201).json({ message: "Alumni master list uploaded successfully" });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// UPLOAD STUDENT MASTER CSV
// ==========================
exports.uploadStudentMaster = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file required" });

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (const row of results) {
          await StudentMaster.create({
            name: row.name,
            graduation_year: parseInt(row.academic_year),
            branch: row.branch,
            normalized_name: row.name.trim().toLowerCase(),
          });
        }
        fs.unlinkSync(req.file.path);
        res.status(201).json({ message: "Student master list uploaded successfully" });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// GET PENDING USERS
// ==========================
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.findAll({ where: { status: "pending" } });
    res.status(200).json(pendingUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// APPROVE / REJECT PENDING USERS
// ==========================
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, action } = req.body;
    if (!userId || !["approve", "reject"].includes(action)) return res.status(400).json({ message: "Invalid request" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = action === "approve" ? "active" : "rejected";
    await user.save();

    res.status(200).json({ message: `User ${action}d successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
