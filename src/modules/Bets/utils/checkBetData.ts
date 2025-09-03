import { UserBet } from "../types/userBets";
import { BET_TIME, CRYPTO_BET } from "../constants/bets";

export const isBetReadyToResolve = (bet: UserBet) => {
  const currentTime = new Date();
  const betCreationTime = new Date(bet.createdAt);

  const timeDifference = currentTime.getTime() - betCreationTime.getTime();
  const oneMinuteInMs = BET_TIME;

  return timeDifference >= oneMinuteInMs;
};

export const wasBetSuccess = (bet: UserBet, currentCryptoPrice: number) => {
  return bet.bet === CRYPTO_BET.UP
    ? currentCryptoPrice > bet.cryptoPrice
    : currentCryptoPrice < bet.cryptoPrice;
};
