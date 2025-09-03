import { CRYPTO_BET } from "~/modules/Bets/constants/bets";
import { UserBet } from "~/modules/Bets/types/userBets";

export const mockBetDescriptionEmpty =
  "Start guessing the Bitcoin price and raise your score! Bet if the price in the next minute will go up or down from your initial value.";

export const mockBetDescription =
  "Keep guessing the Bitcoin price and raise your score. Bet if the price in the next minute will go up or down from your initial value.";

export const mockBetDescriptionOngoing =
  "The bets are not available until the current bet is resolved.";

export const defaultUser = {
  id: "test-user-id",
  username: "testuser",
};

export const mockedBet: UserBet = {
  id: "bet-id",
  userId: "test-user-id",
  bet: CRYPTO_BET.UP,
  cryptoPrice: 45000,
  success: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};
