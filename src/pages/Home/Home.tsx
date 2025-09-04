import {
  UserBetScore,
  BitcoinPrice,
  BetSection,
  BetTimer,
} from "~/modules/Bets/components";

import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.home__infoContainer}>
        <UserBetScore />
        <BitcoinPrice />
      </div>
      <BetSection />
      <BetTimer />
    </div>
  );
};

export default Home;
