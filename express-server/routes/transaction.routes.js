const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");

// Registering request controllers for the /transaction route
router.post("/buy", transactionController.buy);
router.post("/sell", transactionController.sell);

module.exports = router;
