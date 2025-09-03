import { describe, it, expect, beforeEach } from "vitest";
import {
  MOCK_EXISTING_USER,
  MOCK_NEW_USER,
  mockUserService,
} from "~/modules/Auth/service/__tests__/database.mock";
import { REQUESTS_ERRORS } from "~/db/constants/requestsErrors";

describe("userService", () => {
  describe("userService success cases", () => {
    let userService: Awaited<ReturnType<typeof mockUserService>>;

    beforeEach(async () => {
      userService = await mockUserService();
    });

    it("should successfully add a user", async () => {
      const response = await userService.addUser("testuser");

      expect(response).toEqual({
        error: false,
        data: MOCK_NEW_USER,
      });
    });

    it("should successfully get a user by username", async () => {
      const response = await userService.getUserByUsername("testuser");

      expect(response).toEqual({
        error: false,
        data: MOCK_EXISTING_USER,
      });
    });
  });

  describe("userService error cases", () => {
    let userService: Awaited<ReturnType<typeof mockUserService>>;

    beforeEach(async () => {
      userService = await mockUserService({
        insertError: {
          code: REQUESTS_ERRORS.ALREADY_EXISTS,
        },
        selectError: {
          code: REQUESTS_ERRORS.NO_RESULT_FOUND,
        },
      });
    });

    it("should return an error when adding an existing user", async () => {
      const response = await userService.addUser("testuser");

      expect(response).toEqual({
        error: true,
        messageKey: "user.already.exists",
      });
    });

    it("should return an error when getting a user by username that does not exist", async () => {
      const response = await userService.getUserByUsername("testuser");

      expect(response).toEqual({
        error: true,
        messageKey: "user.not.found",
      });
    });
  });
});
