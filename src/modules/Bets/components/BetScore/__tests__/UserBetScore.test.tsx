import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithIntl } from "~/tests/testUtils";
import { GENERAL_ERROR } from "~/tests/constants/errorMessages";
import { UserScore } from "~/modules/Bets/types/userBets";
import UserBetScore from "../UserBetScore";
import * as betsService from "~/modules/Bets/service/betsService";
import * as useSessionStore from "~/modules/Auth/store/useSessionStore";
import * as useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import * as useBetStore from "~/modules/Bets/store/useBetStore";

vi.mock("~/modules/Bets/service/betsService");
vi.mock("~/modules/Auth/store/useSessionStore");
vi.mock("~/modules/Layout/hooks/useGeneralLayoutStore");
vi.mock("~/modules/Bets/store/useBetStore");

const userDefaultScore: UserScore = {
  id: "score-id",
  userId: "test-user-id",
  score: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const defaultUser = {
  id: "test-user-id",
  username: "testuser",
};

describe("UserBetScore", () => {
  const mockSetGeneralError = vi.fn();
  const mockSetUserScore = vi.fn();
  const mockGetUserScore = vi.mocked(betsService.getUserScore);
  const mockUseSessionStore = vi.mocked(useSessionStore.default);
  const mockUseGeneralLayoutStore = vi.mocked(useGeneralLayoutStore.default);
  const mockUseBetStore = vi.mocked(useBetStore.default);

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseGeneralLayoutStore.mockReturnValue(mockSetGeneralError);
    mockUseSessionStore.mockReturnValue({
      user: defaultUser,
    });
    mockUseBetStore.mockReturnValue({
      userScore: defaultUser,
      setUserScore: mockSetUserScore,
    });
  });

  it("should render loading state initially", () => {
    mockGetUserScore.mockReturnValue(new Promise(() => {}));

    renderWithIntl(<UserBetScore />);

    expect(screen.getByText("Score:")).toBeVisible();
    expect(screen.getByRole("progressbar")).toBeVisible();
    expect(screen.getByTestId("loader")).toBeVisible();
  });

  it("should render user score when loaded successfully", async () => {
    mockGetUserScore.mockResolvedValue({
      error: false,
      data: { ...userDefaultScore, score: 15 },
    });
    mockUseBetStore.mockReturnValue({
      userScore: { ...userDefaultScore, score: 15 },
      setUserScore: mockSetUserScore,
    });

    renderWithIntl(<UserBetScore />);
    expect(screen.getByTestId("loader")).toBeVisible();

    await waitFor(() => {
      expect(screen.getByText("Score:")).toBeVisible();
      expect(screen.getByText("15")).toBeVisible();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  it("should render '-' when score is null", async () => {
    mockGetUserScore.mockResolvedValue({
      error: true,
      messageKey: "general.error",
    });

    renderWithIntl(<UserBetScore />);

    await waitFor(() => {
      expect(screen.getByText("Score:")).toBeVisible();
      expect(screen.getByText("-")).toBeVisible();
    });
  });

  it("should display zero score and not '-'", async () => {
    mockGetUserScore.mockResolvedValue({
      error: false,
      data: { ...userDefaultScore, score: 0 },
    });
    mockUseBetStore.mockReturnValue({
      userScore: { ...userDefaultScore, score: 0 },
      setUserScore: mockSetUserScore,
    });

    renderWithIntl(<UserBetScore />);

    await waitFor(() => {
      expect(screen.getByText("Score:")).toBeVisible();
      expect(screen.getByText("0")).toBeVisible();
    });
  });

  it("should handle API error and set general error", async () => {
    mockGetUserScore.mockResolvedValue({
      error: true,
      messageKey: "general.error",
    });

    renderWithIntl(<UserBetScore />);

    await waitFor(() => {
      expect(mockSetGeneralError).toHaveBeenCalledWith(GENERAL_ERROR);
    });
  });

  it("should not fetch score when user id is missing", () => {
    mockUseSessionStore.mockReturnValue({
      session: {
        user: {
          id: "",
          username: "testuser",
        },
      },
    });

    renderWithIntl(<UserBetScore />);

    expect(mockGetUserScore).not.toHaveBeenCalled();
  });

  it("should call getUserScore with correct user id", async () => {
    mockGetUserScore.mockResolvedValue({
      error: false,
      data: { ...userDefaultScore },
    });
    renderWithIntl(<UserBetScore />);

    await waitFor(() => {
      expect(mockGetUserScore).toHaveBeenCalledWith(defaultUser.id);
    });
  });
});
