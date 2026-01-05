// Database schema and initialization
const { query } = require("./db");

// Create beans table
const createBeansTable = `
  CREATE TABLE IF NOT EXISTS beans (
    id VARCHAR(50) PRIMARY KEY,
    index INTEGER,
    is_botd BOOLEAN DEFAULT FALSE,
    cost NUMERIC(10,2) NOT NULL,
    image VARCHAR(500),
    colour VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Create bean of the day table
const createBeanOfTheDayTable = `
  CREATE TABLE IF NOT EXISTS bean_of_the_day (
    id SERIAL PRIMARY KEY,
    bean_id VARCHAR(50) NOT NULL REFERENCES beans(id) ON DELETE CASCADE,
    selected_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(selected_date)
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
    console.log("Beans table created");

    await query(createBeanOfTheDayTable);
    console.log("Bean of the day table created");

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
  createBeanOfTheDayTable,
  createIndexes,
};
