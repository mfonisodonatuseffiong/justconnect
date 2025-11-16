const jwt = require("jsonwebtoken");

/**
 * ==========================================================
 * AUTH MIDDLEWARE
 * Handles JWT authentication and role-based authorization
 * ==========================================================
 */

// ✅ Verify and authenticate JWT
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT with claims
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "justconnect.app",
      audience: "justconnect-users",
    });

    // Attach decoded data (id, email, role, etc.)
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

/**
 * ✅ Role-based authorization middleware
 * Example usage: authorizeRoles("admin", "professional")
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. No user data found.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You do not have permission to perform this action.",
      });
    }

    next();
  };
};

// ✅ Alias for backward compatibility
const roleAuthorization = (role) => authorizeRoles(role);

module.exports = {
  authenticateToken,
  authorizeRoles,
  roleAuthorization,
};
