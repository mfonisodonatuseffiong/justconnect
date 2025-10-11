#!/usr/bin/node
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Use a test user (adjust role to 'user' or 'professional')
const user = {
  id: 16,
  name: "Test User",
  email: "testuser@example.com",
  role: "user",
};

const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

console.log("Generated Token:");
console.log(token);
