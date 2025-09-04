import { vi } from "vitest";
import { User } from "~/modules/Auth/types/session";

export const MOCK_NEW_USER = { id: "2", username: "testuser" };
export const MOCK_EXISTING_USER = { id: "1", username: "testuser" };

export const createSupabaseMock = (options?: {
  newUser?: User;
  existingUser?: User;
  insertError?: { code: string };
  selectError?: { code: string };
}) => {
  const mockNewUser = options?.newUser ?? MOCK_NEW_USER;
  const mockExistingUser = options?.existingUser ?? MOCK_EXISTING_USER;

  return {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: options?.insertError ? null : mockNewUser,
            error: options?.insertError ?? false,
          }),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: options?.selectError ? null : mockExistingUser,
            error: options?.selectError ?? false,
          }),
        })),
      })),
    })),
  };
};

export const mockUserService = async (
  mockOptions?: Parameters<
    typeof import("./database.mock").createSupabaseMock
  >[0]
) => {
  vi.resetModules();
  vi.clearAllMocks();

  vi.doMock("~/services/dbClient", async () => {
    const { createSupabaseMock } = await import("./database.mock");
    return { supabase: createSupabaseMock(mockOptions) };
  });

  return await import("../userService");
};
