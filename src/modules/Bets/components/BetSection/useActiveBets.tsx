import { useEffect, useCallback, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { useIntl } from "react-intl";
import { UserBet } from "~/modules/Bets/types/userBets";
import useBetStore from "~/modules/Bets/store/useBetStore";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import {
  isBetReadyToResolve,
  wasBetSuccess,
} from "~/modules/Bets/utils/checkBetData";
import {
  getUserScore,
  updateUserBetSuccess,
  upsertUserScore,
} from "~/modules/Bets/service/betsService";

const useActiveBets = (intervalMs = 1000) => {
  const intl = useIntl();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const session = useSessionStore((state) => state.session);
  const { bitcoinPrice, userBets, setUserBets } = useBetStore(
    useShallow((state) => ({
      bitcoinPrice: state.bitcoinPrice,
      userBets: state.userBets,
      setUserBets: state.setUserBets,
    }))
  );
  const setGeneralError = useGeneralLayoutStore(
    (state) => state.setGeneralError
  );

  const updateBetAndScore = useCallback(
    async (ongoingBet: UserBet, betSuccess: boolean) => {
      if (!session?.user?.id) return;

      const updateResponse = await updateUserBetSuccess(
        ongoingBet.id,
        betSuccess
      );
      if (updateResponse.error)
        return setGeneralError(
          intl.formatMessage({ id: updateResponse.messageKey })
        );

      setUserBets(updateResponse.data);

      const response = await getUserScore(session?.user?.id);
      if (response.error) return;

      const newScore = betSuccess
        ? response.data.score + 1
        : response.data.score - 1;

      if (newScore < 0) return;
      upsertUserScore(session?.user?.id, newScore);
    },
    [intl, session?.user?.id, setGeneralError, setUserBets]
  );

  const checkAndUpdateBets = useCallback(async () => {
    if (!session?.user?.id || !userBets.length) return;

    const ongoingBet = userBets.find((bet) => bet.success === null);
    if (!ongoingBet) return;

    if (!isBetReadyToResolve(ongoingBet)) return;

    const betSuccess = wasBetSuccess(ongoingBet, bitcoinPrice);
    updateBetAndScore(ongoingBet, betSuccess);
  }, [session?.user?.id, userBets, bitcoinPrice, updateBetAndScore]);

  useEffect(() => {
    const currentBetOnGoing =
      userBets.length > 0 && userBets?.find((bet) => bet.success === null);

    // Start checking every second the bet result
    if (currentBetOnGoing) {
      intervalRef.current = setInterval(() => {
        checkAndUpdateBets();
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
  }, [userBets, checkAndUpdateBets, intervalMs]);
};

export default useActiveBets;
