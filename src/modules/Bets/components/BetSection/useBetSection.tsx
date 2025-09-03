import { useEffect, useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { useIntl } from "react-intl";
import useBetStore from "~/modules/Bets/store/useBetStore";
import {
  getUserBets as getUserBetsService,
  createUserBet,
} from "~/modules/Bets/service/betsService";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import { CRYPTO_BET } from "~/modules/Bets/constants/bets";

const useBetSection = () => {
  const session = useSessionStore((state) => state.session);
  const setGeneralError = useGeneralLayoutStore(
    (state) => state.setGeneralError
  );
  const { bitcoinPrice, userBets, setUserBets } = useBetStore(
    useShallow((state) => ({
      bitcoinPrice: state.bitcoinPrice,
      userBets: state.userBets,
      setUserBets: state.setUserBets,
    }))
  );

  const intl = useIntl();

  const getUserBets = useCallback(async () => {
    if (!session?.user?.id) return;

    const response = await getUserBetsService(session?.user?.id);
    if (response.error)
      return setGeneralError(intl.formatMessage({ id: response.messageKey }));

    setUserBets(response.data);
  }, [intl, session?.user?.id, setGeneralError, setUserBets]);

  useEffect(() => {
    getUserBets();
  }, [getUserBets]);

  const makeBetHandler = async (cryptoBet: CRYPTO_BET) => {
    if (!session?.user?.id) return;

    const response = await createUserBet(
      session?.user?.id,
      cryptoBet,
      bitcoinPrice
    );
    if (response.error)
      return setGeneralError(intl.formatMessage({ id: response.messageKey }));

    setUserBets(response.data);
  };

  const onGoingBetText = intl.formatMessage({
    id: "bets.disabled.ongoing.bet",
  });

  const betDescription =
    userBets?.length > 0
      ? intl.formatMessage({ id: "bet.description" })
      : intl.formatMessage({ id: "bet.empty.state.description" });

  const currentBetOnGoing =
    userBets.length > 0 && !!userBets?.find((bet) => !bet.success);

  const betTextDescription = currentBetOnGoing
    ? onGoingBetText
    : betDescription;

  return {
    betTextDescription,
    currentBetOnGoing,
    makeBetHandler,
  };
};

export default useBetSection;
