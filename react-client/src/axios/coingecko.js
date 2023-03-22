import axios from "axios";

export const client = axios.create({
  baseURL: "https://api.coingecko.com/api/v3/",
  headers: { accept: "application/json" },
});

export const errorHandler = (e) => {
  let alertMsg = "A problem with CoinGecko occurred. Try again later.";
  if (e.response) {
    if (e.response.status === 429) {
      alertMsg = "CoinGecko request limit reached. Try aain in a few minutes.";
    }
  } else if (e.code === "ERR_NETWORK") {
    alertMsg = "CoinGecko request limit reached. Try aain in a few minutes.";
  }
  alert(alertMsg);
};
