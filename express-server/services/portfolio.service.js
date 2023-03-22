const users = require("./users.service");
const coingecko = require("./coingecko.service");

/**
 * Service that calculates a users current holdings
 * as well as statistics for each holding i.e PL, Quantity.
 * Also calculates the users balance including owned assets
 * and their current profit losses
 * @param   {String} userId Users firebase UUID
 * @param   {String} currency vs_currency of the user
 * @returns {Object}          Portfolio and its statistics
 */
const portfolioCalc = async (userId, currency) => {
  let current_prices = await coingecko.getCurrentPrices(currency);

  let userDetails = await users.getDetails(userId);
  // TODO: Catch error or just let it throw?

  let transactionHistory = await users.getTransactionHistory(userId);
  // TODO: Catch error or just let it throw?

  let coins = [];
  let quantity = [];
  let totalPrice = [];
  let openPL = [];

  let docIndex = 0; //index counter for transactionHistory
  let indexRemove = []; //List of indexes to remove from transaction history (SELL ORDERS/Assets that have been completely sold)

  // TODO: Check logic and decompose

  //FIFO: Sell the assets user acquired first
  transactionHistory.forEach((doc) => {
    //if SELL ORDER
    if (parseFloat(doc.quantity) < 0) {
      let absVal = Math.abs(parseFloat(doc.quantity));
      //while sell order not completed
      while (absVal > 0) {
        //find first acquired asset and its quantity
        const index = transactionHistory.findIndex((i) => i.coin === doc.coin);
        const indexQuantity = parseFloat(transactionHistory[index]["quantity"]);
        //if sell quantity > first acquired asset quantity
        if (indexQuantity > 0 && absVal >= indexQuantity) {
          indexRemove.push(index);
          absVal -= indexQuantity;
          transactionHistory[index]["coin"] = "SOLD";
          //if sell quantity < first acquired asset
        } else if (indexQuantity > 0 && absVal < indexQuantity) {
          transactionHistory[index]["quantity"] = (
            parseFloat(transactionHistory[index]["quantity"]) - absVal
          ).toFixed(2); //FLOATING POINT ERROR FIX
          absVal -= indexQuantity;
        }
      }
      //Sell order satisfied add it to remove list
      indexRemove.push(docIndex);
      transactionHistory[docIndex]["coin"] = "SELLORDER";
    }
    docIndex += 1;
  });

  indexRemove = indexRemove.sort(function (x, y) {
    return x - y;
  });

  //Remove sell orders and first acquired assets that have been completely sold
  for (let i = indexRemove.length - 1; i >= 0; i--) {
    transactionHistory.splice(indexRemove[i], 1);
  }

  //Calculate and store portfolio statistics for each coin
  transactionHistory.forEach((doc) => {
    const currentPrice = current_prices.find(
      ({ id }) => id === doc.coin
    ).current_price;

    if (coins.includes(doc.coin)) {
      const i = coins.indexOf(doc.coin);
      quantity[i] += parseFloat(doc.quantity);
      totalPrice[i] += parseFloat(doc.price) * parseFloat(doc.quantity); // total BUY price not current
      openPL[i] += (currentPrice - doc.price) * parseFloat(doc.quantity);
    } else {
      coins.push(doc.coin);
      quantity.push(parseFloat(doc.quantity));
      totalPrice.push(parseFloat(doc.price) * parseFloat(doc.quantity));
      openPL.push((currentPrice - doc.price) * parseFloat(doc.quantity));
    }
  });

  //total portfolio profits
  let profits = 0;
  coins.forEach(function (coin, i) {
    profits += openPL[i];
  });

  //Total money invested into asssets
  let totalPriceSum = 0;
  if (totalPrice.length > 0) {
    totalPriceSum = totalPrice.reduce((sum, x) => {
      return sum + x;
    });
  }

  const balanceIncProfits = parseFloat(
    userDetails.balance + totalPriceSum + profits
  );

  return {
    coins: coins,
    quantity: quantity,
    totalPrice: totalPrice,
    openPL: openPL,
    balanceIncProfits: balanceIncProfits,
  };
};

module.exports = {
  portfolioCalc,
};
