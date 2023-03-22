import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:4000/",
  //headers: { accept: "application/json" },
});

// TODO: Whenever you catch an exception that uses express.axios, change
//       the catch (e) clause to call this callback i.e. `express.callback(e)`
export const errorHandler = (e) => {
  let alertMsg = "A problem with CryptoApp occurred. Try again later."
  if (e.response) {
    if (e.response.status === 429) {
      alertMsg = "CoinGecko request limit reached. Please wait 1-2 minutes.";
    }
  }
  alert(alertMsg);
};
