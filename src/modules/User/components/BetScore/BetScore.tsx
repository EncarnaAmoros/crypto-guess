import { useIntl } from "react-intl";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import { InfoCard } from "~/components";

import styles from "./BetScore.module.scss";

interface BetScoreProps {
  score: number;
}

const BetScore = ({ score }: BetScoreProps) => {
  const intl = useIntl();

  return (
    <InfoCard
      className={styles.betScore}
      icon={<SportsScoreIcon />}
      text={`${intl.formatMessage({ id: "score" })}: ${score}`}
    />
  );
};

export default BetScore;
