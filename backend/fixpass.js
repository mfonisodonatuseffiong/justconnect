const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'justconnect',
  password: 'effiongeffiong',
  port: 5432
});

async function run() {
  try {
    const hash = await bcrypt.hash('SecurePass456', 10);
    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hash, 'maryfixit@example.com']
    );
    console.log("✅ Password updated successfully");
  } catch (err) {
    console.error("❌ ERROR:", err);
  } finally {
    process.exit();
  }
}

run();

