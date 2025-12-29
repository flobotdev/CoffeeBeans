// Database schema and initialization
const { query } = require("./db");

// Create beans table
const createBeansTable = `
  CREATE TABLE IF NOT EXISTS beans (
    id VARCHAR(50) PRIMARY KEY,
    index INTEGER,
    is_botd BOOLEAN DEFAULT FALSE,
    cost DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    colour VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Create indexes for better performance
const createIndexes = `
  CREATE INDEX IF NOT EXISTS idx_beans_name ON beans(name);
  CREATE INDEX IF NOT EXISTS idx_beans_country ON beans(country);
  CREATE INDEX IF NOT EXISTS idx_beans_colour ON beans(colour);
  CREATE INDEX IF NOT EXISTS idx_beans_is_botd ON beans(is_botd);
`;

// Initialize database
const initializeDatabase = async () => {
  try {
    // Create tables
    await query(createBeansTable);

    // Create indexes
    await query(createIndexes);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
  createBeansTable,
  createIndexes,
};
