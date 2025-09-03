import { CRYPTO_BET } from "../constants/bets";

export interface UserBet {
  id: string;
  userId: string;
  bet: CRYPTO_BET;
  cryptoPrice: number;
  success: boolean;
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
