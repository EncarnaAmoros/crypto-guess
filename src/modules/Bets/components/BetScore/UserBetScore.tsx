import { useShallow } from "zustand/shallow";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import StarIcon from "@mui/icons-material/Star";
import { CircularProgress } from "@mui/material";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import { getUserScore as getUserScoreService } from "~/modules/Bets/service/betsService";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import useBetStore from "~/modules/Bets/store/useBetStore";
import { InfoCard } from "~/components";

import styles from "./UserBetScore.module.scss";

const UserBetScore = () => {
  const intl = useIntl();
  const session = useSessionStore((state) => state.session);

  const [loadingUserScore, setLoadingUserScore] = useState<boolean>(true);
  const { userScore, setUserScore } = useBetStore(
    useShallow((state) => ({
      userScore: state.userScore,
      setUserScore: state.setUserScore,
    }))
  );
  const setGeneralError = useGeneralLayoutStore(
    (state) => state.setGeneralError
  );

  const getUserScore = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoadingUserScore(true);
    const response = await getUserScoreService(session?.user?.id);
    setLoadingUserScore(false);

    if (response.error)
      return setGeneralError(intl.formatMessage({ id: response.messageKey }));

    setUserScore(response.data);
  }, [session?.user?.id, intl, setGeneralError, setUserScore]);

  useEffect(() => {
    getUserScore();
  }, [getUserScore]);

  return (
    <InfoCard
      icon={<StarIcon className={styles.userBetScore__icon} />}
      title={`${intl.formatMessage({ id: "score" })}:`}
      text={
        loadingUserScore ? (
          <CircularProgress size={24} data-testid="loader" />
        ) : (
          <div className={styles.userBetScore__score}>
            {userScore?.score ?? "-"}
          </div>
        )
      }
    />
  );
};

export default UserBetScore;
