/**
 * @description: This is the configuration file for postgresql db connection
 *               - creates a function that connects to db
 *               - uses the pg library to create a pool connection
 * 
 * @return return the function to server.js
 */

const { Pool } = require("pg");

// faster connection to the db
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const connectToDB = async () => {
    try {
        await pool.connect();
        console.log("Connected to PostgreSQL database");
    } catch (error) {
        console.error("Error connecting to PostgreSQL database", error);
        throw error;
    }
};

module.exports = { connectToDB, pool };
