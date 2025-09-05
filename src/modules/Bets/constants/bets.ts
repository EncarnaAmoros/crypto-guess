export const GET_BTC_PRICE_BASE_URL =
  "https://api.coingecko.com/api/v3/simple/price";

export const GET_BTC_PRICE_URL = `${GET_BTC_PRICE_BASE_URL}?ids=bitcoin&vs_currencies=usd`;

export enum CRYPTO_BET {
  UP = "UP",
  DOWN = "DOWN",
}

export const BET_TIME = 60 * 100; //0;
