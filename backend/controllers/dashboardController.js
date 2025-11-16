const pool = require("../config/db");

/**
 * ==========================================================
 * DASHBOARD CONTROLLERS
 * ==========================================================
 */

// 🧭 Unified dashboard (auto-detect role: user/professional/admin)
const getDashboard = async (req, res) => {
  try {
    const user = req.user;
    const role = user.role;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search?.toLowerCase();

    const isAdmin = role === "admin";
    const isProfessional = role === "professional";
    const isUser = role === "user";

    // Base query
    let query = `
      SELECT r.*, 
             u.name AS user_name,
             p.name AS professional_name,
             p.category AS professional_field,
             p.rating,
             p.bio,
             p.years_of_experience,
             p.profile_photo
      FROM requests r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN professionals p ON r.professional_id = p.id
      WHERE 1=1
    `;
    const params = [];

    // Role-based filters
    if (isUser) {
      params.push(user.id);
      query += ` AND r.user_id = $${params.length}`;
    } else if (isProfessional) {
      const prof = await pool.query("SELECT id FROM professionals WHERE email = $1", [user.email]);
      if (prof.rows.length > 0) {
        params.push(prof.rows[0].id);
        query += ` AND r.professional_id = $${params.length}`;
      }
    }

    if (status) {
      params.push(status);
      query += ` AND r.status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND LOWER(r.professional) LIKE $${params.length}`;
    }

    query += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Stats
    let statsQuery = `
      SELECT 
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status='pending') AS pending,
        COUNT(*) FILTER (WHERE status='in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status='completed') AS completed
      FROM requests
      WHERE 1=1
    `;
    if (isUser) statsQuery += ` AND user_id = ${user.id}`;
    else if (isProfessional) {
      const prof = await pool.query("SELECT id FROM professionals WHERE email = $1", [user.email]);
      if (prof.rows.length > 0) statsQuery += ` AND professional_id = ${prof.rows[0].id}`;
    }
    const statsResult = await pool.query(statsQuery);
    const stats = statsResult.rows[0];

    const countResult = await pool.query("SELECT COUNT(*) FROM requests");
    const totalCount = countResult.rows[0].count;

    const availableServices = [
      "Electrician","Plumber","Carpenter","Painter","Mechanic",
      "Cleaner","Hair Stylist","Tailor","Driver","Chef",
      "Technician","Mason","Gardener","Teacher"
    ];

    res.json({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
      dashboard: {
        welcomeMessage: `Welcome ${role} ${user.name}!`,
        stats,
        pagination: { total: parseInt(totalCount), page, limit },
        availableServices,
        requests: result.rows.map(r => ({ ...r, user_name: r.user_name || user.name })),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Server error fetching dashboard data" });
  }
};

// 🧰 Professional dashboard
const getProfessionalDashboard = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "professional") return res.status(403).json({ message: "Access denied. Professionals only." });

    let profQuery = await pool.query("SELECT * FROM professionals WHERE email = $1", [user.email]);
    let professional = profQuery.rows[0];

    if (!professional) {
      const insertQuery = `
        INSERT INTO professionals (name, email, category, location)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      const insertValues = [user.name, user.email, "General Service", "Unknown"];
      const newProf = await pool.query(insertQuery, insertValues);
      professional = newProf.rows[0];
    }

    const statsResult = await pool.query(
      `SELECT 
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE status='pending') AS pending,
         COUNT(*) FILTER (WHERE status='in_progress') AS in_progress,
         COUNT(*) FILTER (WHERE status='completed') AS completed
       FROM requests WHERE professional_id = $1`,
      [professional.id]
    );

    const recentRequests = await pool.query(
      `SELECT r.*, u.name AS user_name, u.email AS user_email
       FROM requests r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.professional_id = $1
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [professional.id]
    );

    res.json({
      message: `Welcome Professional ${professional.name}!`,
      profile: {
        id: professional.id,
        name: professional.name,
        email: professional.email,
        category: professional.category,
        location: professional.location,
      },
      stats: statsResult.rows[0],
      recentRequests: recentRequests.rows.map(r => ({ ...r, professional_name: professional.name })),
    });
  } catch (error) {
    console.error("Professional dashboard error:", error);
    res.status(500).json({ error: "Server error fetching professional dashboard" });
  }
};

// 🆕 User dashboard
const getUserDashboard = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "user") return res.status(403).json({ message: "Access denied. Users only." });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const requestsResult = await pool.query(
      `SELECT r.*, p.name AS professional_name, p.category AS professional_field
       FROM requests r
       LEFT JOIN professionals p ON r.professional_id = p.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [user.id, limit, offset]
    );

    const statsResult = await pool.query(
      `SELECT 
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE status='pending') AS pending,
         COUNT(*) FILTER (WHERE status='in_progress') AS in_progress,
         COUNT(*) FILTER (WHERE status='completed') AS completed
       FROM requests WHERE user_id = $1`,
      [user.id]
    );

    const requestsWithUserName = requestsResult.rows.map(r => ({ ...r, user_name: user.name }));

    res.json({
      message: `Welcome ${user.name}!`,
      profile: { id: user.id, name: user.name, email: user.email, role: user.role },
      stats: statsResult.rows[0],
      requests: requestsWithUserName,
      pagination: { page, limit, total: parseInt(statsResult.rows[0].total) }
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({ error: "Server error fetching user dashboard" });
  }
};

// 🆕 Create new service request
const createRequest = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "user") return res.status(403).json({ message: "Only users can create requests" });

    const { professional_id, service, job_details, date, time } = req.body;
    if (!service || !job_details || !date || !time) return res.status(400).json({ message: "Please fill all required fields" });

    let professional = null;
    if (professional_id) {
      const check = await pool.query("SELECT id, name, category FROM professionals WHERE id = $1", [professional_id]);
      if (check.rows.length === 0) return res.status(404).json({ message: "Professional not found" });
      professional = check.rows[0];
    }

    const result = await pool.query(
      `INSERT INTO requests (user_id, professional_id, professional, service, job_details, date, time, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
      [user.id, professional ? professional.id : null, professional ? professional.category : service, service, job_details, date, time]
    );

    res.status(201).json({ message: "Request created successfully", request: result.rows[0] });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({ message: "Server error creating request" });
  }
};

// 🔄 Update request status
const updateRequestStatus = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["pending", "in_progress", "completed", "cancelled"];

    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const request = await pool.query("SELECT * FROM requests WHERE id = $1", [id]);
    if (request.rows.length === 0) return res.status(404).json({ message: "Request not found" });

    const r = request.rows[0];
    if (user.role === "user" || (user.role === "professional" && r.professional_id !== user.id)) {
      return res.status(403).json({ message: "You are not allowed to update this request" });
    }

    const updated = await pool.query("UPDATE requests SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
    res.json({ message: "Request status updated", request: updated.rows[0] });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server error updating status" });
  }
};

module.exports = {
  getDashboard,
  getProfessionalDashboard,
  getUserDashboard,
  createRequest,
  updateRequestStatus,
};
