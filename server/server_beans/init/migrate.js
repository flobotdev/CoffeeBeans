const fs = require("fs").promises;
const path = require("path");
const { query } = require("../db/db");

const BEANS_FILE = path.join(__dirname, "beans.json");

// Helper function to read JSON data
async function readJsonData(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Migrate beans data
async function migrateBeans() {
  try {
    console.log("Migrating beans data...");

    const beans = await readJsonData(BEANS_FILE);

    for (const bean of beans) {
      // Convert camelCase to snake_case for database
      const beanData = {
        id: bean._id,
        index: bean.index,
        is_botd: bean.isBOTD || false,
        cost: bean.Cost,
        image: bean.Image,
        colour: bean.colour,
        name: bean.Name,
        description: bean.Description,
        country: bean.Country,
      };

      await query(
        `
        INSERT INTO beans (id, index, is_botd, cost, image, colour, name, description, country)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO NOTHING
      `,
        [
          beanData.id,
          beanData.index,
          beanData.is_botd,
          beanData.cost,
          beanData.image,
          beanData.colour,
          beanData.name,
          beanData.description,
          beanData.country,
        ]
      );
    }

    console.log(`Migrated ${beans.length} beans`);
  } catch (error) {
    console.error("Bean migration failed:", error);
    throw error;
  }
}

// Initialize bean of the day
async function initializeBeanOfTheDay() {
  try {
    console.log("Initializing bean of the day...");

    // Get a random bean to set as initial bean of the day
    const result = await query(
      `SELECT id FROM beans ORDER BY RANDOM() LIMIT 1`
    );

    if (result.rows.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const beanId = result.rows[0].id;

      await query(
        `INSERT INTO bean_of_the_day (bean_id, selected_date)
         VALUES ($1, $2) ON CONFLICT (selected_date) DO NOTHING`,
        [beanId, today]
      );

      console.log(`Initialized bean of the day with bean ID: ${beanId}`);
    } else {
      console.log("No beans available to initialize bean of the day");
    }
  } catch (error) {
    console.error("Bean of the day initialization failed:", error);
    throw error;
  }
}

// Main migration function
async function migrateData() {
  try {
    console.log("Starting data migration from JSON to PostgreSQL...");
    await migrateBeans();
    await initializeBeanOfTheDay();

    console.log("Data migration completed successfully!");
  } catch (error) {
    console.error("Data migration failed:", error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateData();
}

module.exports = {
  migrateData,
  migrateBeans,
  initializeBeanOfTheDay,
};
