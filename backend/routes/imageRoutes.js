const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const fs = require("fs");

// Set up storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST /api/image-upload
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // Simulated image processing result
    const aiResult = "AI Analysis: The uploaded crop leaf seems healthy but has slight discoloration on the edges.";

    res.status(200).json({
      message: "Image received and processed.",
      analysis: aiResult,
      imageUrl: `http://localhost:5001/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;
