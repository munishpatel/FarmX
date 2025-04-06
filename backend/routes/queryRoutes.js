const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

// POST /api/query
router.post("/query", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    // Full path to orchestrator_entry.py
    const scriptPath = path.join(__dirname, "../services/orchestrator_entry.py");

    // Run the Python script with proper PYTHONPATH
    const py = spawn("python3", [scriptPath, prompt], {
      cwd: path.join(__dirname, ".."), // Set working directory to backend root
      env: {
        ...process.env,
        PYTHONPATH: path.join(__dirname, ".."), // Add backend root to Python path
      },
    });

    let dataBuffer = "";
    let errorBuffer = "";

    py.stdout.on("data", (data) => {
      dataBuffer += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorBuffer += data.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        console.error("Python Error:", errorBuffer);
        return res.status(500).json({
          error: "Python script failed",
          details: errorBuffer,
        });
      }

      console.log("Python Output:", dataBuffer.trim());
      res.status(200).json({ result: dataBuffer.trim() });
    });
  } catch (err) {
    console.error("Server error in /query:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
