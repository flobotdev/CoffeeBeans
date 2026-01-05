const { query } = require("../db/db");

async function updateBeanOfTheDay() {
  try {
    // Delete current bean of the day
    await query(
      "DELETE FROM bean_of_the_day WHERE selected_date = CURRENT_DATE"
    );
    console.log("Deleted current bean of the day");

    // Insert new bean of the day
    await query(
      "INSERT INTO bean_of_the_day (bean_id, selected_date) VALUES ($1, CURRENT_DATE)",
      ["66a374592169e1bfcca2fb1c"]
    );

    console.log("Bean of the day updated to ID: 66a374592169e1bfcca2fb1c");
    process.exit(0);
  } catch (error) {
    console.error("Error updating bean of the day:", error.message);
    process.exit(1);
  }
}

updateBeanOfTheDay();
