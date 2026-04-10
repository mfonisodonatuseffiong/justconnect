/**
 * @description This single route displays all the categories in the database, especially for the professional register page
 * @Access Public route
 */

const { Router } = require("express");
const { getAllCategoriesController } = require("../controllers/categoriesController");

const categoriesRouter = Router();

categoriesRouter.get("/", getAllCategoriesController);


module.exports = categoriesRouter;