/**
 * @description: This is the main entry point for the backend server.
 * 
 */

require ("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("./src/config/db.config"); // import db connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser()); // This pass cookies to req.cookies
app.use(cors(
    { origin: process.env.FRONTEND_URL || "http://localhost:5173", // Accept request from only this your frontend
      credentials: true, // Allow cookies to be sent for every request
    }
));

// mount routes 
const v1Routes = require("./routes/v1/index");
app.use("/api/v1", v1Routes);

// Start db and the server
connectToDB(); 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});