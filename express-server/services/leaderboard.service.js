const { portfolioCalc } = require("../services/portfolio.service");
const db = require("../firestore");
const coingecko = require("./coingecko.service");

/**
 * Service that returns an ordered list of the top 10
 * portfolios ranked by profit loss in descending order
 * @param   {String} currency vs_currency of the user
 * @returns {List}            Ordered list of portfolios
 */
const getPortfolioLeaderboard = async (currency) => {
  let portfolioLeaderboard;
  try {
    portfolioLeaderboard = await db
      .collection(process.env.FIREBASE_LEADERBOARDS_COLLECTION)
      .where("currency", "==", currency)
      .get();
  } catch (err) {
    throw new Error(
      `couldn't fetch portfolio leaderboard for currency ${currency}`
    );
  }
  // Remove portfolios with no profit or loss and sort by profit loss descending
  portfolioLeaderboard = portfolioLeaderboard.docs
    .map((data) => ({ ...data.data() }))
    .filter((curr) => curr.PL !== 0);
  portfolioLeaderboard.sort((x, y) => y.PL - x.PL);
  return portfolioLeaderboard.slice(0, 10);
};

/**
 * Service that returns an ordered list of the top
 * 10 accounts ranked by high score in descending order
 * @returns {List} Ordered list of account statistics
 */
const getGameLeaderboard = async () => {
  let gameLeaderboard;
  try {
    gameLeaderboard = await db
      .collection(process.env.FIREBASE_LEADERBOARDS_COLLECTION)
      .where("score", ">", 0)
      .get();
  } catch (err) {
    throw new Error("couldn't fetch game leaderboard");
  }
  //Order by each accounts scores
  gameLeaderboard = gameLeaderboard.docs.map((data) => ({ ...data.data() }));
  gameLeaderboard.sort((x, y) => y.score - x.score);
  return gameLeaderboard.slice(0, 10);
};

/**
 * Service that updates a users high score for
 * the chart game
 * @param {String}  userId   Users firebase UUID
 * @param {Integer} newScore Users new game score
 */
const updateUserGameScore = async (userId, newScore) => {
  let currentUserStatsRef = db
    .collection(process.env.FIREBASE_LEADERBOARDS_COLLECTION)
    .doc(userId);
  let currentUserStats;
  try {
    currentUserStats = await currentUserStatsRef.get();
  } catch (err) {
    throw new Error("couldn't fetch user's stats on leaderboard");
  }

  //Check if old high score larger than old then dont update
  let currScore = currentUserStats.data().score;
  if (parseInt(currScore) >= parseInt(newScore)) {
    return;
  }

  try {
    await currentUserStatsRef.update({ score: newScore });
  } catch (err) {
    throw new Error("couldn't update user's highest game score on leaderboard");
  }
};

/**
 * Function to update the profit loss attribute of
 * accounts in crypto-leaderboard collection
 * @param {String} currency vs_currency of the user
 */
const leaderboardUpdate = async (currency) => {
  const cryptoAccounts = db.collection(process.env.FIREBASE_USERS_COLLECTION);
  let allAccounts;
  try {
    allAccounts = await cryptoAccounts.where("currency", "==", currency).get();
  } catch (err) {
    throw new Error(`couldnt fetch accounts with currency ${currency}`);
  }

  await coingecko.getCurrentPrices(currency.substring(0, 3));

  //Loop through each account individually
  allAccounts.forEach(async (account) => {
    let portfolio;
    try {
      //Get portfolio statistics i.e. profit loss amount
      portfolio = await portfolioCalc(account.id, currency.substring(0, 3));
    } catch (err) {
      throw new Error("couldn't calculate the portfolio");
    }
    const leaderboardDB = db.collection("crypto-leaderboard").doc(account.id);
    try {
      //Update profit loss for the leaderboard
      await leaderboardDB.update({
        PL: portfolio.balanceIncProfits - 100000,
      });
    } catch (err) {
      throw new Error("couldn't update the portfolio leaderboard");
    }
  });
};

/**
 * Function to call leaderboardUpdate and
 * update profit loss for all three leaderboards
 * (usd, cad, gbp)
 */
const executeLeaderboardUpdate = () => {
  console.log("Updating leaderboards...");
  ["usd$", "cad$", "gbp£"].forEach((curr) => {
    leaderboardUpdate(curr).catch((err) => {
      console.log(err);
      console.log(err.message);
    });
  });
};

module.exports = {
  getPortfolioLeaderboard,
  getGameLeaderboard,
  updateUserGameScore,
  leaderboardUpdate,
  executeLeaderboardUpdate,
};
