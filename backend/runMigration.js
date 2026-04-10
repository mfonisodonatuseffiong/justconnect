/**
 * @description This is script that auto runs the create table file in migrations ( create needed tables in db) and also
 *                runs the categories seeds defaulted by the app so it can be fetched in the sign up page
 * 
 * @run         Run this script with npm run set-up
 */

const fs = require("fs");
const {pool} = require("./config/db");

async function runSqlFile(filePath) {
  const sql = fs.readFileSync(filePath, { encoding: "utf-8" });
  await pool.query(sql);
}

(async () => {
  try {
    // Create tables
    console.log("Running Migrations...");
    await runSqlFile("./migrations/001_create_table.sql");
    console.log("Tables created.");

    // Add categories field
    console.log("Seeding categories...");
    await runSqlFile("./seed/seed_categories.sql");
    console.log("Categories created.");

    console.log("Done.");
    process.exit(0);
  } catch (error) {
    console.error("Error while running migrations:", error);
    process.exit(1);
  }
})();
