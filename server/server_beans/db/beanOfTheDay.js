// Bean of the Day business logic
const { query } = require("./db");

/**
 * Get the current bean of the day
 * If no bean is selected for today, select a new one randomly
 */
const getBeanOfTheDay = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Check if we already have a bean selected for today
    const existingResult = await query(
      `SELECT b.* FROM bean_of_the_day botd
       JOIN beans b ON botd.bean_id = b.id
       WHERE botd.selected_date = $1`,
      [today]
    );

    if (existingResult.rows.length > 0) {
      // Return the existing bean of the day
      return existingResult.rows[0];
    }

    // No bean selected for today, select a new one
    const newBean = await selectNewBeanOfTheDay(today);
    return newBean;
  } catch (error) {
    console.error("Error getting bean of the day:", error);
    throw error;
  }
};

/**
 * Select a new random bean for the day
 * Ensures it's not the same as yesterday's selection
 */
const selectNewBeanOfTheDay = async (today) => {
  try {
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Get yesterday's bean ID to avoid selecting the same one
    const yesterdayResult = await query(
      `SELECT bean_id FROM bean_of_the_day WHERE selected_date = $1`,
      [yesterdayStr]
    );

    const excludeBeanId =
      yesterdayResult.rows.length > 0 ? yesterdayResult.rows[0].bean_id : null;

    // Get all available beans, excluding yesterday's if it exists
    let availableBeansQuery = `SELECT * FROM beans ORDER BY RANDOM()`;
    let queryParams = [];

    if (excludeBeanId) {
      availableBeansQuery = `SELECT * FROM beans WHERE id != $1 ORDER BY RANDOM()`;
      queryParams = [excludeBeanId];
    }

    const availableBeans = await query(availableBeansQuery, queryParams);

    if (availableBeans.rows.length === 0) {
      // If no beans available (shouldn't happen), fall back to any bean
      const fallbackResult = await query(
        `SELECT * FROM beans ORDER BY RANDOM() LIMIT 1`
      );
      if (fallbackResult.rows.length === 0) {
        throw new Error("No beans available in database");
      }
      return fallbackResult.rows[0];
    }

    // Select the first random bean
    const selectedBean = availableBeans.rows[0];

    // Save the selection to the database
    await query(
      `INSERT INTO bean_of_the_day (bean_id, selected_date) VALUES ($1, $2)`,
      [selectedBean.id, today]
    );

    console.log(
      `Selected new bean of the day: ${selectedBean.name} (ID: ${selectedBean.id})`
    );

    return selectedBean;
  } catch (error) {
    console.error("Error selecting new bean of the day:", error);
    throw error;
  }
};

/**
 * Manually set a specific bean as bean of the day (for testing/admin purposes)
 */
const setBeanOfTheDay = async (beanId) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Check if bean exists
    const beanResult = await query(`SELECT * FROM beans WHERE id = $1`, [
      beanId,
    ]);
    if (beanResult.rows.length === 0) {
      throw new Error("Bean not found");
    }

    // Delete any existing selection for today
    await query(`DELETE FROM bean_of_the_day WHERE selected_date = $1`, [
      today,
    ]);

    // Insert the new selection
    await query(
      `INSERT INTO bean_of_the_day (bean_id, selected_date) VALUES ($1, $2)`,
      [beanId, today]
    );

    console.log(
      `Manually set bean of the day: ${beanResult.rows[0].name} (ID: ${beanId})`
    );

    return beanResult.rows[0];
  } catch (error) {
    console.error("Error setting bean of the day:", error);
    throw error;
  }
};

module.exports = {
  getBeanOfTheDay,
  setBeanOfTheDay,
};
