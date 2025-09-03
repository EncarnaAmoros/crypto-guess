import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithIntl } from "~/tests/test-utils";
import BetSection from "../BetSection";
import { mockBetDescriptionEmpty } from "./mockedData";
import { CRYPTO_BET } from "~/modules/Bets/constants/bets";
import * as useBetSection from "../useBetSection";
import * as useActiveBets from "../useActiveBets";

vi.mock("../useBetSection");
vi.mock("../useActiveBets");

const upButtonLabel = "Bet if the price will go up";
const downButtonLabel = "Bet if the price will go down";

describe("BetSection", () => {
  const mockMakeBetHandler = vi.fn();
  const mockUseBetSection = vi.mocked(useBetSection.default);
  const mockUseActiveBets = vi.mocked(useActiveBets.default);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActiveBets.mockReturnValue(undefined);
  });

  it("should render bet description", () => {
    mockUseBetSection.mockReturnValue({
      betTextDescription: mockBetDescriptionEmpty,
      currentBetOnGoing: false,
      makeBetHandler: mockMakeBetHandler,
    });

    renderWithIntl(<BetSection />);

    expect(screen.getByText(mockBetDescriptionEmpty)).toBeVisible();
  });

  it("should render UP and DOWN bet buttons labels", () => {
    mockUseBetSection.mockReturnValue({
      betTextDescription: "Test description",
      currentBetOnGoing: false,
      makeBetHandler: mockMakeBetHandler,
    });

    renderWithIntl(<BetSection />);

    expect(screen.getByLabelText(upButtonLabel)).toBeVisible();
    expect(screen.getByLabelText(downButtonLabel)).toBeVisible();
  });

  it("should enable buttons when no ongoing bet", () => {
    mockUseBetSection.mockReturnValue({
      betTextDescription: "Test description",
      currentBetOnGoing: false,
      makeBetHandler: mockMakeBetHandler,
    });

    renderWithIntl(<BetSection />);

    expect(screen.getByLabelText(upButtonLabel)).not.toBeDisabled();
    expect(screen.getByLabelText(downButtonLabel)).not.toBeDisabled();
  });

  it("should disable buttons when there is an ongoing bet", () => {
    mockUseBetSection.mockReturnValue({
      betTextDescription: "Test description",
      currentBetOnGoing: true,
      makeBetHandler: mockMakeBetHandler,
    });

    renderWithIntl(<BetSection />);

    expect(screen.getByLabelText(upButtonLabel)).toBeDisabled();
    expect(screen.getByLabelText(downButtonLabel)).toBeDisabled();
  });

  it("should call makeBetHandler with UP when UP button is clicked", async () => {
    mockUseBetSection.mockReturnValue({
      betTextDescription: "Test description",
      currentBetOnGoing: false,
      makeBetHandler: mockMakeBetHandler,
    });

    renderWithIntl(<BetSection />);

    await userEvent.click(screen.getByLabelText(upButtonLabel));

    expect(mockMakeBetHandler).toHaveBeenCalledWith(CRYPTO_BET.UP);
  });

  it("should call makeBetHandler with DOWN when DOWN button is clicked", async () => {
    mockUseBetSection.mockReturnValue({
      betTextDescription: "Test description",
      currentBetOnGoing: false,
      makeBetHandler: mockMakeBetHandler,
    });

    renderWithIntl(<BetSection />);

    await userEvent.click(screen.getByLabelText(downButtonLabel));

    expect(mockMakeBetHandler).toHaveBeenCalledWith(CRYPTO_BET.DOWN);
  });

  it("should render tooltips for bet buttons", async () => {
    mockUseBetSection.mockReturnValue({
      betTextDescription: "Test description",
      currentBetOnGoing: false,
      makeBetHandler: mockMakeBetHandler,
    });

    renderWithIntl(<BetSection />);

    await userEvent.hover(screen.getByLabelText(upButtonLabel));
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeVisible();
    });

    await userEvent.unhover(screen.getByLabelText(upButtonLabel));
    await userEvent.hover(screen.getByLabelText(downButtonLabel));

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeVisible();
    });
  });

  it("should render arrow icons in buttons", () => {
    mockUseBetSection.mockReturnValue({
      betTextDescription: "Test description",
      currentBetOnGoing: false,
      makeBetHandler: mockMakeBetHandler,
    });

    renderWithIntl(<BetSection />);

    expect(screen.getByTestId("ArrowUpwardIcon")).toBeVisible();
    expect(screen.getByTestId("ArrowDownwardIcon")).toBeVisible();
  });

  it("should call useActiveBets when component is mounted", () => {
    mockUseBetSection.mockReturnValue({
      betTextDescription: "Test description",
      currentBetOnGoing: false,
      makeBetHandler: mockMakeBetHandler,
    });

    renderWithIntl(<BetSection />);

    expect(mockUseActiveBets).toHaveBeenCalled();
  });
});
