import { useIntl } from "react-intl";
import { AccessTime } from "@mui/icons-material";
import { Chip } from "@mui/material";
import useBetTimer from "~/modules/Bets/components/BetTimer/useBetTimer";

import styles from "./BetTimer.module.scss";

const BetTimer = () => {
  const intl = useIntl();
  const { remainingSeconds, hasOngoingBet } = useBetTimer();

  if (!hasOngoingBet) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00";

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Chip
      icon={<AccessTime />}
      label={`${intl.formatMessage({ id: "bet.timer.remaining" })}: ${formatTime(remainingSeconds)}`}
      color={remainingSeconds <= 10 ? "error" : "primary"}
      variant="outlined"
      className={styles.betTimer}
    />
  );
};

export default BetTimer;
