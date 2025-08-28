import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { ROUTES } from "~/routing/routes";

import styles from "./Home.module.scss";

const Home = () => {
  const intl = useIntl();

  return (
    <div className={styles.home}>
      <h1 className={styles.home__title}>BTC Guess</h1>
      <h2 className={styles.home__subtitle}>
        {intl.formatMessage({ id: "welcome.message" })}
      </h2>
      <Link to={ROUTES.BTC_GUESS} className={styles.home__link}>
        Click here
      </Link>
    </div>
  );
};

export default Home;
