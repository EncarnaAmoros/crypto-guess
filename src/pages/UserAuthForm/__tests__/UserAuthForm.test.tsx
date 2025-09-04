import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "~/tests/testUtils";
import UserAuthForm from "../UserAuthForm";
import { AUTH_FORM_TYPES } from "~/modules/Auth/types/authForm";
import useUserAuthForm from "~/pages/UserAuthForm/useUserAuthForm";

const mockHandleFormSubmit = vi.fn();
const mockHandleToggleChange = vi.fn();

vi.mock("../useUserAuthForm", () => ({
  default: vi.fn(() => ({
    username: "",
    authFormError: "",
    authFormType: AUTH_FORM_TYPES.SIGNIN,
    setUsername: vi.fn(),
    setAuthFormError: vi.fn(),
    handleToggleChange: mockHandleToggleChange,
    handleFormSubmit: mockHandleFormSubmit,
  })),
}));

vi.mock("~/modules/Auth/store/useSessionStore", () => ({
  default: () => ({
    setSession: vi.fn(),
  }),
}));

vi.mock("~/modules/Auth/service/useUserService", () => ({
  default: () => ({
    addUser: vi.fn(),
    getUserByUsername: vi.fn(),
  }),
}));

describe("UserAuthForm", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("should render login form by default", () => {
    renderWithIntl(<UserAuthForm />);

    expect(screen.getByLabelText("Username")).toBeVisible();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  it("should render toggle buttons for login and signup", () => {
    renderWithIntl(<UserAuthForm />);

    expect(screen.getByRole("button", { name: "signin" })).toBeVisible();
    expect(screen.getByRole("button", { name: "signup" })).toBeVisible();
  });

  it("should render username input field", () => {
    renderWithIntl(<UserAuthForm />);

    const usernameInput = screen.getByLabelText("Username");
    expect(usernameInput).toBeVisible();
    expect(usernameInput).toHaveAttribute("type", "text");
  });

  it("should call toggle function when sign up button is clicked", async () => {
    renderWithIntl(<UserAuthForm />);

    await userEvent.click(screen.getByRole("button", { name: "signup" }));
    await waitFor(() => expect(mockHandleToggleChange).toHaveBeenCalled());
  });

  it("should call handleFormSubmit when submit button is clicked", async () => {
    (useUserAuthForm as unknown as Mock).mockImplementationOnce(() => ({
      username: "userName1",
      authFormError: "",
      authFormType: AUTH_FORM_TYPES.SIGNIN,
      setUsername: vi.fn(),
      setAuthFormError: vi.fn(),
      handleToggleChange: vi.fn(),
      handleFormSubmit: mockHandleFormSubmit,
    }));

    renderWithIntl(<UserAuthForm />);

    const submitButton = screen.getByRole("button", { name: "Sign in" });
    await waitFor(() => expect(submitButton).toBeEnabled());
    await userEvent.click(submitButton);

    await waitFor(() => expect(mockHandleFormSubmit).toHaveBeenCalled());
  });

  it("should have submit button disabled when username is empty", async () => {
    renderWithIntl(<UserAuthForm />);

    const submitButton = screen.getByRole("button", { name: "Sign in" });
    expect(submitButton).toBeDisabled();
  });

  it("should render sign up form when form type signup is selected", () => {
    (useUserAuthForm as unknown as Mock).mockImplementationOnce(() => ({
      username: "",
      authFormError: "",
      authFormType: AUTH_FORM_TYPES.SIGNUP,
      setUsername: vi.fn(),
      setAuthFormError: vi.fn(),
      handleToggleChange: vi.fn(),
      handleFormSubmit: vi.fn(),
    }));

    renderWithIntl(<UserAuthForm />);

    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });
    expect(submitButton).toBeInTheDocument();
  });

  it("should not show InfoDialog when there is no error", async () => {
    (useUserAuthForm as unknown as Mock).mockImplementationOnce(() => ({
      username: "",
      authFormError: "User already exists, try with another username",
      authFormType: AUTH_FORM_TYPES.SIGNUP,
      setUsername: vi.fn(),
      setAuthFormError: vi.fn(),
      handleToggleChange: vi.fn(),
      handleFormSubmit: vi.fn(),
    }));

    renderWithIntl(<UserAuthForm />);

    await waitFor(() =>
      expect(
        screen.getByText(/user already exists, try with another username/i)
      ).toBeVisible()
    );
  });
});
