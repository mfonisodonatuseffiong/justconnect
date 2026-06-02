require("dotenv").config();
const jwt = require("jsonwebtoken");

/* ======================================================
   ACCESS TOKEN GENERATOR
   - Uses JWT_SECRET from .env
   - Expires in 24 hours
   - Includes issuer & audience metadata
====================================================== */
const generateAccessToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not set in environment variables");
  }

  // Debug log
  console.log("🔑 Signing JWT with secret:", process.env.JWT_SECRET);

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location,
    phone: user.phone,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
    issuer: "justconnect.app",
    audience: "justconnect-users",
  });
};

module.exports = {
  generateAccessToken,
};
