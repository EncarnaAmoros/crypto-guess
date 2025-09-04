import { useState, useEffect, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import useBetStore from "~/modules/Bets/store/useBetStore";
import { isBetReadyToResolve } from "~/modules/Bets/utils/checkBetData";
import { BET_TIME } from "~/modules/Bets/constants/bets";

const useBetTimer = () => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  const { userBets } = useBetStore(
    useShallow((state) => ({
      userBets: state.userBets,
    }))
  );

  const calculateRemainingTime = useCallback(() => {
    const ongoingBet = userBets.find((bet) => bet.success === null);

    if (!ongoingBet) {
      setRemainingSeconds(0);
      return;
    }

    const currentTime = new Date();
    const betCreationTime = new Date(ongoingBet.createdAt);
    const timeDifference = currentTime.getTime() - betCreationTime.getTime();
    const oneMinuteInMs = BET_TIME;

    const remaining = Math.max(0, oneMinuteInMs - timeDifference);
    const remainingSecondsValue = Math.floor(remaining / 1000);

    setRemainingSeconds(remainingSecondsValue);
  }, [userBets]);

  useEffect(() => {
    const ongoingBet = userBets?.find((bet) => bet.success === null);

    if (ongoingBet && !isBetReadyToResolve(ongoingBet)) {
      calculateRemainingTime();
      const interval = setInterval(calculateRemainingTime, 1000);

      return () => clearInterval(interval);
    } else {
      setRemainingSeconds(0);
    }
  }, [userBets, calculateRemainingTime]);

  const currentBetOnGoing =
    userBets.length > 0 && userBets.find((bet) => bet.success === null);

  return {
    remainingSeconds,
    hasOngoingBet: !!currentBetOnGoing,
  };
};

export default useBetTimer;
