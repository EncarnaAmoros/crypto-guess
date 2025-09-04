import { supabase } from "~/services/dbClient";
import { User } from "~/modules/Auth/types/session";
import { REQUESTS_ERRORS } from "~/services/constants/requestsErrors";
import { ServiceResponse } from "~/services/types/requests";
import { deepConvertToCamelCase } from "~/services/utils/dataConverter";
import { USER_TABLE } from "~/services/constants/dbService";

export const addUser = async (
  username: string
): Promise<ServiceResponse<User>> => {
  const { data, error } = await supabase
    .from(USER_TABLE)
    .insert([{ username }])
    .select()
    .single();

  if (error) {
    return {
      error: true,
      messageKey:
        error.code === REQUESTS_ERRORS.ALREADY_EXISTS
          ? "user.already.exists"
          : "general.error",
    };
  }

  return {
    error: false,
    data: deepConvertToCamelCase(data as unknown as User),
  };
};

export const getUserById = async (
  id: string
): Promise<ServiceResponse<User>> => {
  const { data, error } = await supabase
    .from(USER_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  return error
    ? {
        error: true,
        messageKey: "general.error",
      }
    : {
        error: false,
        data: deepConvertToCamelCase(data as unknown as User),
      };
};

export const getUserByUsername = async (
  username: string
): Promise<ServiceResponse<User>> => {
  const { data, error } = await supabase
    .from(USER_TABLE)
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    return {
      error: true,
      messageKey:
        error.code === REQUESTS_ERRORS.NO_RESULT_FOUND
          ? "user.not.found"
          : "general.error",
    };
  }

  return {
    error: false,
    data: deepConvertToCamelCase(data as unknown as User),
  };
};
