import { UserBet } from "../types/userBets";
import { BET_TIME, CRYPTO_BET, BET_RESULT } from "../constants/bets";

export const isBetReadyToResolve = (bet: UserBet) => {
  const currentTime = new Date();
  const betCreationTime = new Date(bet.createdAt);

  const timeDifference = currentTime.getTime() - betCreationTime.getTime();
  const oneMinuteInMs = BET_TIME;

  return timeDifference >= oneMinuteInMs;
};

export const getUserBetUpdatedResult = (
  bet: UserBet,
  currentCryptoPrice: number
): UserBet => {
  const betWithCryptoEndPrice = {
    ...bet,
    cryptoEndPrice: currentCryptoPrice,
  };

  if (bet.cryptoStartPrice === currentCryptoPrice)
    return { ...betWithCryptoEndPrice, result: BET_RESULT.TIE };

  if (bet.bet === CRYPTO_BET.UP) {
    return {
      ...betWithCryptoEndPrice,
      result:
        currentCryptoPrice > bet.cryptoStartPrice
          ? BET_RESULT.SUCCESS
          : BET_RESULT.FAILURE,
    };
  }

  return {
    ...betWithCryptoEndPrice,
    result:
      currentCryptoPrice < bet.cryptoStartPrice
        ? BET_RESULT.SUCCESS
        : BET_RESULT.FAILURE,
  };
};

export const getBetPoints = (bet: UserBet) => {
  if (!bet.result || bet.result === BET_RESULT.TIE) return 0;

  return bet.result === BET_RESULT.SUCCESS ? 1 : -1;
};

export const shouldUpdateScore = (betPoints: number, currentScore: number) =>
  betPoints !== 0 && !(currentScore === 0 && betPoints < 0);
