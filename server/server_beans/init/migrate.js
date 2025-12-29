const fs = require("fs").promises;
const path = require("path");
const { query } = require("./db/db");

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

// Main migration function
async function migrateData() {
  try {
    console.log("Starting data migration from JSON to PostgreSQL...");
    await migrateBeans();

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
};
