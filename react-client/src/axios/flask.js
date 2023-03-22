import axios from "axios";

export const client = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: { accept: "application/json" },
});

export const errorHandler = (e) => {
  if (e.code === "ERR_NETWORK") {
    alert("Prediction server is offline, try again.");
  } else if (e.response) {
    if (e.response.status === 500) {
      alert("Unsupported coin or versus currency for prediction.");
    }
  }
};
