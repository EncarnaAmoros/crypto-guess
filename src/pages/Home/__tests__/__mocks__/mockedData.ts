import { BET_TIME, CRYPTO_BET } from "~/modules/Bets/constants/bets";
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
    cryptoPrice: 44000,
    success: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "bet-2",
    userId: mockUser.id,
    bet: CRYPTO_BET.DOWN,
    cryptoPrice: 46000,
    success: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockOngoingBet: UserBet = {
  id: "bet-ongoing",
  userId: mockUser.id,
  bet: CRYPTO_BET.UP,
  cryptoPrice: mockBitcoinPrice,
  success: undefined,
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

export const mockSupabaseBets = mockUserBets.map((bet) => ({
  id: bet.id,
  user_id: bet.userId,
  bet: bet.bet,
  crypto_price: bet.cryptoPrice,
  success: bet.success,
  created_at: bet.createdAt.toISOString(),
  updated_at: bet.updatedAt.toISOString(),
}));

export const mockSupabaseScore = {
  id: mockUserScore.id,
  user_id: mockUserScore.userId,
  score: mockUserScore.score,
  created_at: mockUserScore.createdAt.toISOString(),
  updated_at: mockUserScore.updatedAt.toISOString(),
};

export const mockSupabaseOngoingBet = {
  id: mockOngoingBet.id,
  user_id: mockOngoingBet.userId,
  bet: mockOngoingBet.bet,
  crypto_price: mockOngoingBet.cryptoPrice,
  success: mockOngoingBet.success,
  created_at: mockOngoingBet.createdAt.toISOString(),
  updated_at: mockOngoingBet.updatedAt.toISOString(),
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
