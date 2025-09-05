import { screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BitcoinPrice from "../BitcoinPrice";
import * as useBetStore from "~/modules/Bets/store/useBetStore";
import * as useBTCPrice from "~/modules/Bets/service/useCryptoStream";
import { renderWithIntl } from "~/tests/testUtils";

vi.mock("~/modules/Bets/store/useBetStore");
vi.mock("~/modules/Bets/service/useCryptoStream");

describe("BitcoinPrice", () => {
  const mockUseBetStore = vi.mocked(useBetStore.default);
  const mockUseBTCPrice = vi.mocked(useBTCPrice.default);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBTCPrice.mockReturnValue(undefined);
  });

  it("should render loading state when bitcoin price is 0", () => {
    mockUseBetStore.mockReturnValue(0);

    renderWithIntl(<BitcoinPrice />);

    expect(screen.getByRole("progressbar")).toBeVisible();
  });

  it("should render bitcoin price when loaded", () => {
    mockUseBetStore.mockReturnValue(45000);

    renderWithIntl(<BitcoinPrice />);

    expect(screen.getByText("Bitcoin:")).toBeVisible();
    expect(screen.getByText("45,000 $")).toBeVisible();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("should render decimal bitcoin price", () => {
    mockUseBetStore.mockReturnValue(45000.99);

    renderWithIntl(<BitcoinPrice />);

    expect(screen.getByText("45,000.99 $")).toBeVisible();
  });

  it("should call useBTCPrice hook to fetch data", () => {
    mockUseBetStore.mockReturnValue(50000);

    renderWithIntl(<BitcoinPrice />);

    expect(mockUseBTCPrice).toHaveBeenCalled();
  });
});
