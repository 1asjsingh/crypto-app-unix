const db = require("../firestore");
const users = require("./users.service");

/**
 * Service to execute a transaction order on a coin
 * @param {String}  userId       Users firebase UUID
 * @param {String}  coin         Coin in the order
 * @param {Float}   quantity     Quantity of transaction
 * @param {Float}   currentPrice Price for a single coin
 * @param {Float}   totalPrice   Total order price
 * @param {Date}    date         Data and time of transaction
 * @param {Boolean} buyOrder     Determine buy or sell order
 */
const execute = async (
  userId,
  coin,
  quantity,
  currentPrice,
  totalPrice,
  date,
  buyOrder
) => {
  const user = await users.getDetails(userId);

  const transactionHistory = await users.getTransactionHistory(userId);
  const transactionId = 1 + transactionHistory.length;

  const userDB = db
    .collection(process.env.FIREBASE_USERS_COLLECTION)
    .doc(userId);
  const order = userDB
    .collection(process.env.FIREBASE_USERS_TRANSACTIONS_COLLECTION)
    .doc(transactionId.toString());

  //if buy order then positive else negative
  const sign = buyOrder ? 1 : -1;

  //batch transaction for atomicity
  const batch = db.batch();
  batch.set(order, {
    coin: coin,
    quantity: parseFloat(sign * quantity),
    price: parseFloat(currentPrice),
    time: date,
  });

  let updateBalance = user.balance - sign * totalPrice;

  batch.update(userDB, { balance: updateBalance });

  await batch.commit();
};

module.exports = {
  execute,
};
