const jwt = require("jsonwebtoken");

// ✅ Protect routes (require valid token)
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure all necessary fields exist
    req.user = {
      id: decoded.id,
      name: decoded.name || "User",
      email: decoded.email || "",
      role: decoded.role || "user",
    };

    next();
  } catch (error) {
    console.error("Invalid or expired token:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// ✅ Restrict route access by role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user info" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }

    next();
  };
};

module.exports = { protect, authorizeRoles };
