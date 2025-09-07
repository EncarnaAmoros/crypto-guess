import { useCallback, useEffect } from "react";
import { useIntl } from "react-intl";
import useBetStore from "~/modules/Bets/store/useBetStore";
import { getUserBets as getUserBetsService } from "~/modules/Bets/service/betsService";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import { useErrorHandler } from "~/modules/Layout/hooks/useErrorHandler";
import { UserBetsList } from "~/modules/Bets/components";

import styles from "./Statistics.module.scss";

const Statistics = () => {
  const intl = useIntl();
  const { handleError } = useErrorHandler();

  const session = useSessionStore((state) => state.session);
  const setUserBets = useBetStore((state) => state.setUserBets);

  const getUserBets = useCallback(async () => {
    if (!session?.user?.id) return;

    const response = await getUserBetsService(session?.user?.id);
    if (response.error) return handleError(response.messageKey);

    setUserBets(response.data);
  }, [session?.user?.id, handleError, setUserBets]);

  useEffect(() => {
    getUserBets();
  }, [getUserBets]);

  return (
    <div className={styles.statistics}>
      <div className={styles.statistics__title}>
        {intl.formatMessage({ id: "statistics" })}
      </div>
      <div className={styles.statistics__description}>
        {intl.formatMessage({ id: "statistics.user.title" })}
      </div>

      <UserBetsList />
    </div>
  );
};

export default Statistics;
