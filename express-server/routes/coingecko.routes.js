const express = require("express");
const router = express.Router();
const coingeckoController = require("../controllers/coingecko.controller");

// Registering request controllers for the /coingecko route
router.get("/currentprices/:currency", coingeckoController.getCurrentPrices);

module.exports = router;
