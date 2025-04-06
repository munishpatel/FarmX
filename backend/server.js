require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb"); // Use MongoClient from mongodb package

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
