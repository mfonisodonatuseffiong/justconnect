const jwt = require("jsonwebtoken");

/**
 * ==========================================================
 * AUTH MIDDLEWARE
 * Handles JWT authentication and role-based authorization
 * ==========================================================
 */

const authenticateToken = (req, res, next) => {
  try {
    // Check token in headers or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Always populate req.user with correct info
    req.user = {
      id: decoded.id,
      name: decoded.name || null,
      email: decoded.email || null,
      role: decoded.role || "user",
    };

    console.log("✅ Authenticated user:", req.user); // debug role

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
    });
  }
};

/**
 * ==========================================================
 * ROLE-BASED AUTHORIZATION
 * Example usage: roleAuthorization("admin", "professional")
 * ==========================================================
 */
const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. No user data found.",
    });
  }

  if (!allowedRoles.includes(req.user.role)) {
    console.warn(
      `⚠️ Forbidden: role ${req.user.role} not in allowed roles [${allowedRoles.join(", ")}]`
    );
    return res.status(403).json({
      success: false,
      message: "Forbidden. Insufficient permissions.",
    });
  }

  next();
};

// Alias for legacy code
const roleAuthorization = (role) => authorizeRoles(role);

module.exports = {
  authenticateToken,
  authorizeRoles,
  roleAuthorization,
};
