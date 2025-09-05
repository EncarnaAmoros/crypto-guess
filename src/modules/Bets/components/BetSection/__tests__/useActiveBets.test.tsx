import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHookWithIntl } from "~/tests/testUtils";
import useActiveBets from "../hooks/useActiveBets";
import { GENERAL_ERROR } from "~/tests/constants/errorMessages";
import { defaultUser, mockedBet } from "./mockedData";
import * as betsService from "~/modules/Bets/service/betsService";
import * as useBetStore from "~/modules/Bets/store/useBetStore";
import * as useSessionStore from "~/modules/Auth/store/useSessionStore";
import * as useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import * as checkBetData from "~/modules/Bets/utils/checkBetData";

vi.mock("~/modules/Bets/service/betsService");
vi.mock("~/modules/Bets/store/useBetStore");
vi.mock("~/modules/Auth/store/useSessionStore");
vi.mock("~/modules/Layout/hooks/useGeneralLayoutStore");
vi.mock("~/modules/Bets/utils/checkBetData");

describe("useActiveBets", () => {
  const mockSetGeneralError = vi.fn();
  const mockSetUserBets = vi.fn();
  const mockSetUserScore = vi.fn();
  const mockUpdateUserBetSuccess = vi.mocked(betsService.updateUserBetSuccess);
  const mockGetUserScore = vi.mocked(betsService.getUserScore);
  const mockUpsertUserScore = vi.mocked(betsService.upsertUserScore);
  const mockUseBetStore = vi.mocked(useBetStore.default);
  const mockUseSessionStore = vi.mocked(useSessionStore.default);
  const mockUseGeneralLayoutStore = vi.mocked(useGeneralLayoutStore.default);
  const mockIsBetReadyToResolve = vi.mocked(checkBetData.isBetReadyToResolve);
  const mockGetBetPoints = vi.mocked(checkBetData.getBetPoints);
  const mockShouldUpdateScore = vi.mocked(checkBetData.shouldUpdateScore);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockUpsertUserScore.mockResolvedValue({
      error: false,
      data: {
        id: "score-id",
        userId: defaultUser.id,
        score: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    mockUseGeneralLayoutStore.mockReturnValue(mockSetGeneralError);
    mockUseSessionStore.mockReturnValue({ user: defaultUser });
    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 45000,
      userBets: [],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      setUserScore: mockSetUserScore,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not start interval when no ongoing bets", () => {
    const setIntervalSpy = vi.spyOn(global, "setInterval");

    renderHookWithIntl(() => useActiveBets());

    expect(setIntervalSpy).not.toHaveBeenCalled();
  });

  it("should start interval when there is an ongoing bet", () => {
    const ongoingBet = { ...mockedBet, success: null };
    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 45000,
      userBets: [ongoingBet],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      setUserScore: mockSetUserScore,
    });

    const setIntervalSpy = vi.spyOn(global, "setInterval");

    renderHookWithIntl(() => useActiveBets());

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  it("should clear interval when ongoing bet is resolved", () => {
    const clearIntervalSpy = vi.spyOn(global, "clearInterval");
    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 45000,
      userBets: [{ ...mockedBet, success: null }],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      setUserScore: mockSetUserScore,
    });

    const { rerender } = renderHookWithIntl(() => useActiveBets());

    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 45000,
      userBets: [],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      setUserScore: mockSetUserScore,
    });

    rerender();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("should not check bets when no user session", async () => {
    mockUseSessionStore.mockReturnValue({ session: null });
    mockIsBetReadyToResolve.mockReturnValue(true);
    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 45000,
      userBets: [{ ...mockedBet, success: null }],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      setUserScore: mockSetUserScore,
    });

    renderHookWithIntl(() => useActiveBets());

    vi.advanceTimersByTime(1000);

    expect(mockUpdateUserBetSuccess).not.toHaveBeenCalled();
  });

  it("should not check bets when no user bets", async () => {
    mockIsBetReadyToResolve.mockReturnValue(true);

    renderHookWithIntl(() => useActiveBets());

    vi.advanceTimersByTime(1000);

    expect(mockUpdateUserBetSuccess).not.toHaveBeenCalled();
  });

  it("should not update bet when not ready to resolve", async () => {
    const ongoingBet = { ...mockedBet, success: null };
    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 45000,
      userBets: [ongoingBet],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      setUserScore: mockSetUserScore,
    });
    mockIsBetReadyToResolve.mockReturnValue(false);

    renderHookWithIntl(() => useActiveBets());

    vi.advanceTimersByTime(1000);

    expect(mockUpdateUserBetSuccess).not.toHaveBeenCalled();
  });

  it("should update successful bet and score", async () => {
    const ongoingBet = { ...mockedBet, success: null };
    const updatedBets = [{ ...ongoingBet, success: true }];

    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 46000,
      userBets: [ongoingBet],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      setUserScore: mockSetUserScore,
    });
    mockIsBetReadyToResolve.mockReturnValue(true);
    mockGetBetPoints.mockReturnValue(1);
    mockShouldUpdateScore.mockReturnValue(true);
    mockUpdateUserBetSuccess.mockResolvedValue({
      error: false,
      data: updatedBets,
    });
    mockGetUserScore.mockResolvedValue({
      error: false,
      data: {
        id: "score-id",
        userId: defaultUser.id,
        score: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    renderHookWithIntl(() => useActiveBets());
    await vi.runOnlyPendingTimersAsync();

    expect(mockUpdateUserBetSuccess).toHaveBeenCalledWith(ongoingBet.id, true);
    expect(mockSetUserBets).toHaveBeenCalledWith(updatedBets);
    expect(mockGetUserScore).toHaveBeenCalledWith(defaultUser.id);
    expect(mockUpsertUserScore).toHaveBeenCalledWith(defaultUser.id, 6);
  });

  it("should update failed bet and score decrease", async () => {
    const ongoingBet = { ...mockedBet, success: null };
    const updatedBets = [{ ...ongoingBet, success: false }];

    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 44000,
      userBets: [ongoingBet],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      setUserScore: mockSetUserScore,
    });

    mockIsBetReadyToResolve.mockReturnValue(true);
    mockGetBetPoints.mockReturnValue(-1);
    mockShouldUpdateScore.mockReturnValue(true);
    mockUpdateUserBetSuccess.mockResolvedValue({
      error: false,
      data: updatedBets,
    });
    mockGetUserScore.mockResolvedValue({
      error: false,
      data: {
        id: "score-id",
        userId: defaultUser.id,
        score: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    renderHookWithIntl(() => useActiveBets());
    await vi.runOnlyPendingTimersAsync();

    expect(mockUpdateUserBetSuccess).toHaveBeenCalledWith(ongoingBet.id, false);
    expect(mockSetUserBets).toHaveBeenCalledWith(updatedBets);
    expect(mockGetUserScore).toHaveBeenCalledWith(defaultUser.id);
    expect(mockUpsertUserScore).toHaveBeenCalledWith(defaultUser.id, 2);
  });

  it("should update failed bet without score decrease if current score is 0", async () => {
    const ongoingBet = { ...mockedBet, success: null };
    const updatedBets = [{ ...ongoingBet, success: false }];

    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 44000,
      userBets: [ongoingBet],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      setUserScore: mockSetUserScore,
    });
    mockIsBetReadyToResolve.mockReturnValue(true);
    mockGetBetPoints.mockReturnValue(-1);
    mockShouldUpdateScore.mockReturnValue(false);
    mockUpdateUserBetSuccess.mockResolvedValue({
      error: false,
      data: updatedBets,
    });
    mockGetUserScore.mockResolvedValue({
      error: false,
      data: {
        id: "score-id",
        userId: defaultUser.id,
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    renderHookWithIntl(() => useActiveBets());
    await vi.runOnlyPendingTimersAsync();

    expect(mockUpdateUserBetSuccess).toHaveBeenCalledWith(ongoingBet.id, false);
    expect(mockSetUserBets).toHaveBeenCalledWith(updatedBets);
    expect(mockGetUserScore).toHaveBeenCalledWith(defaultUser.id);
    expect(mockUpsertUserScore).not.toHaveBeenCalled();
  });

  it("should handle update user bet success error", async () => {
    const ongoingBet = { ...mockedBet, success: null };

    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 46000,
      userBets: [ongoingBet],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      setUserScore: mockSetUserScore,
    });
    mockIsBetReadyToResolve.mockReturnValue(true);
    mockGetBetPoints.mockReturnValue(1);
    mockShouldUpdateScore.mockReturnValue(true);
    mockUpdateUserBetSuccess.mockResolvedValue({
      error: true,
      messageKey: "general.error",
    });

    renderHookWithIntl(() => useActiveBets());
    await vi.runOnlyPendingTimersAsync();

    expect(mockSetGeneralError).toHaveBeenCalledWith(GENERAL_ERROR);
    expect(mockGetUserScore).not.toHaveBeenCalled();
  });

  it("should handle getUserScore error gracefully", async () => {
    const ongoingBet = { ...mockedBet, success: null };
    const updatedBets = [{ ...ongoingBet, success: true }];

    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 46000,
      userBets: [ongoingBet],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      setUserScore: mockSetUserScore,
    });
    mockIsBetReadyToResolve.mockReturnValue(true);
    mockGetBetPoints.mockReturnValue(1);
    mockShouldUpdateScore.mockReturnValue(true);
    mockUpdateUserBetSuccess.mockResolvedValue({
      error: false,
      data: updatedBets,
    });
    mockGetUserScore.mockResolvedValue({
      error: true,
      messageKey: "general.error",
    });

    renderHookWithIntl(() => useActiveBets());
    await vi.runOnlyPendingTimersAsync();

    expect(mockUpdateUserBetSuccess).toHaveBeenCalledWith(ongoingBet.id, true);
    expect(mockSetUserBets).toHaveBeenCalledWith(updatedBets);
    expect(mockGetUserScore).toHaveBeenCalledWith(defaultUser.id);
    expect(mockUpsertUserScore).not.toHaveBeenCalled();
  });

  it("should clean up interval on unmount", () => {
    const ongoingBet = { ...mockedBet, success: null };
    mockUseBetStore.mockReturnValue({
      bitcoinPrice: 45000,
      userBets: [ongoingBet],
      setUserBets: mockSetUserBets,
      setBitcoinPrice: vi.fn(),
      setUserScore: mockSetUserScore,
    });

    const clearIntervalSpy = vi.spyOn(global, "clearInterval");
    const { unmount } = renderHookWithIntl(() => useActiveBets());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
