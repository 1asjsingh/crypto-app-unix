const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");

// Registering request controllers for the /user route
router.get("/details/:userId", userController.getUserDetails);

module.exports = router;
