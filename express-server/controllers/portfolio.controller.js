const createError = require("http-errors");
const { portfolioCalc } = require("../services/portfolio.service");
const users = require("../services/users.service");

/**
 * Request controller that responds with a users
 * portfolio and its statistics (e.g. PL, Quantity)
 * @param  {String} userId   Users firebase UUID
 * @param  {String} currency vs_currency of the user
 * @returns {Object}          Portfolio and its statistics
 */
const getPortfolio = (req, res, next) => {
  const userId = req.params["userId"];
  const currency = req.params["currency"];

  portfolioCalc(userId, currency)
    .then((portfolio) => res.json(portfolio))
    .catch((err) => {
      console.log("Error in /getPortfolio");
      console.log(err.message);
      next(createError(500, err));
    });
};

/**
 * Request controller that responds with an ordered list
 * of a users transaction history sorted by recent transactions
 * first
 * @param  {string} userId Users firebase UUID
 * @returns {List}          Ordered list of transaction history
 */
const getHistory = (req, res) => {
  const userId = req.params["userId"];

  console.log("GONE INTO GETHISTORY FUNCTION");

  users
    .getTransactionHistory(userId)
    .then((transactionHistory) => res.json(transactionHistory))
    .catch((err) => {
      res.status(500);
      console.log("CAUGHT AN ERROR IN GETTING TRANSACTION HISTORY");
      next(createError(500, err));
    });
};

module.exports = { getPortfolio, getHistory };
