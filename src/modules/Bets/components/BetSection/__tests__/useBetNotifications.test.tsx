import { act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHookWithIntl } from "~/tests/testUtils";
import useBetNotifications from "../hooks/useBetNotifications";
import { NOTIFICATION_SEVERITY } from "~/modules/Layout/constants/notifications";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";

vi.mock("~/modules/Layout/hooks/useGeneralLayoutStore", () => ({
  default: vi.fn(),
}));

const EXPECTED_MESSAGES = {
  SUCCESS: "Well played! +1 point  🚀",
  ERROR: "Oops, -1 point  😵",
  INFO: "Price stays the same… so does your score! 🤝",
} as const;

const mockSetNotification = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useGeneralLayoutStore).mockReturnValue(mockSetNotification);
});

describe("useBetNotifications", () => {
  it("should call setNotification with success message for positive points", () => {
    const { result } = renderHookWithIntl(() => useBetNotifications());

    act(() => {
      result.current.notifyScoreChange(5);
    });

    expect(mockSetNotification).toHaveBeenCalledWith({
      message: EXPECTED_MESSAGES.SUCCESS,
      severity: NOTIFICATION_SEVERITY.SUCCESS,
    });
  });

  it("should call setNotification with error message for negative points", () => {
    const { result } = renderHookWithIntl(() => useBetNotifications());

    act(() => {
      result.current.notifyScoreChange(-3);
    });

    expect(mockSetNotification).toHaveBeenCalledWith({
      message: EXPECTED_MESSAGES.ERROR,
      severity: NOTIFICATION_SEVERITY.ERROR,
    });
  });

  it("should call setNotification with info message for zero points", () => {
    const { result } = renderHookWithIntl(() => useBetNotifications());

    act(() => {
      result.current.notifyScoreChange(0);
    });

    expect(mockSetNotification).toHaveBeenCalledWith({
      message: EXPECTED_MESSAGES.INFO,
      severity: NOTIFICATION_SEVERITY.INFO,
    });
  });

  it("should call setNotification only once per invocation", () => {
    const { result } = renderHookWithIntl(() => useBetNotifications());

    act(() => {
      result.current.notifyScoreChange(1);
    });

    expect(mockSetNotification).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple consecutive calls correctly", () => {
    const { result } = renderHookWithIntl(() => useBetNotifications());

    act(() => {
      result.current.notifyScoreChange(1);
      result.current.notifyScoreChange(-1);
      result.current.notifyScoreChange(0);
    });

    expect(mockSetNotification).toHaveBeenCalledTimes(3);
    expect(mockSetNotification).toHaveBeenNthCalledWith(1, {
      message: EXPECTED_MESSAGES.SUCCESS,
      severity: NOTIFICATION_SEVERITY.SUCCESS,
    });
    expect(mockSetNotification).toHaveBeenNthCalledWith(2, {
      message: EXPECTED_MESSAGES.ERROR,
      severity: NOTIFICATION_SEVERITY.ERROR,
    });
    expect(mockSetNotification).toHaveBeenNthCalledWith(3, {
      message: EXPECTED_MESSAGES.INFO,
      severity: NOTIFICATION_SEVERITY.INFO,
    });
  });
});
