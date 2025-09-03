import { waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHookWithIntl } from "~/tests/test-utils";
import useBetSection from "../useBetSection";
import { CRYPTO_BET } from "~/modules/Bets/constants/bets";
import {
  defaultUser,
  mockedBet,
  mockBetDescriptionEmpty,
  mockBetDescription,
  mockBetDescriptionOngoing,
} from "./mockedData";
import * as betsService from "~/modules/Bets/service/betsService";
import * as useBetStore from "~/modules/Bets/store/useBetStore";
import * as useSessionStore from "~/modules/Auth/store/useSessionStore";
import * as useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";

vi.mock("~/modules/Bets/service/betsService");
vi.mock("~/modules/Bets/store/useBetStore");
vi.mock("~/modules/Auth/store/useSessionStore");
vi.mock("~/modules/Layout/hooks/useGeneralLayoutStore");

describe("useBetSection", () => {
  const mockSetGeneralError = vi.fn();
  const mockSetUserBets = vi.fn();
  const mockGetUserBets = vi.mocked(betsService.getUserBets);
  const mockCreateUserBet = vi.mocked(betsService.createUserBet);
  const mockUseBetStore = vi.mocked(useBetStore.default);
  const mockUseSessionStore = vi.mocked(useSessionStore.default);
  const mockUseGeneralLayoutStore = vi.mocked(useGeneralLayoutStore.default);

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseGeneralLayoutStore.mockReturnValue(mockSetGeneralError);
    mockUseSessionStore.mockReturnValue({ user: defaultUser });
    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 45000,
      userBets: [],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
    });
    mockGetUserBets.mockResolvedValue({
      error: false,
      data: [],
    });
  });

  it("should return empty state description when no user bets", () => {
    const { result } = renderHookWithIntl(() => useBetSection());

    expect(result.current.betTextDescription).toBe(mockBetDescriptionEmpty);
    expect(result.current.currentBetOnGoing).toBe(false);
  });

  it("should return bet non empty description state when user has bets", () => {
    const completedBet = { ...mockedBet, success: true };
    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 45000,
      userBets: [completedBet],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
    });

    const { result } = renderHookWithIntl(() => useBetSection());

    expect(result.current.betTextDescription).toBe(mockBetDescription);
    expect(result.current.currentBetOnGoing).toBe(false);
  });

  it("should return ongoing bet text when user has ongoing bet", () => {
    const ongoingBet = { ...mockedBet, success: undefined };
    mockUseBetStore.mockReturnValue({
      userBets: [ongoingBet],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      bitcoinPrice: 45000,
    });

    const { result } = renderHookWithIntl(() => useBetSection());

    expect(result.current.betTextDescription).toBe(mockBetDescriptionOngoing);
    expect(result.current.currentBetOnGoing).toBe(true);
  });

  it("should detect ongoing bet correctly", () => {
    const ongoingBet = { ...mockedBet, success: undefined };
    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 45000,
      userBets: [ongoingBet],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
    });

    const { result } = renderHookWithIntl(() => useBetSection());

    expect(result.current.currentBetOnGoing).toBe(true);
  });

  it("should fetch user bets on mount", async () => {
    mockGetUserBets.mockResolvedValue({
      error: false,
      data: [mockedBet],
    });

    renderHookWithIntl(() => useBetSection());

    await waitFor(() => {
      expect(mockGetUserBets).toHaveBeenCalledWith(defaultUser.id);
    });
  });

  it("should handle getUserBets error", async () => {
    mockGetUserBets.mockResolvedValue({
      error: true,
      messageKey: "general.error",
    });

    renderHookWithIntl(() => useBetSection());

    await waitFor(() => {
      expect(mockSetGeneralError).toHaveBeenCalledWith(
        "Something went wrong. Try again later."
      );
    });
  });

  it("should not fetch bets when user is not logged in", () => {
    mockUseSessionStore.mockReturnValue({
      session: null,
    });

    renderHookWithIntl(() => useBetSection());

    expect(mockGetUserBets).not.toHaveBeenCalled();
  });

  describe("makeBetHandler", () => {
    it("should create UP bet successfully", async () => {
      mockCreateUserBet.mockResolvedValue({
        error: false,
        data: [mockedBet],
      });

      const { result } = renderHookWithIntl(() => useBetSection());

      await result.current.makeBetHandler(CRYPTO_BET.UP);

      expect(mockCreateUserBet).toHaveBeenCalledWith(
        defaultUser.id,
        CRYPTO_BET.UP,
        45000
      );
      expect(mockSetUserBets).toHaveBeenCalledWith([mockedBet]);
    });

    it("should create DOWN bet successfully", async () => {
      const downBet = { ...mockedBet, bet: CRYPTO_BET.DOWN };
      mockCreateUserBet.mockResolvedValue({
        error: false,
        data: [downBet],
      });

      const { result } = renderHookWithIntl(() => useBetSection());

      await result.current.makeBetHandler(CRYPTO_BET.DOWN);

      expect(mockCreateUserBet).toHaveBeenCalledWith(
        defaultUser.id,
        CRYPTO_BET.DOWN,
        45000
      );
      expect(mockSetUserBets).toHaveBeenCalledWith([downBet]);
    });

    it("should handle create user bet error", async () => {
      mockCreateUserBet.mockResolvedValue({
        error: true,
        messageKey: "general.error",
      });

      const { result } = renderHookWithIntl(() => useBetSection());

      await result.current.makeBetHandler(CRYPTO_BET.UP);

      expect(mockSetGeneralError).toHaveBeenCalledWith(
        "Something went wrong. Try again later."
      );
    });

    it("should not create bet when user is not logged in", async () => {
      mockUseSessionStore.mockReturnValue({
        session: null,
      });

      const { result } = renderHookWithIntl(() => useBetSection());

      await result.current.makeBetHandler(CRYPTO_BET.UP);

      expect(mockCreateUserBet).not.toHaveBeenCalled();
    });

    it("should use current bitcoin price for bet", async () => {
      const bitcoinPrice = 50000;
      mockUseBetStore.mockReturnValue({
        bitcoinPrice,
        userBets: [],
        setUserBets: mockSetUserBets,
        setBitcoinPrice: vi.fn(),
      });

      mockCreateUserBet.mockResolvedValue({
        error: false,
        data: [mockedBet],
      });

      const { result } = renderHookWithIntl(() => useBetSection());

      await result.current.makeBetHandler(CRYPTO_BET.UP);

      expect(mockCreateUserBet).toHaveBeenCalledWith(
        defaultUser.id,
        CRYPTO_BET.UP,
        bitcoinPrice
      );
    });
  });

  it("should handle mixed bet states correctly", () => {
    const completedBet = { ...mockedBet, id: "completed", success: true };
    const ongoingBet = { ...mockedBet, id: "ongoing", success: undefined };

    mockUseBetStore.mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector({
          bitcoinPrice: 45000,
          userBets: [completedBet, ongoingBet],
          setUserBets: mockSetUserBets,
          setBitcoinPrice: vi.fn(),
        });
      }
      return 45000;
    });

    const { result } = renderHookWithIntl(() => useBetSection());

    expect(result.current.currentBetOnGoing).toBe(true);
    expect(result.current.betTextDescription).toBe(mockBetDescriptionOngoing);
  });
});
