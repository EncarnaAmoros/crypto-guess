import { useIntl } from "react-intl";
import useBetStore from "~/modules/Bets/store/useBetStore";

import styles from "./BetText.module.scss";

const BetText = () => {
  const intl = useIntl();

  const userBets = useBetStore((state) => state.userBets);

  const onGoingBet = !!userBets?.find((bet) => !bet.result);

  if (onGoingBet) {
    return (
      <div className={styles.betText}>
        <div className={styles.betText__text}>
          {intl.formatMessage({ id: "bets.disabled.ongoing.bet.1" })}
        </div>
        <div className={styles.betText__highlight}>
          {intl.formatMessage({ id: "not.available" })}
        </div>
        <div className={styles.betText__text}>
          {intl.formatMessage({ id: "bets.disabled.ongoing.bet.2" })}
        </div>
      </div>
    );
  }

  if (!userBets || userBets?.length === 0) {
    return (
      <div className={styles.betText}>
        <div className={styles.betText__text}>
          {intl.formatMessage({ id: "bet.empty.state.description.1" })}
        </div>
        <div className={styles.betText__highlight}>
          {intl.formatMessage({ id: "bitcoin" })}
        </div>
        <div className={styles.betText__text}>
          {intl.formatMessage({ id: "bet.empty.state.description.2" })}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.betText}>
      <div className={styles.betText__text}>
        {intl.formatMessage({ id: "bet.description.1" })}
      </div>
      <div className={styles.betText__highlight}>
        {intl.formatMessage({ id: "bitcoin" })}
      </div>
      <div className={styles.betText__text}>
        {intl.formatMessage({ id: "bet.description.2" })}
      </div>
    </div>
  );
};

export default BetText;
