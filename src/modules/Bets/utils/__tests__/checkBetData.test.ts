import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { UserBet } from "~/modules/Bets/types/userBets";
import {
  isBetReadyToResolve,
  getUserBetUpdatedResult,
  getBetPoints,
  shouldUpdateScore,
} from "../checkBetData";
import {
  CRYPTO_BET,
  BET_TIME,
  BET_RESULT,
} from "~/modules/Bets/constants/bets";

describe("checkBetData", () => {
  const mockBet: UserBet = {
    id: "test-bet-id",
    userId: "test-user-id",
    bet: CRYPTO_BET.UP,
    cryptoStartPrice: 45000,
    cryptoEndPrice: null,
    result: null,
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

  describe("getUserBetUpdatedResult function", () => {
    describe("UP bets", () => {
      it("should return SUCCESS when current price is higher than start price", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.UP, cryptoStartPrice: 45000 };
        const currentPrice = 46000;

        const betUpdated = getUserBetUpdatedResult(bet, currentPrice);

        expect(betUpdated.cryptoEndPrice).toBe(46000);
        expect(betUpdated.result).toBe(BET_RESULT.SUCCESS);
      });

      it("should return FAILURE when current price is lower than start price", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.UP, cryptoStartPrice: 45000 };
        const currentPrice = 44000;

        const betUpdated = getUserBetUpdatedResult(bet, currentPrice);

        expect(betUpdated.cryptoEndPrice).toBe(44000);
        expect(betUpdated.result).toBe(BET_RESULT.FAILURE);
      });

      it("should return TIE when current price equals start price", () => {
        const bet = { ...mockBet, bet: CRYPTO_BET.UP, cryptoStartPrice: 45000 };
        const currentPrice = 45000;

        const betUpdated = getUserBetUpdatedResult(bet, currentPrice);

        expect(betUpdated.cryptoEndPrice).toBe(45000);
        expect(betUpdated.result).toBe(BET_RESULT.TIE);
      });
    });

    describe("DOWN bets", () => {
      it("should return SUCCESS when current price is lower than start price", () => {
        const bet = {
          ...mockBet,
          bet: CRYPTO_BET.DOWN,
          cryptoStartPrice: 45000,
        };
        const currentPrice = 44000;

        const betUpdated = getUserBetUpdatedResult(bet, currentPrice);

        expect(betUpdated.cryptoEndPrice).toBe(44000);
        expect(betUpdated.result).toBe(BET_RESULT.SUCCESS);
      });

      it("should return FAILURE when current price is higher than start price", () => {
        const bet = {
          ...mockBet,
          bet: CRYPTO_BET.DOWN,
          cryptoStartPrice: 45000,
        };
        const currentPrice = 46000;

        const betUpdated = getUserBetUpdatedResult(bet, currentPrice);

        expect(betUpdated.cryptoEndPrice).toBe(46000);
        expect(betUpdated.result).toBe(BET_RESULT.FAILURE);
      });

      it("should return TIE when current price equals start price", () => {
        const bet = {
          ...mockBet,
          bet: CRYPTO_BET.DOWN,
          cryptoStartPrice: 45000,
        };
        const currentPrice = 45000;

        const betUpdated = getUserBetUpdatedResult(bet, currentPrice);

        expect(betUpdated.cryptoEndPrice).toBe(45000);
        expect(betUpdated.result).toBe(BET_RESULT.TIE);
      });
    });
  });

  describe("getBetPoints function", () => {
    it("should return 1 for SUCCESS result", () => {
      const bet = { ...mockBet, result: BET_RESULT.SUCCESS };

      expect(getBetPoints(bet)).toBe(1);
    });

    it("should return -1 for FAILURE result", () => {
      const bet = { ...mockBet, result: BET_RESULT.FAILURE };

      expect(getBetPoints(bet)).toBe(-1);
    });

    it("should return 0 for TIE result", () => {
      const bet = { ...mockBet, result: BET_RESULT.TIE };

      expect(getBetPoints(bet)).toBe(0);
    });

    it("should return 0 for undefined result", () => {
      const bet = { ...mockBet, result: null };

      expect(getBetPoints(bet)).toBe(0);
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
