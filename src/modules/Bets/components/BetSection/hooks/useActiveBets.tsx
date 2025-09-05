import { useEffect, useCallback, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { UserBet } from "~/modules/Bets/types/userBets";
import useBetNotifications from "./useBetNotifications";
import { useErrorHandler } from "~/modules/Layout/hooks/useErrorHandler";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import useBetStore from "~/modules/Bets/store/useBetStore";
import {
  isBetReadyToResolve,
  shouldUpdateScore,
  getBetPoints,
} from "~/modules/Bets/utils/checkBetData";
import {
  getUserScore,
  updateUserBetSuccess,
  upsertUserScore,
} from "~/modules/Bets/service/betsService";

// If there is an ongoing bet, check every second the bet result
// When the bet is resolved, update the bet and score
const useActiveBets = (intervalMs = 1000) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const session = useSessionStore((state) => state.session);
  const { notifyScoreChange } = useBetNotifications();
  const { handleError } = useErrorHandler();

  const { bitcoinPrice, userBets, setUserBets, setUserScore } = useBetStore(
    useShallow((state) => ({
      bitcoinPrice: state.bitcoinPrice,
      userBets: state.userBets,
      setUserBets: state.setUserBets,
      setUserScore: state.setUserScore,
    }))
  );

  const hasOngoingBet = !!userBets?.find((bet) => bet.success == null);

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
        notifyScoreChange(betPoints);
      }
    },
    [session?.user?.id, handleError, setUserScore, notifyScoreChange]
  );

  const updateBetAndScore = useCallback(
    async (ongoingBet: UserBet, betPoints: number) => {
      if (!session?.user?.id) return;

      const betSuccess = betPoints > 0 || betPoints === 0;
      const updateResponse = await updateUserBetSuccess(
        ongoingBet.id,
        betSuccess
      );
      if (updateResponse.error) return handleError(updateResponse.messageKey);

      setUserBets(updateResponse.data);
      updateScore(betPoints);
    },
    [session?.user?.id, handleError, setUserBets, updateScore]
  );

  const checkAndUpdateOnGoingBets = useCallback(async () => {
    if (!session?.user?.id || !userBets.length) return;

    const ongoingBet = userBets.find((bet) => bet.success == null);
    if (!ongoingBet) return;

    if (!isBetReadyToResolve(ongoingBet)) return;

    const betPoints = getBetPoints(ongoingBet, bitcoinPrice);
    updateBetAndScore(ongoingBet, betPoints);
  }, [session?.user?.id, userBets, bitcoinPrice, updateBetAndScore]);

  useEffect(() => {
    if (hasOngoingBet) {
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
  }, [hasOngoingBet, checkAndUpdateOnGoingBets, intervalMs]);
};

export default useActiveBets;
