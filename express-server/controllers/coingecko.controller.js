const createError = require("http-errors");

const coingecko = require("../services/coingecko.service");

/**
 * Request controller that responds with a list of
 * coins and their corresponding details.
 * @param    {String} currency vs_currency of the user
 * @returns   {List}           API/Cached response of coin
 *                            details
 */
const getCurrentPrices = (req, res, next) => {
  const currency = req.params["currency"];

  coingecko
    .getCurrentPrices(currency)
    .then((current_prices) => res.json(current_prices))
    .catch((err) => {
      let err_msg = err.message.toLowerCase();
      if (err_msg.includes("not found")) {
        err = createError.NotFound();
      } else if (err_msg.includes("bad request")) {
        err = createError.BadRequest();
      } else if (err_msg.includes("too many requests")) {
        err = createError.TooManyRequests();
      } else if (
        err_msg.includes("unauthorised") ||
        err_msg.includes("unauthorized")
      ) {
        err = createError.Unauthorized();
      } else {
        err = createError(500, err);
      }
      next(err);
    });
};

module.exports = { getCurrentPrices };
