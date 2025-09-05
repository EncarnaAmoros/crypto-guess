import { screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithIntl } from "~/tests/testUtils";
import BetText from "../BetText";
import useBetStore from "~/modules/Bets/store/useBetStore";
import {
  mockOngoingBet,
  mockCompletedBet,
  mockFailedBet,
  mockUserScore,
  mockZeroScore,
  mockHighScore,
  mockHigherScore,
  betTextPatterns,
} from "./mockedData";

vi.mock("~/modules/Bets/store/useBetStore");

const mockUseBetStore = vi.mocked(useBetStore);

describe("BetText", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Having an ongoing bet", () => {
    it("should render ongoing bet disabled message", () => {
      mockUseBetStore.mockImplementation((selector) => {
        const state = {
          userScore: mockUserScore,
          userBets: [mockOngoingBet],
          bitcoinPrice: 45000,
          setBitcoinPrice: vi.fn(),
          setUserBets: vi.fn(),
          setUserScore: vi.fn(),
        };
        return selector(state);
      });

      renderWithIntl(<BetText />);

      expect(screen.getByText(betTextPatterns.ongoingBet1)).toBeVisible();
      expect(screen.getByText(betTextPatterns.notAvailable)).toBeVisible();
      expect(screen.getByText(betTextPatterns.ongoingBet2)).toBeVisible();
    });
  });

  describe("When user has no score or zero score", () => {
    it("should render empty state message when user score is null and has no bets yet", () => {
      mockUseBetStore.mockImplementation((selector) => {
        const state = {
          userScore: null,
          userBets: [],
          bitcoinPrice: 45000,
          setBitcoinPrice: vi.fn(),
          setUserBets: vi.fn(),
          setUserScore: vi.fn(),
        };
        return selector(state);
      });

      renderWithIntl(<BetText />);

      expect(screen.getByText(betTextPatterns.start1)).toBeVisible();
      expect(screen.getByText(betTextPatterns.bitcoin)).toBeVisible();
      expect(screen.getByText(betTextPatterns.start2)).toBeVisible();
    });

    it("should render empty state message when user has no bets yet", () => {
      mockUseBetStore.mockImplementation((selector) => {
        const state = {
          userScore: mockZeroScore,
          userBets: [],
          bitcoinPrice: 45000,
          setBitcoinPrice: vi.fn(),
          setUserBets: vi.fn(),
          setUserScore: vi.fn(),
        };
        return selector(state);
      });

      renderWithIntl(<BetText />);

      expect(screen.getByText(betTextPatterns.start1)).toBeVisible();
      expect(screen.getByText(betTextPatterns.bitcoin)).toBeVisible();
      expect(screen.getByText(betTextPatterns.start2)).toBeVisible();
    });
  });

  describe("when user can make a bet (normal state)", () => {
    it("should render normal bet description", () => {
      mockUseBetStore.mockImplementation((selector) => {
        const state = {
          userScore: mockHighScore,
          userBets: [mockCompletedBet],
          bitcoinPrice: 45000,
          setBitcoinPrice: vi.fn(),
          setUserBets: vi.fn(),
          setUserScore: vi.fn(),
        };
        return selector(state);
      });

      renderWithIntl(<BetText />);

      expect(screen.getByText(betTextPatterns.continue1)).toBeVisible();
      expect(screen.getByText(betTextPatterns.bitcoin)).toBeVisible();
      expect(screen.getByText(betTextPatterns.continue2)).toBeVisible();
    });

    it("should render normal bet description when no bets exist", () => {
      mockUseBetStore.mockImplementation((selector) => {
        const state = {
          userScore: mockHighScore,
          userBets: [],
          bitcoinPrice: 45000,
          setBitcoinPrice: vi.fn(),
          setUserBets: vi.fn(),
          setUserScore: vi.fn(),
        };
        return selector(state);
      });

      renderWithIntl(<BetText />);

      expect(screen.getByText(betTextPatterns.start1)).toBeVisible();
      expect(screen.getByText(betTextPatterns.bitcoin)).toBeVisible();
      expect(screen.getByText(betTextPatterns.start2)).toBeVisible();
    });
  });

  describe("edge cases", () => {
    it("should handle multiple bets with only completed ones", () => {
      mockUseBetStore.mockImplementation((selector) => {
        const state = {
          userScore: mockHigherScore,
          userBets: [mockCompletedBet, mockFailedBet],
          bitcoinPrice: 45000,
          setBitcoinPrice: vi.fn(),
          setUserBets: vi.fn(),
          setUserScore: vi.fn(),
        };
        return selector(state);
      });

      renderWithIntl(<BetText />);

      expect(screen.getByText(/guess the next/i)).toBeVisible();
    });

    it("should prioritize ongoing bet over score state", () => {
      mockUseBetStore.mockImplementation((selector) => {
        const state = {
          userScore: mockZeroScore,
          userBets: [mockOngoingBet],
          bitcoinPrice: 45000,
          setBitcoinPrice: vi.fn(),
          setUserBets: vi.fn(),
          setUserScore: vi.fn(),
        };
        return selector(state);
      });

      renderWithIntl(<BetText />);

      expect(screen.getByText(betTextPatterns.notAvailable)).toBeVisible();
      expect(screen.getByText(betTextPatterns.ongoingBet2)).toBeVisible();
      expect(
        screen.queryByText(betTextPatterns.start1)
      ).not.toBeInTheDocument();
    });
  });
});
