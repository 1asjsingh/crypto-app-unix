const db = require("../firestore");

/**
 * Service that returns user details such
 * as balance, username.
 * @param   {String} userId Users firebase UUID
 * @returns {List}          User details
 */
const getDetails = async (userId) => {
  const user = await db
    .collection(process.env.FIREBASE_USERS_COLLECTION)
    .doc(userId)
    .get();
  if (!user.exists) {
    throw new Error(`CryptoAppError: User with ID ${userId} not found.`);
  } else {
    return user.data();
  }
};

/**
 * Service that returns an ordered list of a users
 * transaction history sorted by recent transactions
 * first
 * @param   {String} userId Users firebase UUID
 * @returns {List}          Ordered list of transaction history
 */
const getTransactionHistory = async (userId) => {
  const transactions = await db
    .collection(process.env.FIREBASE_USERS_COLLECTION)
    .doc(userId)
    .collection(process.env.FIREBASE_USERS_TRANSACTIONS_COLLECTION)
    .get();
  let transactionHistory = transactions.docs.map((data) => ({
    coin: data.id,
    ...data.data(),
  }));

  transactionHistory.sort(function (x, y) {
    return new Date(x.time) - new Date(y.time);
  });
  return transactionHistory;
};

module.exports = {
  getDetails,
  getTransactionHistory,
};
