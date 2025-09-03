import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithIntl } from "~/tests/test-utils";
import { GENERAL_ERROR } from "~/tests/constants/errorMessages";
import { UserScore } from "~/modules/Bets/types/userBets";
import UserBetScore from "../UserBetScore";
import * as betsService from "~/modules/Bets/service/betsService";
import * as useSessionStore from "~/modules/Auth/store/useSessionStore";
import * as useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";

vi.mock("~/modules/Bets/service/betsService");
vi.mock("~/modules/Auth/store/useSessionStore");
vi.mock("~/modules/Layout/hooks/useGeneralLayoutStore");

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
  const mockGetUserScore = vi.mocked(betsService.getUserScore);
  const mockUseSessionStore = vi.mocked(useSessionStore.default);
  const mockUseGeneralLayoutStore = vi.mocked(useGeneralLayoutStore.default);

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseGeneralLayoutStore.mockReturnValue(mockSetGeneralError);
    mockUseSessionStore.mockReturnValue({
      user: defaultUser,
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

    renderWithIntl(<UserBetScore />);
    expect(screen.getByTestId("loader")).toBeVisible();

    await waitFor(() => {
      expect(screen.getByText("Score: 15")).toBeVisible();
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
      expect(screen.getByText("Score: -")).toBeVisible();
    });
  });

  it("should display zero score and not '-'", async () => {
    mockGetUserScore.mockResolvedValue({
      error: false,
      data: { ...userDefaultScore, score: 0 },
    });

    renderWithIntl(<UserBetScore />);

    await waitFor(() => {
      expect(screen.getByText("Score: 0")).toBeVisible();
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

  it("should render SportsScore icon", async () => {
    mockGetUserScore.mockResolvedValue({
      error: false,
      data: { ...userDefaultScore },
    });

    renderWithIntl(<UserBetScore />);

    await waitFor(() => {
      const sportsIcon = screen.getByTestId("SportsScoreIcon");
      expect(sportsIcon).toBeVisible();
    });
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
