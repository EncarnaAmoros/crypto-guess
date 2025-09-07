import { CRYPTO_BET, BET_RESULT } from "~/modules/Bets/constants/bets";
import { UserBet, UserScore } from "~/modules/Bets/types/userBets";

export const mockOngoingBet: UserBet = {
  id: "bet-1",
  userId: "user-1",
  bet: CRYPTO_BET.UP,
  cryptoStartPrice: 45000,
  cryptoEndPrice: null,
  result: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCompletedBet: UserBet = {
  id: "bet-1",
  userId: "user-1",
  bet: CRYPTO_BET.UP,
  cryptoStartPrice: 45000,
  cryptoEndPrice: 46000,
  result: BET_RESULT.SUCCESS,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockFailedBet: UserBet = {
  id: "bet-2",
  userId: "user-1",
  bet: CRYPTO_BET.DOWN,
  cryptoStartPrice: 46000,
  cryptoEndPrice: 47000,
  result: BET_RESULT.FAILURE,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockUserScore: UserScore = {
  id: "score-1",
  userId: "user-1",
  score: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockZeroScore: UserScore = {
  id: "score-1",
  userId: "user-1",
  score: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockHighScore: UserScore = {
  id: "score-1",
  userId: "user-1",
  score: 150,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockHigherScore: UserScore = {
  id: "score-1",
  userId: "user-1",
  score: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const betTextPatterns = {
  ongoingBet1: /bet /i,
  notAvailable: /not available/i,
  ongoingBet2: /until the current bet is resolved./i,

  start1: /start now! predict/i,
  start2: /'s next move and climb the scoreboard\./i,

  continue1: /guess the next/i,
  continue2: /move, up or down, and boost your score!/i,

  bitcoin: /bitcoin/i,
};
