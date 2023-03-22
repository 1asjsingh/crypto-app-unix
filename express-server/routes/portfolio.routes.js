const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolio.controller");

// Registering request controllers for the /portfolio route
router.get("/fetch/:userId/:currency", portfolioController.getPortfolio);
router.get("/transactionhistory/:userId", portfolioController.getHistory);

module.exports = router;
