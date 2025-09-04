import { http, HttpResponse } from "msw";
import { GET_BTC_PRICE_BASE_URL } from "~/modules/Bets/constants/bets";
import { mockBitcoinPrice } from "./mockedData";

const newBtcPrice = mockBitcoinPrice + 1;

export const bitcoinRequestHandler = [
  http.get(`${GET_BTC_PRICE_BASE_URL}`, () => {
    const response = HttpResponse.json(
      {
        bitcoin: {
          usd: newBtcPrice,
        },
      },
      { status: 200 }
    );

    return response;
  }),
];
