import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isBetReadyToResolve,
  getBetPoints,
  shouldUpdateScore,
} from "../checkBetData";
import { UserBet } from "~/modules/Bets/types/userBets";
import { CRYPTO_BET, BET_TIME } from "~/modules/Bets/constants/bets";

describe("checkBetData", () => {
  const mockBet: UserBet = {
    id: "test-bet-id",
    userId: "test-user-id",
    bet: CRYPTO_BET.UP,
    cryptoPrice: 45000,
    success: undefined,
    createdAt: new Date("2023-01-01T12:00:00Z"),
    updatedAt: new Date("2023-01-01T12:00:00Z"),
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("isBetReadyToResolve function", () => {
    it("should return false when time is one second before the bet time limit", () => {
      const betCreationTime = new Date("2023-01-01T12:00:00Z");
      const currentTime = new Date(betCreationTime.getTime() + BET_TIME - 1000);

      vi.setSystemTime(currentTime);

      const bet = { ...mockBet, createdAt: betCreationTime };

      expect(isBetReadyToResolve(bet)).toBe(false);
    });

    it("should return true when time is exactly the bet time limit", () => {
      const betCreationTime = new Date("2023-01-01T12:00:00Z");
      const currentTime = new Date(betCreationTime.getTime() + BET_TIME);

      vi.setSystemTime(currentTime);

      const bet = { ...mockBet, createdAt: betCreationTime };

      expect(isBetReadyToResolve(bet)).toBe(true);
    });

    it("should return true when time is 5 seconds after the bet time limit", () => {
      const betCreationTime = new Date("2023-01-01T12:00:00Z");
      const currentTime = new Date(betCreationTime.getTime() + BET_TIME + 5000);

      vi.setSystemTime(currentTime);

      const bet = { ...mockBet, createdAt: betCreationTime };

      expect(isBetReadyToResolve(bet)).toBe(true);
    });

    it("should handle different bet creation times", () => {
      const betCreationTime = new Date("2023-06-15T08:30:45Z");
      const currentTime = new Date(betCreationTime.getTime() + BET_TIME + 1000);

      vi.setSystemTime(currentTime);

      const bet = { ...mockBet, createdAt: betCreationTime };

      expect(isBetReadyToResolve(bet)).toBe(true);
    });
  });

  describe("getBetPoints function", () => {
    describe("UP bets", () => {
      it("should return 1 when current price is higher than bet price", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.UP, cryptoPrice: 45000 };
        const currentPrice = 46000;

        expect(getBetPoints(bet, currentPrice)).toBe(1);
      });

      it("should return -1 when current price is lower than bet price", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.UP, cryptoPrice: 45000 };
        const currentPrice = 44000;

        expect(getBetPoints(bet, currentPrice)).toBe(-1);
      });

      it("should return 0 when current price equals bet price", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.UP, cryptoPrice: 45000 };
        const currentPrice = 45000;

        expect(getBetPoints(bet, currentPrice)).toBe(0);
      });
    });

    describe("DOWN bets", () => {
      it("should return 1 when current price is lower than bet price", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.DOWN, cryptoPrice: 45000 };
        const currentPrice = 44000;

        expect(getBetPoints(bet, currentPrice)).toBe(1);
      });

      it("should return -1 when current price is higher than bet price", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.DOWN, cryptoPrice: 45000 };
        const currentPrice = 46000;

        expect(getBetPoints(bet, currentPrice)).toBe(-1);
      });

      it("should return 0 when current price equals bet price", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.DOWN, cryptoPrice: 45000 };
        const currentPrice = 45000;

        expect(getBetPoints(bet, currentPrice)).toBe(0);
      });
    });

    describe("edge cases", () => {
      it("should handle decimal prices for UP bets", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.UP, cryptoPrice: 45000.5 };
        const currentPrice = 45000.51;

        expect(getBetPoints(bet, currentPrice)).toBe(1);
      });

      it("should handle decimal prices for DOWN bets", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.DOWN, cryptoPrice: 45000.5 };
        const currentPrice = 45000.49;

        expect(getBetPoints(bet, currentPrice)).toBe(1);
      });

      it("should handle very small price differences", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.UP, cryptoPrice: 45000.001 };
        const currentPrice = 45000.002;

        expect(getBetPoints(bet, currentPrice)).toBe(1);
      });

      it("should handle zero prices", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.UP, cryptoPrice: 0 };
        const currentPrice = 1;

        expect(getBetPoints(bet, currentPrice)).toBe(1);
      });
    });
  });

  describe("shouldUpdateScore function", () => {
    it("should return true when bet points is positive", () => {
      expect(shouldUpdateScore(1, 10)).toBe(true);
    });

    it("should return true when bet points is negative and current score is positive", () => {
      expect(shouldUpdateScore(-1, 5)).toBe(true);
    });

    it("should return false when bet points is negative and current score is 0", () => {
      expect(shouldUpdateScore(-1, 0)).toBe(false);
    });

    it("should return false when bet points is 0", () => {
      expect(shouldUpdateScore(0, 10)).toBe(false);
    });

    it("should return false when bet points is 0 and current score is 0", () => {
      expect(shouldUpdateScore(0, 0)).toBe(false);
    });
  });
});
