const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account already exists for this email" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      passwordHash
    });

    return res.status(201).json({
      message: "User registered",
      data: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return res.status(500).json({ message: "Unable to register user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password" });

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET is not configured" });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Unable to log in" });
  }
});

module.exports = router;
