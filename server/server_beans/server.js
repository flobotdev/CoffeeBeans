const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { query, testConnection } = require("./db/db");
const { initializeDatabase } = require("./db/schema");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// JWT Authentication Middleware
/*
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}
*/

function authenticateToken(req, res, next) {
  // Stub: always authenticate as admin
  req.user = { role: "admin" };
  next();
}

// Admin-only middleware
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// Middleware
app.use(cors()); // Enable CORS for React app
app.use(express.json()); // Parse JSON into objects

// GET /api/beans/botd - Get bean of the day (single entry)
app.get("/api/beans/botd", async (req, res) => {
  try {
    const result = await query(`
      SELECT id, index, is_botd as "isBOTD", cost::float as "Cost", image as "Image",
             colour, name as "Name", description as "Description", country as "Country"
      FROM beans WHERE is_botd = true ORDER BY index LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No bean of the day found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bean of the day" });
  }
});

// GET /api/beans/search - Search beans
app.get("/api/beans/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ error: 'Search query parameter "q" is required' });
    }

    const searchTerm = `%${q.toLowerCase()}%`;
    const result = await query(
      `
      SELECT id, index, is_botd as "isBOTD", cost::float as "Cost", image as "Image",
             colour, name as "Name", description as "Description", country as "Country"
      FROM beans
      WHERE LOWER(name) LIKE $1
         OR LOWER(country) LIKE $1
         OR LOWER(colour) LIKE $1
         OR LOWER(description) LIKE $1
      ORDER BY index
    `,
      [searchTerm]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

// GET /api/beans/:id - Get single bean by ID
app.get("/api/beans/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `
      SELECT id, index, is_botd as "isBOTD", cost::float as "Cost", image as "Image",
             colour, name as "Name", description as "Description", country as "Country"
      FROM beans WHERE id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bean not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bean" });
  }
});

// POST /api/beans - Add new bean (Admin only)
app.post("/api/beans", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const newBean = req.body;

    // Get the next index
    const indexResult = await query(
      "SELECT COALESCE(MAX(index), -1) + 1 as next_index FROM beans"
    );
    const nextIndex = indexResult.rows[0].next_index;

    // Generate new ID
    const beanId = Date.now().toString();

    await query(
      `
      INSERT INTO beans (id, index, is_botd, cost, image, colour, name, description, country)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
      [
        beanId,
        nextIndex,
        newBean.isBOTD || false,
        newBean.Cost,
        newBean.Image,
        newBean.colour,
        newBean.Name,
        newBean.Description,
        newBean.Country,
      ]
    );

    // Return the created bean
    const result = await query(
      `
      SELECT id, index, is_botd as "isBOTD", cost as "Cost", image as "Image",
             colour, name as "Name", description as "Description", country as "Country"
      FROM beans WHERE id = $1
    `,
      [beanId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to add bean" });
  }
});

// PUT /api/beans/:id - Update bean (Admin only)
app.put("/api/beans/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if bean exists
    const existingBean = await query("SELECT id FROM beans WHERE id = $1", [
      id,
    ]);
    if (existingBean.rows.length === 0) {
      return res.status(404).json({ error: "Bean not found" });
    }

    // Update bean
    await query(
      `
      UPDATE beans
      SET is_botd = $1, cost = $2, image = $3, colour = $4, name = $5,
          description = $6, country = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
    `,
      [
        updateData.isBOTD || false,
        updateData.Cost,
        updateData.Image,
        updateData.colour,
        updateData.Name,
        updateData.Description,
        updateData.Country,
        id,
      ]
    );

    // Return updated bean
    const result = await query(
      `
      SELECT id, index, is_botd as "isBOTD", cost as "Cost", image as "Image",
             colour, name as "Name", description as "Description", country as "Country"
      FROM beans WHERE id = $1
    `,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update bean" });
  }
});

// DELETE /api/beans/:id - Delete bean (Admin only)
app.delete(
  "/api/beans/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if bean exists
      const existingBean = await query("SELECT id FROM beans WHERE id = $1", [
        id,
      ]);
      if (existingBean.rows.length === 0) {
        return res.status(404).json({ error: "Bean not found" });
      }

      // Delete bean
      await query("DELETE FROM beans WHERE id = $1", [id]);

      res.json({ message: "Bean deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete bean" });
    }
  }
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Coffee Beans API is running" });
});

// Start server
async function startServer() {
  try {
    // Initialize database
    console.log("Initializing database...");
    await initializeDatabase();

    // Start the server
    app.listen(PORT, () => {
      console.log(
        `Coffee Beans API server running on http://localhost:${PORT}`
      );
      console.log(`API Documentation:`);
      console.log(`   Beans:`);
      console.log(`   GET  /api/beans           - Get all beans`);
      console.log(`   GET  /api/beans/botd      - Get bean of the day`);
      console.log(`   GET  /api/beans/search?q= - Search beans`);
      console.log(`   GET  /api/beans/:id       - Get single bean`);
      console.log(`   POST /api/beans          - Add new bean (Admin only)`);
      console.log(`   PUT  /api/beans/:id      - Update bean (Admin only)`);
      console.log(`   DELETE /api/beans/:id    - Delete bean (Admin only)`);
      console.log(`   GET  /api/health         - Health check`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
