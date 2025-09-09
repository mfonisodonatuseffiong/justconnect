/**
 * @desc: This is the routes. api endpoint for all auth pages
 *         - takes care of all authentication related requests
 *         - takes a validation middleware to prevent script hack and inputs are correct from the user frontend
 */

const { Router } = require("express");
const router = Router();


const { registerSchema, loginSchema, forgetPasswordSchema } = require("../../validations/auth.validator"); // validate schema
const validate = require("../../middleware/validateInputMiddleware");
const authProtector = require("../../middleware/authMiddlewareProtector");

const { registerController,
    loginController,
    logoutController,
    forgetPasswordController,
    resetPasswordController,
    checkMeController
} = require("../../controllers/authControllers"); // imported from auth controllers


router.get("/me", authProtector, checkMeController);

router.post("/register", validate(registerSchema), registerController);

router.post("/login", validate(loginSchema), loginController);

router.post("/logout", authProtector, logoutController);

router.post("/forget-password", validate(forgetPasswordSchema), forgetPasswordController);

router.post("/reset-password/:resetToken/:userId", validateTokenProtector, resetPasswordController);



module.exports = router;