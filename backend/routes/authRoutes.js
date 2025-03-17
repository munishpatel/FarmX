const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const router = express.Router();

// User Sign-up
router.post("/signup", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the user
    const newUser = { name, email, password: hashedPassword };
    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { email, password } = req.body;

    // Find user by email
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
