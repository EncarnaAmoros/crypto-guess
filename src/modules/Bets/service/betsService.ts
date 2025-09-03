import { ServiceResponse } from "~/db/constants/types/requests";
import { supabase } from "~/db/dbClient";
import { CRYPTO_BET } from "~/modules/Bets/constants/bets";
import { UserBet, UserScore } from "~/modules/Bets/types/userBets";

const USER_BETS_TABLE = "user_bets";
const USER_SCORES_TABLE = "user_scores";

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
        crypto_price: cryptoPrice,
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
    data,
  };
};

export const updateUserBetSuccess = async (
  betId: string,
  success: boolean
): Promise<ServiceResponse<UserBet[]>> => {
  const { data, error } = await supabase
    .from(USER_BETS_TABLE)
    .update({ success })
    .eq("id", betId)
    .select("*");

  if (error)
    return {
      error: true,
      messageKey: "general.error",
    };

  return {
    error: false,
    data,
  };
};

export const getUserBets = async (
  userId: string
): Promise<ServiceResponse<UserBet[]>> => {
  const { data, error } = await supabase
    .from(USER_BETS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error)
    return {
      error: true,
      messageKey: "general.error",
    };

  return {
    error: false,
    data,
  };
};

export const upsertUserScore = async (
  userId: string
): Promise<ServiceResponse<UserScore>> => {
  const { data, error } = await supabase
    .from(USER_SCORES_TABLE)
    .upsert({ user_id: userId, score: 0 });

  if (error)
    return {
      error: true,
      messageKey: "general.error",
    };

  return {
    error: false,
    data: data as unknown as UserScore,
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
    data: data as UserScore,
  };
};
