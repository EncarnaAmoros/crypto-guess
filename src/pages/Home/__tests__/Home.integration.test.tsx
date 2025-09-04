import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  mockBitcoinPrice,
  mockBetDownLabel,
  mockBetUpLabel,
  mockUser,
} from "./__mocks__/mockedData";
import { renderWithIntl } from "~/tests/testUtils";
import { server } from "./__mocks__/server";
import * as useSessionStore from "~/modules/Auth/store/useSessionStore";
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
      toFake: ["setTimeout", "setInterval", "clearTimeout", "clearInterval"],
    });
    mockUseSessionStore.mockReturnValue({ user: mockUser });
  });
  afterEach(() => {
    vi.useRealTimers();
    server.resetHandlers();
  });
  afterAll(() => server.close());

  it.skip("should complete betting flow (up bet) and score update successfully", async () => {
    const user = userEvent.setup();
    renderWithIntl(<Home />);

    const upButton = screen.getByLabelText(mockBetUpLabel);
    const downButton = screen.getByLabelText(mockBetDownLabel);

    await vi.runOnlyPendingTimersAsync();

    expect(
      screen.getByText(`Bitcoin: ${mockBitcoinPrice + 1} $`)
    ).toBeVisible();
    expect(screen.getByText("Score: 15")).toBeVisible();
    expect(upButton).not.toBeDisabled();
    expect(downButton).not.toBeDisabled();

    act(async () => {
      await user.click(upButton);
      expect(upButton).toBeDisabled();
      expect(downButton).toBeDisabled();
    });
    await vi.runOnlyPendingTimersAsync();
    expect(upButton).not.toBeDisabled();
    expect(downButton).not.toBeDisabled();

    expect(screen.getByText("Score: 16")).toBeVisible();
  });
});
