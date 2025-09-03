import { supabase } from "~/db/dbClient";
import { User } from "~/modules/Auth/types/session";
import { REQUESTS_ERRORS } from "~/db/constants/requestsErrors";
import { ServiceResponse } from "~/db/constants/types/requests";

const USER_TABLE = "users";

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
    data,
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
        data,
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
    data,
  };
};
