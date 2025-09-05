import { screen, fireEvent } from "@testing-library/react";
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

  it("should complete betting flow (up bet) and score update successfully", async () => {
    renderWithIntl(<Home />);

    const upButton = screen.getByLabelText(mockBetUpLabel);
    const downButton = screen.getByLabelText(mockBetDownLabel);

    await vi.runOnlyPendingTimersAsync();

    expect(screen.getByText(`45,001 $`)).toBeVisible();
    expect(screen.getByText("15")).toBeVisible();
    expect(upButton).not.toBeDisabled();
    expect(downButton).not.toBeDisabled();

    fireEvent.click(upButton);
    await vi.runOnlyPendingTimersAsync();

    expect(upButton).toBeDisabled();
    expect(downButton).toBeDisabled();

    vi.advanceTimersByTime(BET_TIME);
    await vi.runOnlyPendingTimersAsync();
    expect(screen.getByText("16")).toBeVisible();
    expect(upButton).not.toBeDisabled();
    expect(downButton).not.toBeDisabled();
  });
});
