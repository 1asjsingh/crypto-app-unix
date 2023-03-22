const cfg = require(process.env.COIN_VS_CURRENCY_PATH);

export const supportedCoins = cfg.coin_ids;
export const supportedCurrencies = cfg.vs_currencies;
