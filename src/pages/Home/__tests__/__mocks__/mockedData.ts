import {
  BET_TIME,
  CRYPTO_BET,
  BET_RESULT,
} from "~/modules/Bets/constants/bets";
import { UserBet, UserScore } from "~/modules/Bets/types/userBets";

export const betCreationTime = new Date("2023-01-01T12:00:00Z");

export const mockCurrentTime = new Date(
  betCreationTime.getTime() + BET_TIME - 1000
);

export const mockUser = {
  id: "test-user-id",
  username: "testuser",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockBitcoinPrice = 45000;

export const mockUserBets: UserBet[] = [
  {
    id: "bet-1",
    userId: mockUser.id,
    bet: CRYPTO_BET.UP,
    cryptoStartPrice: 44000,
    cryptoEndPrice: 45000,
    result: BET_RESULT.SUCCESS,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "bet-2",
    userId: mockUser.id,
    bet: CRYPTO_BET.UP,
    cryptoStartPrice: 46000,
    cryptoEndPrice: 45000,
    result: BET_RESULT.FAILURE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockOngoingBet: UserBet = {
  id: "bet-ongoing",
  userId: mockUser.id,
  bet: CRYPTO_BET.UP,
  cryptoStartPrice: mockBitcoinPrice,
  cryptoEndPrice: null,
  result: null,
  createdAt: betCreationTime,
  updatedAt: betCreationTime,
};

export const mockUserScore: UserScore = {
  id: "score-1",
  userId: mockUser.id,
  score: 15,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockSupabaseScore = {
  id: mockUserScore.id,
  user_id: mockUserScore.userId,
  score: mockUserScore.score,
  created_at: mockUserScore.createdAt.toISOString(),
  updated_at: mockUserScore.updatedAt.toISOString(),
};

export const createMockScore = (
  overrides: Partial<UserScore> = {}
): UserScore => ({
  id: `score-34534`,
  userId: mockUser.id,
  score: 0,
  createdAt: new Date(mockCurrentTime),
  updatedAt: new Date(mockCurrentTime),
  ...overrides,
});

export const mockBetUpLabel = "Bet if the price will go up";
export const mockBetDownLabel = "Bet if the price will go down";
