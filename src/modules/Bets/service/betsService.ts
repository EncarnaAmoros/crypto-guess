import { ServiceResponse } from "~/services/types/requests";
import { supabase } from "~/services/dbClient";
import { CRYPTO_BET, BET_SORT_FIELD } from "~/modules/Bets/constants/bets";
import { UserBet, UserScore } from "~/modules/Bets/types/userBets";
import {
  deepConvertToCamelCase,
  deepConvertToSnakeCase,
} from "~/services/utils/dataConverter";
import {
  SORT_ORDER,
  USER_BETS_TABLE,
  USER_SCORES_TABLE,
  BASIC_SORT_FIELD,
} from "~/services/constants/dbService";

export const createUserBet = async (
  userId: string,
  bet: CRYPTO_BET,
  cryptoPrice: number
): Promise<ServiceResponse<UserBet[]>> => {
  const { data, error } = await supabase
    .from(USER_BETS_TABLE)
    .insert([
      {
        user_id: userId,
        bet,
        crypto_start_price: cryptoPrice,
      },
    ])
    .select("*");

  if (error)
    return {
      error: true,
      messageKey: "general.error",
    };
  return {
    error: false,
    data: deepConvertToCamelCase(data),
  };
};

export const updateUserBet = async (
  betId: string,
  updatedBet: UserBet
): Promise<ServiceResponse<UserBet>> => {
  const { data, error } = await supabase
    .from(USER_BETS_TABLE)
    .update(deepConvertToSnakeCase(updatedBet))
    .eq("id", betId)
    .select("*")
    .single();

  if (error)
    return {
      error: true,
      messageKey: "general.error",
    };

  return {
    error: false,
    data: deepConvertToCamelCase(data),
  };
};

export const getUserBets = async (
  userId: string,
  sortField?: BASIC_SORT_FIELD | BET_SORT_FIELD,
  sortOrder?: SORT_ORDER
): Promise<ServiceResponse<UserBet[]>> => {
  let query = supabase.from(USER_BETS_TABLE).select("*").eq("user_id", userId);

  if (sortField) {
    const ascending = sortOrder === "asc";
    query = query.order(sortField, { ascending });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error)
    return {
      error: true,
      messageKey: "general.error",
    };

  return {
    error: false,
    data: deepConvertToCamelCase(data),
  };
};

export const upsertUserScore = async (
  userId: string,
  score: number
): Promise<ServiceResponse<UserScore>> => {
  const { data, error } = await supabase
    .from(USER_SCORES_TABLE)
    .upsert({ user_id: userId, score }, { onConflict: "user_id" })
    .select()
    .single();

  if (error)
    return {
      error: true,
      messageKey: "general.error",
    };

  return {
    error: false,
    data: deepConvertToCamelCase(data as unknown as UserScore),
  };
};

export const getUserScore = async (
  userId: string
): Promise<ServiceResponse<UserScore>> => {
  const { data, error } = await supabase
    .from(USER_SCORES_TABLE)
    .select("score")
    .eq("user_id", userId)
    .single();

  if (error)
    return {
      error: true,
      messageKey: "general.error",
    };

  return {
    error: false,
    data: deepConvertToCamelCase(data as UserScore),
  };
};
