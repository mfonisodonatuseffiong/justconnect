const jwt = require("jsonwebtoken");

/**
 * ==========================================================
 * AUTH MIDDLEWARE
 * Verifies access token from Authorization header or cookies
 * ==========================================================
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Accept token from: Authorization: Bearer <token> OR cookie accessToken
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied: No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info for use in routes
    req.user = {
      id: decoded.id,
      name: decoded.name || null,
      email: decoded.email || null,
      role: decoded.role || "user",
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

    return res.status(401).json({
      success: false,
      message: "Invalid or malformed authentication token.",
    });
  }
};

/**
 * ==========================================================
 * ROLE-BASED AUTHORIZATION
 * Example: authorizeRoles("admin", "professional")
 * ==========================================================
 */
const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Missing user data.",
    });
  }

  if (!allowedRoles.includes(req.user.role)) {
    console.warn(`⚠️ Forbidden: ${req.user.role} cannot access this resource.`);
    return res.status(403).json({
      success: false,
      message: "Forbidden: Insufficient role permissions.",
    });
  }

  next();
};

// Backward compatibility for older code
const roleAuthorization = (role) => authorizeRoles(role);

module.exports = {
  authenticateToken,
  authorizeRoles,
  roleAuthorization,
};
