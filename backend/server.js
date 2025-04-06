require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb"); // Use MongoClient from mongodb package
const { spawn } = require('child_process');
const imageRoutes = require("./routes/imageRoutes");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const queryRoutes = require("./routes/queryRoutes");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB Connection
const mongoUrl = "mongodb://localhost:27017";
const mongoDbName = "farmdatabase"; // Your database name
const mongoClient = new MongoClient(mongoUrl);

async function connectMongoDB() {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");
    return mongoClient.db(mongoDbName);
  } catch (err) {
    console.error("Could not connect to MongoDB", err);
    process.exit(1); // Exit if connection fails
  }
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from uploads directory
app.use("/api", queryRoutes);
app.use("/api/images", imageRoutes);

// Function to run Python script and return a promise
function runPythonScript(scriptPath, args) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath, ...args]);
        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python process exited with code ${code}: ${error}`));
            } else {
                try {
                    const jsonResult = JSON.parse(result);
                    resolve(jsonResult);
                } catch (e) {
                    reject(new Error(`Failed to parse Python output: ${result}`));
                }
            }
        });
    });
}

// Added new route
app.post('/api/ai/query', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Query text is required' });
        }

        // Run the AI orchestrator
        const result = await runPythonScript(
            path.join(__dirname, 'agents/orchestrator/run_orchestrator.py'),
            [text]
        );

        res.json(result);
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start server only after DB connection is established
connectMongoDB().then((db) => {
  app.locals.db = db; // Store db in app.locals for reuse
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
