const axios = require("axios");

//Node cache initialised with default expiration of 60 seconds
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 60 });

const BASE_URL = `https://api.coingecko.com/api/v3/`;

const { supportedCoins, supportedCurrencies } = require("../config");

/**
 * Service to return CoinGecko API response of all
 * supported coins and their details from either node
 * cache if cached response is still live else from
 * CoinGeckos API (response stored in cache then returned)
 * @param   {String} currency vs_currency of the user
 * @returns {List}            API/Cache response
 */
async function getCurrentPrices(currency) {
  if (!supportedCurrencies.includes(currency)) {
    throw new Error("Unsupported Currency");
  }

  if (myCache.has(currency)) {
    console.log("Getting API Data from cache");
    return myCache.get(currency);
  }

  let current_prices;
  let url = BASE_URL;
  url += "coins/markets";
  url += `?vs_currency=${currency}`;
  url += `&ids=${supportedCoins.join(",")}`;
  url += "&order=market_cap_desc";
  url += "&per_page=100";
  url += "&page=1";
  url += "&sparkline=false";

  try {
    console.log("Getting data from CoinGecko API");
    current_prices = await axios(url);
    current_prices = current_prices.data;
  } catch (e) {
    console.log(e.message);
    throw new Error(
      `CryptoAppError: ${e.message} --- ${e.response.statusText}`
    );
  }

  myCache.set(currency, current_prices, 60);
  return current_prices;
}

module.exports = { getCurrentPrices };
