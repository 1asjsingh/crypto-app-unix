const createError = require("http-errors");
const users = require("../services/users.service");

/**
 * Request controller that responds with user
 * details such as balance, username.
 * @param  {String} userId Users firebase UUID
 * @returns {List}          User details
 */
const getUserDetails = (req, res, next) => {
  const userId = req.params["userId"];

  users
    .getDetails(userId)
    .then((details) => {
      res.json(details);
    })
    .catch((err) => {
      http_status_code = err.message.toLowerCase().includes("not found")
        ? 404
        : 500;
      next(createError(http_status_code, err));
    });
};

module.exports = { getUserDetails };
