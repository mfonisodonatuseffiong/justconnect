const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

// Example in-memory requests (replace with DB query in real app)
const allRequests = [
  { id: 1, userId: 16, service: "Plumber", status: "pending" },
  { id: 2, userId: 16, service: "Electrician", status: "completed" },
  { id: 3, userId: 17, service: "Cleaner", status: "pending" },
  { id: 4, userId: 16, service: "Gardener", status: "pending" },
  { id: 5, userId: 16, service: "Painter", status: "completed" },
  // ... more data
];

router.get("/", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;      // Filter by status
    const search = req.query.search?.toLowerCase();  // Filter by service
    const sortBy = req.query.sortBy;      // "service" or "status"
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Asc/Desc

    // Filter requests based on user role
    let userRequests = allRequests.filter(r => 
      req.user.role === "admin" || r.userId === req.user.id
    );

    // Filter by status
    if (status) {
      userRequests = userRequests.filter(r => r.status === status);
    }

    // Filter by search term (service)
    if (search) {
      userRequests = userRequests.filter(r => 
        r.service.toLowerCase().includes(search)
      );
    }

    // Sorting
    if (sortBy) {
      userRequests.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1 * sortOrder;
        if (a[sortBy] > b[sortBy]) return 1 * sortOrder;
        return 0;
      });
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedRequests = userRequests.slice(start, end);

    res.json({
      message: `Welcome to your dashboard, ${req.user.role === 'admin' ? 'Admin' : 'User'}!`,
      user: req.user,
      totalRequests: userRequests.length,
      page,
      limit,
      requests: paginatedRequests,
      availableServices: [
        "Electrician", "Plumber", "Carpenter", "Painter", "Mechanic",
        "Cleaner", "Hair Stylist", "Tailor", "Driver", "Chef",
        "Technician", "Mason", "Gardener", "Teacher"
      ],
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Server error fetching dashboard data" });
  }
});

module.exports = router;
