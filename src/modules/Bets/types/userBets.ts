import { CRYPTO_BET, BET_RESULT } from "../constants/bets";

export interface UserBet {
  id: string;
  userId: string;
  bet: CRYPTO_BET;
  cryptoStartPrice: number;
  cryptoEndPrice: number | null;
  result: BET_RESULT | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserScore {
  id: string;
  userId: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}
