import { screen, act, fireEvent } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterEach,
  afterAll,
  beforeEach,
  vi,
} from "vitest";
import {
  mockBetDownLabel,
  mockBetUpLabel,
  mockUser,
  betCreationTime,
} from "./__mocks__/mockedData";
import { renderWithIntl } from "~/tests/testUtils";
import * as useSessionStore from "~/modules/Auth/store/useSessionStore";
import { BET_TIME } from "~/modules/Bets/constants/bets";
import { server } from "./__mocks__/server";
import Home from "../Home";

vi.mock("~/modules/Auth/store/useSessionStore", () => ({
  default: vi.fn(() => ({
    user: {
      id: "test-user-id",
      username: "testuser",
    },
  })),
}));

describe("Home Integration Tests", () => {
  const mockUseSessionStore = vi.mocked(useSessionStore.default);

  beforeAll(() => {
    server.listen();
  });
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({
      toFake: [
        "setTimeout",
        "setInterval",
        "clearTimeout",
        "clearInterval",
        "Date",
      ],
    });
    vi.setSystemTime(betCreationTime);
    mockUseSessionStore.mockReturnValue({ user: mockUser });
  });
  afterEach(() => {
    vi.useRealTimers();
    server.resetHandlers();
  });
  afterAll(() => server.close());

  it("should complete bet flow (up bet) and score update with success", async () => {
    renderWithIntl(<Home />);

    const upButton = screen.getByLabelText(mockBetUpLabel);
    const downButton = screen.getByLabelText(mockBetDownLabel);

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });
    expect(screen.getByText(`45,001 $`)).toBeVisible();
    expect(screen.getByText("15")).toBeVisible();
    expect(upButton).not.toBeDisabled();
    expect(downButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(upButton);
      await vi.runOnlyPendingTimersAsync();
    });

    expect(upButton).toBeDisabled();
    expect(downButton).toBeDisabled();

    await act(async () => {
      vi.advanceTimersByTime(BET_TIME);
      await vi.runOnlyPendingTimersAsync();
    });

    expect(screen.getByText("16")).toBeVisible();
    expect(upButton).not.toBeDisabled();
    expect(downButton).not.toBeDisabled();
  });

  it("should complete bet flow (down bet) and score update with failure", async () => {
    renderWithIntl(<Home />);

    const upButton = screen.getByLabelText(mockBetUpLabel);
    const downButton = screen.getByLabelText(mockBetDownLabel);

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });
    expect(screen.getByText(`45,001 $`)).toBeVisible();
    expect(screen.getByText("15")).toBeVisible();
    expect(upButton).not.toBeDisabled();
    expect(downButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(downButton);
      await vi.runOnlyPendingTimersAsync();
    });

    expect(upButton).toBeDisabled();
    expect(downButton).toBeDisabled();

    await act(async () => {
      vi.advanceTimersByTime(BET_TIME);
      await vi.runOnlyPendingTimersAsync();
    });

    expect(screen.getByText("14")).toBeVisible();
    expect(upButton).not.toBeDisabled();
    expect(downButton).not.toBeDisabled();
  });
});
