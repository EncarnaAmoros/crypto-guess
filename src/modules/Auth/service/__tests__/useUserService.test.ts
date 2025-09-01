import { describe, it, expect, beforeEach } from "vitest";
import { renderHookWithIntl } from "~/tests/test-utils";
import {
  MOCK_EXISTING_USER,
  MOCK_NEW_USER,
  mockUseUserService,
} from "~/modules/Auth/service/__tests__/database.mock";
import { REQUESTS_ERRORS } from "~/db/constants/requestsErrors";

describe("useUserService", () => {
  describe("useUserService success cases", () => {
    let useUserService: typeof import("../useUserService").default;

    beforeEach(async () => {
      useUserService = await mockUseUserService();
    });

    it("should successfully add a user", async () => {
      const { result } = renderHookWithIntl(() => useUserService());
      const response = await result.current.addUser("testuser");

      expect(response).toEqual({
        error: false,
        data: MOCK_NEW_USER,
      });
    });

    it("should successfully get a user by username", async () => {
      const { result } = renderHookWithIntl(() => useUserService());
      const response = await result.current.getUserByUsername("testuser");

      expect(response).toEqual({
        error: false,
        data: MOCK_EXISTING_USER,
      });
    });
  });

  describe("useUserService error cases", () => {
    let useUserService: typeof import("../useUserService").default;

    beforeEach(async () => {
      useUserService = await mockUseUserService({
        insertError: {
          code: REQUESTS_ERRORS.ALREADY_EXISTS,
        },
        selectError: {
          code: REQUESTS_ERRORS.NO_RESULT_FOUND,
        },
      });
    });

    it("should return an error when adding an existing user", async () => {
      const { result } = renderHookWithIntl(() => useUserService());
      const response = await result.current.addUser("testuser");

      expect(response).toEqual({
        error: true,
        message: "Username testuser already exists. Try with another username.",
      });
    });

    it("should return an error when getting a user by username that does not exist", async () => {
      const { result } = renderHookWithIntl(() => useUserService());
      const response = await result.current.getUserByUsername("testuser");

      expect(response).toEqual({
        error: true,
        message: "User testuser not found. Try with another username.",
      });
    });
  });
});
