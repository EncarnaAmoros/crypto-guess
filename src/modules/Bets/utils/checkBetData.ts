import { UserBet } from "../types/userBets";
import { BET_TIME, CRYPTO_BET } from "../constants/bets";

export const isBetReadyToResolve = (bet: UserBet) => {
  const currentTime = new Date();
  const betCreationTime = new Date(bet.createdAt);

  const timeDifference = currentTime.getTime() - betCreationTime.getTime();
  const oneMinuteInMs = BET_TIME;

  return timeDifference >= oneMinuteInMs;
};

export const getBetPoints = (bet: UserBet, currentCryptoPrice: number) => {
  if (bet.cryptoPrice === currentCryptoPrice) return 0;

  if (bet.bet === CRYPTO_BET.UP) {
    return currentCryptoPrice > bet.cryptoPrice ? 1 : -1;
  }

  return currentCryptoPrice < bet.cryptoPrice ? 1 : -1;
};

export const shouldUpdateScore = (betPoints: number, currentScore: number) =>
  betPoints !== 0 && !(currentScore === 0 && betPoints < 0);
