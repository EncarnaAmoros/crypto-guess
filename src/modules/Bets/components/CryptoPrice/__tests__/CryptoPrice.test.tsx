import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithIntl } from "~/tests/testUtils";
import CryptoPrice from "../CryptoPrice";
import { CURRENCY } from "~/modules/Bets/types/currency";

describe("CryptoPrice", () => {
  const defaultProps = {
    cryptoName: "Bitcoin",
    price: 45000,
    currency: CURRENCY.USD,
    loading: false,
  };

  it("should render loading state with CircularProgress", () => {
    renderWithIntl(<CryptoPrice {...defaultProps} loading={true} />);

    expect(screen.getByRole("progressbar")).toBeVisible();
  });

  it("should render crypto name, price and currency when not loading", () => {
    renderWithIntl(<CryptoPrice {...defaultProps} />);

    expect(screen.getByText("Bitcoin: 45000 $")).toBeVisible();
  });

  it("should render with EUR currency", () => {
    renderWithIntl(
      <CryptoPrice {...defaultProps} currency={CURRENCY.EUR} price={38000} />
    );

    expect(screen.getByText("Bitcoin: 38000 €")).toBeVisible();
  });

  it("should render with different crypto name", () => {
    renderWithIntl(
      <CryptoPrice {...defaultProps} cryptoName="Ethereum" price={3000} />
    );

    expect(screen.getByText("Ethereum: 3000 $")).toBeVisible();
  });

  it("should render Bitcoin icon", () => {
    renderWithIntl(<CryptoPrice {...defaultProps} />);

    const bitcoinIcon = screen.getByTestId("CurrencyBitcoinIcon");
    expect(bitcoinIcon).toBeVisible();
  });

  it("should handle zero price", () => {
    renderWithIntl(<CryptoPrice {...defaultProps} price={0} />);

    expect(screen.getByText("Bitcoin: 0 $")).toBeVisible();
  });

  it("should handle decimal prices", () => {
    renderWithIntl(<CryptoPrice {...defaultProps} price={45000.99} />);

    expect(screen.getByText("Bitcoin: 45000.99 $")).toBeVisible();
  });
});
