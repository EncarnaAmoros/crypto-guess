import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithRouterProvider } from "~/tests/testUtils";
import { GENERAL_ERROR } from "~/tests/constants/errorMessages";
import * as useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import GeneralLayout from "../GeneralLayout";

vi.mock("~/modules/Layout/hooks/useGeneralLayoutStore");

describe("GeneralLayout", () => {
  const mockSetGeneralError = vi.fn();
  const mockUseGeneralLayoutStore = vi.mocked(useGeneralLayoutStore.default);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render layout without error dialog when no error", () => {
    mockUseGeneralLayoutStore.mockReturnValue({
      generalError: "",
      setGeneralError: mockSetGeneralError,
    });

    renderWithRouterProvider(<GeneralLayout />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should display error dialog when generalError exists", async () => {
    mockUseGeneralLayoutStore.mockReturnValue({
      generalError: GENERAL_ERROR,
      setGeneralError: mockSetGeneralError,
    });

    renderWithRouterProvider(<GeneralLayout />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeVisible();
      expect(screen.getByText(GENERAL_ERROR)).toBeVisible();
    });
  });
});
