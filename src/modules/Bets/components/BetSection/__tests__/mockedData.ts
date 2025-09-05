import { CRYPTO_BET } from "~/modules/Bets/constants/bets";
import { UserBet } from "~/modules/Bets/types/userBets";

export const mockBetDescriptionEmpty1 = /start now! predict/i;

export const mockBetDescriptionEmpty2 =
  /'s next move and climb the scoreboard\./i;

export const mockBetDescriptionOngoing =
  "Bet not available until the current bet is resolved.";

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
