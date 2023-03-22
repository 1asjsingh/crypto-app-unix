const cfg = require(process.env.COIN_VS_CURRENCY_PATH);

const supportedCoins = cfg.coin_ids;
const supportedCurrencies = cfg.vs_currencies;

module.exports = {
  supportedCoins,
  supportedCurrencies
};
