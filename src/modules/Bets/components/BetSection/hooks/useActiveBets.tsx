import { useEffect, useCallback, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { UserBet } from "~/modules/Bets/types/userBets";
import useBetNotifications from "./useBetNotifications";
import { useErrorHandler } from "~/modules/Layout/hooks/useErrorHandler";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import useBetStore from "~/modules/Bets/store/useBetStore";
import {
  getUserBetUpdatedResult,
  isBetReadyToResolve,
  shouldUpdateScore,
  getBetPoints,
} from "~/modules/Bets/utils/checkBetData";
import {
  getUserScore,
  updateUserBet,
  upsertUserScore,
} from "~/modules/Bets/service/betsService";

// If there is an ongoing bet, check every second the bet result
// When the bet is resolved, update the bet and score
const useActiveBets = (intervalMs = 1000) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [hasError, setHasError] = useState(false);
  const session = useSessionStore((state) => state.session);
  const { notifyBetResult } = useBetNotifications();
  const { handleError } = useErrorHandler();

  const { bitcoinPrice, userBets, setUserScore, updateOnGoingBet } =
    useBetStore(
      useShallow((state) => ({
        bitcoinPrice: state.bitcoinPrice,
        userBets: state.userBets,
        setUserScore: state.setUserScore,
        updateOnGoingBet: state.updateOnGoingBet,
      }))
    );

  const hasOngoingBet = !!userBets?.find((bet) => !bet.result);

  const updateScore = useCallback(
    async (betPoints: number) => {
      if (!session?.user?.id) return;

      const response = await getUserScore(session?.user?.id);
      if (response.error) return;

      if (shouldUpdateScore(betPoints, response.data.score)) {
        const newScore = response.data.score + betPoints;
        const newScoreResponse = await upsertUserScore(
          session?.user?.id,
          newScore
        );
        if (newScoreResponse.error)
          return handleError(newScoreResponse.messageKey);

        setUserScore(newScoreResponse.data);
      }
      notifyBetResult(betPoints);
    },
    [session?.user?.id, handleError, setUserScore, notifyBetResult]
  );

  const updateBetAndScore = useCallback(
    async (ongoingBet: UserBet, bitcoinPrice: number) => {
      if (!session?.user?.id) return;

      const updatedBet = getUserBetUpdatedResult(ongoingBet, bitcoinPrice);
      const updateResponse = await updateUserBet(updatedBet.id, updatedBet);

      if (updateResponse.error) {
        handleError(updateResponse.messageKey);
        setHasError(true);
        return;
      }

      updateOnGoingBet(updateResponse.data);
      updateScore(getBetPoints(updatedBet));
    },
    [session?.user?.id, handleError, updateOnGoingBet, updateScore]
  );

  const checkAndUpdateOnGoingBets = useCallback(async () => {
    if (!session?.user?.id || !userBets.length || hasError) return;

    const ongoingBet = userBets.find((bet) => !bet.result);
    if (!ongoingBet) return;

    if (!isBetReadyToResolve(ongoingBet)) return;

    updateBetAndScore(ongoingBet, bitcoinPrice);
  }, [session?.user?.id, userBets, bitcoinPrice, updateBetAndScore, hasError]);

  useEffect(() => {
    if (hasOngoingBet && !hasError) {
      intervalRef.current = setInterval(() => {
        checkAndUpdateOnGoingBets();
      }, intervalMs);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hasOngoingBet, hasError, checkAndUpdateOnGoingBets, intervalMs]);

  // Reset error state when userBets change (new bet created)
  useEffect(() => {
    setHasError(false);
  }, [userBets.length]);
};

export default useActiveBets;
