import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { ROUTES } from "~/routing/routes";
import useSessionStore from "~/modules/Auth/store/useSessionStore";

import styles from "./Home.module.scss";

const Home = () => {
  const intl = useIntl();
  const cleanSession = useSessionStore((state) => state.cleanSession);

  const handleClearAccount = () => {
    cleanSession();
  };

  return (
    <div className={styles.home}>
      <h1 className={styles.home__title}>BTC Guess</h1>
      <h2 className={styles.home__subtitle}>
        {intl.formatMessage({ id: "welcome.message" })}
      </h2>
      <Link to={ROUTES.BTC_GUESS} className={styles.home__link}>
        Click here
      </Link>
      <button type="button" onClick={handleClearAccount}>
        Log out
      </button>
    </div>
  );
};

export default Home;
