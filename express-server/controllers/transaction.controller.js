const transactions = require("../services/transactions.service");
const createError = require("http-errors");

/**
 * Request controller that posts a buy order to firebase
 * @param {String} userId       Users firebase UUID
 * @param {String} coin         Coin to be bought
 * @param {Float}  quantity     Quantity of buy
 * @param {Float}  currentPrice Price for a single coin
 * @param {Float}  costPrice    Total buy order price
 * @param {Date}   date         Data and time of transaction
 */
const buy = (req, res, next) => {
  const { userId, coin, quantity, currentPrice, costPrice, date } = req.body;

  transactions
    .execute(userId, coin, quantity, currentPrice, costPrice, date, true)
    .then(() => res.sendStatus(200))
    .catch((err) => {
      // FIXME: What http status code to use here
      console.log(err.message);
      next(createError(500, err));
    });
};

/**
 * Request controller that posts a sell order to firebase
 * @param {String} userId       Users firebase UUID
 * @param {String} coin         Coin to be sold
 * @param {Float}  quantity     Quantity of sell
 * @param {Float}  currentPrice Sell price for a single coin
 * @param {Float}  sellPrice    Total sell order price
 * @param {Date}   date         Data and time of transaction
 */
const sell = (req, res, next) => {
  const { userId, coin, quantity, currentPrice, sellPrice, date } = req.body;

  transactions
    .execute(userId, coin, quantity, currentPrice, sellPrice, date, false)
    .then(() => res.sendStatus(200))
    .catch((err) => {
      // FIXME: What http status code to use here
      next(createError(500, err));
    });
};

module.exports = { buy, sell };
