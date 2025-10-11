const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const pool = require("../../db"); // PostgreSQL pool connection

// ================== GET DASHBOARD (USER & ADMIN) ==================
router.get("/", protect, async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search?.toLowerCase();

    const isAdmin = user.role === "admin";
    const isProfessional = user.role === "professional";

    // ========= MAIN QUERY =========
    let query = `
      SELECT r.*, 
             u.name AS user_name,
             p.name AS professional_name,
             p.category AS professional_field
      FROM requests r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN professionals p ON r.professional_id = p.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by role
    if (!isAdmin && !isProfessional) {
      params.push(user.id);
      query += ` AND r.user_id = $${params.length}`;
    } else if (isProfessional) {
      params.push(user.id);
      query += ` AND r.professional_id = $${params.length}`;
    }

    // Filter by status
    if (status) {
      params.push(status);
      query += ` AND r.status = $${params.length}`;
    }

    // Search by professional/service name
    if (search) {
      params.push(`%${search}%`);
      query += ` AND LOWER(r.professional) LIKE $${params.length}`;
    }

    // Pagination and ordering
    query += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // ========= STATS =========
    let statsQuery = `
      SELECT 
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed
      FROM requests
      WHERE 1=1
    `;
    const statsParams = [];

    if (!isAdmin && !isProfessional) {
      statsParams.push(user.id);
      statsQuery += ` AND user_id = $${statsParams.length}`;
    } else if (isProfessional) {
      statsParams.push(user.id);
      statsQuery += ` AND professional_id = $${statsParams.length}`;
    }

    const statsResult = await pool.query(statsQuery, statsParams);
    const stats = statsResult.rows[0];

    // ========= COUNT TOTAL FOR PAGINATION =========
    let countQuery = `SELECT COUNT(*) FROM requests WHERE 1=1`;
    const countParams = [];

    if (!isAdmin && !isProfessional) {
      countParams.push(user.id);
      countQuery += ` AND user_id = $${countParams.length}`;
    } else if (isProfessional) {
      countParams.push(user.id);
      countQuery += ` AND professional_id = $${countParams.length}`;
    }

    if (status) {
      countParams.push(status);
      countQuery += ` AND status = $${countParams.length}`;
    }

    if (search) {
      countParams.push(`%${search}%`);
      countQuery += ` AND LOWER(professional) LIKE $${countParams.length}`;
    }

    const totalCount = await pool.query(countQuery, countParams);

    // ========= AVAILABLE SERVICES =========
    const availableServices = [
      "Electrician", "Plumber", "Carpenter", "Painter", "Mechanic",
      "Cleaner", "Hair Stylist", "Tailor", "Driver", "Chef",
      "Technician", "Mason", "Gardener", "Teacher"
    ];

    // ========= RESPONSE =========
    res.json({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      dashboard: {
        welcomeMessage: `Welcome ${isAdmin ? "Admin" : isProfessional ? "Professional" : "User"} ${user.name}!`,
        stats: {
          totalRequests: parseInt(stats.total) || 0,
          pending: parseInt(stats.pending) || 0,
          inProgress: parseInt(stats.in_progress) || 0,
          completed: parseInt(stats.completed) || 0,
        },
        pagination: {
          total: parseInt(totalCount.rows[0].count),
          page,
          limit,
        },
        availableServices,
        requests: result.rows,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Server error fetching dashboard data" });
  }
});

// ================== PROFESSIONAL DASHBOARD ==================
router.get("/professional", protect, async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "professional") {
      return res.status(403).json({ message: "Access denied. Professionals only." });
    }

    const professionalQuery = `
      SELECT id, name, category, rating, bio, years_of_experience
      FROM professionals
      WHERE id = $1
    `;
    const profResult = await pool.query(professionalQuery, [user.id]);
    const professional = profResult.rows[0];

    const requestStatsQuery = `
      SELECT 
        COUNT(*) AS total_requests,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed
      FROM requests
      WHERE professional_id = $1
    `;
    const statsResult = await pool.query(requestStatsQuery, [user.id]);
    const stats = statsResult.rows[0];

    res.json({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      professionalDashboard: {
        welcomeMessage: `Welcome Professional ${user.name}!`,
        professional,
        stats,
      },
    });
  } catch (error) {
    console.error("Professional dashboard error:", error);
    res.status(500).json({ error: "Server error fetching professional dashboard" });
  }
});

// ================== CREATE NEW REQUEST ==================
router.post("/", protect, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "user") {
      return res.status(403).json({ message: "Only users can create requests" });
    }

    const { professional_id, service, job_details, date, time } = req.body;

    if (!service || !job_details || !date || !time) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    let professional = null;
    if (professional_id) {
      const professionalCheck = await pool.query(
        "SELECT id, name, category FROM professionals WHERE id = $1",
        [professional_id]
      );

      if (professionalCheck.rows.length === 0) {
        return res.status(404).json({ message: "Professional not found" });
      }

      professional = professionalCheck.rows[0];
    }

    const insertQuery = `
      INSERT INTO requests (user_id, professional_id, professional, service, job_details, date, time, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [
      user.id,
      professional ? professional.id : null,
      professional ? professional.category : service,
      service,
      job_details,
      date,
      time,
    ]);

    res.status(201).json({
      message: "Request created successfully",
      request: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Server error while creating request" });
  }
});

// ================== UPDATE REQUEST STATUS ==================
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "in_progress", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const requestResult = await pool.query("SELECT * FROM requests WHERE id = $1", [id]);
    if (requestResult.rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const request = requestResult.rows[0];

    if (
      user.role === "user" ||
      (user.role === "professional" && request.professional_id !== user.id)
    ) {
      return res.status(403).json({ message: "You are not allowed to update this request" });
    }

    const updateQuery = `
      UPDATE requests
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
    const updated = await pool.query(updateQuery, [status, id]);

    res.json({
      message: "Request status updated successfully",
      request: updated.rows[0],
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Server error while updating status" });
  }
});

module.exports = router;
