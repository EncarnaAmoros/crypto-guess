import { useIntl } from "react-intl";
import { supabase } from "~/db/dbClient";
import { User } from "~/modules/Auth/types/session";
import { REQUESTS_ERRORS } from "~/db/constants/requestsErrors";
import { ServiceResponse } from "~/db/constants/types/requests";

const useUserService = () => {
  const intl = useIntl();

  const addUser = async (username: string): Promise<ServiceResponse<User>> => {
    const { data, error } = await supabase
      .from("users")
      .insert([{ username }])
      .select()
      .single();

    if (error) {
      return {
        error: true,
        message:
          error.code === REQUESTS_ERRORS.ALREADY_EXISTS
            ? intl.formatMessage({ id: "user.already.exists" })
            : intl.formatMessage({ id: "general.error" }),
      };
    }

    return {
      error: false,
      data,
    };
  };

  const getUserById = async (id: string): Promise<ServiceResponse<User>> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    return error
      ? {
          error: true,
          message: intl.formatMessage({ id: "general.error" }),
        }
      : {
          error: false,
          data,
        };
  };

  const getUserByUsername = async (
    username: string
  ): Promise<ServiceResponse<User>> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    return error
      ? {
          error: true,
          message: intl.formatMessage({ id: "general.error" }),
        }
      : {
          error: false,
          data,
        };
  };

  return {
    addUser,
    getUserById,
    getUserByUsername,
  };
};

export default useUserService;
