const express = require("express");
const router = express.Router();
const { uploadAlumniMaster, uploadStudentMaster } = require("../controllers/adminController");

router.post("/upload-alumni", uploadAlumniMaster);
router.post("/upload-student", uploadStudentMaster)

module.exports = router;
