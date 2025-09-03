import { useShallow } from "zustand/shallow";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import {
  UserBetScore,
  BitcoinPrice,
  BetSection,
} from "~/modules/Bets/components";
import { InfoDialog } from "~/components";

import styles from "./Home.module.scss";

const Home = () => {
  const { generalError, setGeneralError } = useGeneralLayoutStore(
    useShallow((state) => ({
      generalError: state.generalError,
      setGeneralError: state.setGeneralError,
    }))
  );

  return (
    <div className={styles.home}>
      <div className={styles.home__infoContainer}>
        <UserBetScore />
        <BitcoinPrice />
      </div>
      <BetSection />
      <InfoDialog
        open={!!generalError}
        onClose={() => setGeneralError("")}
        message={generalError}
      />
    </div>
  );
};

export default Home;
