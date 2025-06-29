const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const professionalsList = require("../../data/professionalsList");

const PROFESSIONAL_PASSWORD = "pro123"; // Use env var in production

// ✅ Route: POST /api/auth/professional-login
router.post("/professional-login", (req, res) => {
  const { email, password } = req.body;

  console.log("🔐 Incoming professional login attempt");
  console.log("📩 Request Body:", req.body);

  // Check if both fields are present
  if (!email || !password) {
    console.warn("⚠️ Missing email or password");
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Find the professional in the list
  const professional = professionalsList.find(
    (pro) => pro.email.toLowerCase() === email.toLowerCase()
  );

  if (!professional) {
    console.warn(`❌ Professional not found: ${email}`);
    return res.status(401).json({ message: "Professional not found" });
  }

  if (password !== PROFESSIONAL_PASSWORD) {
    console.warn(`❌ Incorrect password attempt for: ${email}`);
    return res.status(401).json({ message: "Incorrect password" });
  }

  // Create JWT
  const payload = {
    id: professional.id,
    name: professional.name,
    email: professional.email,
    role: "professional",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

  console.log(`✅ Successful login for: ${professional.email}`);

  res.json({ token, user: payload });
});

module.exports = router;
