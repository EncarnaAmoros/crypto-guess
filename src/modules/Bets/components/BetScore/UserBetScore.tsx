import { useShallow } from "zustand/shallow";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import { CircularProgress } from "@mui/material";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import { getUserScore as getUserScoreService } from "~/modules/Bets/service/betsService";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import useBetStore from "~/modules/Bets/store/useBetStore";
import { InfoCard } from "~/components";

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
      icon={<SportsScoreIcon />}
      text={
        loadingUserScore ? (
          <div>
            {intl.formatMessage({ id: "score" })}:{" "}
            <CircularProgress size={24} data-testid="loader" />
          </div>
        ) : (
          `${intl.formatMessage({ id: "score" })}: ${userScore?.score ?? "-"}`
        )
      }
    />
  );
};

export default UserBetScore;
