/**
 *  @description This serves as the index file to get all api endpoint
 *              group all routes into this index file
 * @tutorial: user hits SERVER FILE - /api/v1/
 *            Checks into the v1Routes => index.js file => /auth => authRoutes /login
 *  @return a router that handles all api routes
 */

const { Router } = require("express");
const router = Router();

// all routes of the application here
router.use("/auth", require("./authRoutes"));


module.exports = router;

