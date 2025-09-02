export const GET_BTC_PRICE_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

export const getBTCPrice = async () => {
  const response = await fetch(GET_BTC_PRICE_URL);
  const data = await response.json();
  return data.bitcoin.usd as number;
};
