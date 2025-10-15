const csv = require("csv-parser");
const fs = require("fs");
const AlumniMaster = require("../models/alumniMasterModel");
const StudentMaster = require("../models/studentMasterModel");

/**
 * Upload and parse CSV file for Alumni Master List
 */
exports.uploadAlumniCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file required" });

    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        for (const row of results) {
          // Create alumni master entry
          await AlumniMaster.create({
            name: row.name,
            graduation_year: parseInt(row.graduation_year),
            branch: row.branch,
            normalized_name: row.name.trim().toLowerCase(),
          });
        }
        // Remove uploaded file
        fs.unlinkSync(req.file.path);
        res.status(201).json({ message: "Alumni master list uploaded successfully" });
      })
      .on("error", (err) => {
        console.error(err);
        res.status(500).json({ message: "Error reading CSV file" });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Upload and parse CSV file for Student Master List
 */
exports.uploadStudentCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file required" });

    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        for (const row of results) {
          // Create student master entry
          await StudentMaster.create({
            name: row.name,
            graduation_year: parseInt(row.academic_year), // academic year
            branch: row.branch,
            normalized_name: row.name.trim().toLowerCase(),
          });
        }
        fs.unlinkSync(req.file.path);
        res.status(201).json({ message: "Student master list uploaded successfully" });
      })
      .on("error", (err) => {
        console.error(err);
        res.status(500).json({ message: "Error reading CSV file" });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
