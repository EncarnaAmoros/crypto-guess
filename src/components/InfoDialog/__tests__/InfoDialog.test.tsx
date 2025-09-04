import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithIntl } from "~/tests/testUtils";
import InfoDialog from "../InfoDialog";

describe("InfoDialog", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    message: "Test message",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render dialog when open is true", async () => {
    renderWithIntl(<InfoDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeVisible();
      expect(screen.getByText("Test message")).toBeVisible();
    });
  });

  it("should not render dialog when open is false", () => {
    renderWithIntl(<InfoDialog {...defaultProps} open={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should display the message content", async () => {
    const message = "This is a test error message";
    renderWithIntl(<InfoDialog {...defaultProps} message={message} />);

    await waitFor(() => expect(screen.getByText(message)).toBeVisible());
  });

  it("should display title when provided", async () => {
    const title = "Error Title";
    renderWithIntl(<InfoDialog {...defaultProps} title={title} />);

    await waitFor(() => {
      expect(screen.getByText(title)).toBeVisible();
      expect(screen.getByRole("heading", { name: title })).toBeVisible();
    });
  });

  it("should not display title when not provided", async () => {
    renderWithIntl(<InfoDialog {...defaultProps} />);

    await waitFor(() =>
      expect(screen.queryByRole("heading")).not.toBeInTheDocument()
    );
  });

  it("should render accept button", async () => {
    renderWithIntl(<InfoDialog {...defaultProps} />);

    const acceptButton = screen.getByRole("button", { name: /accept/i });
    await waitFor(() => expect(acceptButton).toBeVisible());
  });

  it("should call onClose when accept button is clicked", async () => {
    const onCloseMock = vi.fn();
    renderWithIntl(<InfoDialog {...defaultProps} onClose={onCloseMock} />);

    const acceptButton = screen.getByRole("button", { name: /accept/i });
    await userEvent.click(acceptButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when dialog backdrop is clicked", async () => {
    const onCloseMock = vi.fn();
    renderWithIntl(<InfoDialog {...defaultProps} onClose={onCloseMock} />);

    const dialog = screen.getByRole("dialog");
    await userEvent.click(dialog.parentElement!);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should maintain focus on accept button", async () => {
    renderWithIntl(<InfoDialog {...defaultProps} />);

    const acceptButton = screen.getByRole("button", { name: /accept/i });
    await waitFor(() => expect(acceptButton).toHaveFocus());
  });
});
