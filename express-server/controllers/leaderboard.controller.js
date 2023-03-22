const createError = require("http-errors");
const leaderboard = require("../services/leaderboard.service");

/**
 * Request controller that responds with an ordered list of
 * the top 10 portfolios ranked by profit loss in descending
 * order
 * @param  {String} currency vs_currency of the user
 * @returns {List}            Ordered list of portfolios
 */
const getPortfolioLeaderboard = (req, res, next) => {
  const currency = req.params["currency"];
  leaderboard
    .getPortfolioLeaderboard(currency)
    .then((portfolioLeaderboard) => res.json(portfolioLeaderboard))
    .catch((err) => {
      console.log("Error in /leaderboard/portfolio");
      next(createError(500, err));
    });
};

/**
 * Request controller that updates a users high score for
 * the chart game
 * @param {String}  userId   Users firebase UUID
 * @param {Integer} newScore Users new game score
 */
const updateUserGameScore = async (req, res, next) => {
  const userId = req.params["userId"];
  const newScore = parseInt(req.params["newScore"]);
  leaderboard
    .updateUserGameScore(userId, newScore)
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.log("couldn't update user's game score on leaderboard");
      next(createError(500, err));
    });
};

/**
 * Request controller that responds with an ordered list
 * of the top 10 accounts ranked by high score in descending
 * order
 * @returns {List} Ordered list of account statistics
 */
const getGameLeaderboard = async (_req, res, next) => {
  leaderboard
    .getGameLeaderboard()
    .then((gameLeaderboard) => res.json(gameLeaderboard))
    .catch((err) => {
      console.log("Error in /leaderboard/game");
      next(createError(500, err));
    });
};

module.exports = {
  getPortfolioLeaderboard,
  updateUserGameScore,
  getGameLeaderboard,
};
