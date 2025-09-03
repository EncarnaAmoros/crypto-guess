import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import { CircularProgress } from "@mui/material";
import { UserScore } from "~/modules/Bets/types/userBets";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import { getUserScore as getUserScoreService } from "~/modules/Bets/service/betsService";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import { InfoCard } from "~/components";

import styles from "./UserBetScore.module.scss";

const UserBetScore = () => {
  const intl = useIntl();
  const session = useSessionStore((state) => state.session);

  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [loadingUserScore, setLoadingUserScore] = useState<boolean>(true);
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
  }, [session?.user?.id, setGeneralError, intl]);

  useEffect(() => {
    getUserScore();
  }, [getUserScore]);

  return (
    <InfoCard
      className={styles.userBetScore}
      icon={<SportsScoreIcon />}
      text={
        loadingUserScore ? (
          <div>
            {intl.formatMessage({ id: "score" })}:{" "}
            <CircularProgress size={24} />
          </div>
        ) : (
          `${intl.formatMessage({ id: "score" })}: ${userScore?.score ?? "-"}`
        )
      }
    />
  );
};

export default UserBetScore;
