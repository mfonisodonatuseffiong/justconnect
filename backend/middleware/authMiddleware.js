const jwt = require("jsonwebtoken");

// Main authentication middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded token payload to request
    req.user = {
      id: decoded.id,             // Optional: for registered users
      name: decoded.name,         // Required for professionals
      role: decoded.role || "user", // Default to 'user' if not provided
      email: decoded.email,       // Optional
    };

    next();
  } catch (error) {
    console.error("Invalid token", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Optional: Middleware to restrict route to certain roles (e.g., professional, admin)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
