import { useIntl } from "react-intl";
import { UserBetsList } from "~/modules/Bets/components";

import styles from "./Statistics.module.scss";

const Statistics = () => {
  const intl = useIntl();

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
