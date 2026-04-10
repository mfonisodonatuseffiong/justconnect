#!/usr/bin/node
require("dotenv").config();
const jwt = require("jsonwebtoken");

/* ======================================================
   ACCESS TOKEN (24 HOURS)
====================================================== */
module.generateAccessToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");

  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
      issuer: "justconnect.app",
      audience: "justconnect-users",
    },
  );
};
