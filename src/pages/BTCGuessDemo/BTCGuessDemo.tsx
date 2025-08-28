import { BTCGuess } from "~/modules/BTC/components";

import styles from "./BTCGuessDemo.module.scss";

const BTCGuessDemo = () => {
  return (
    <div className={styles.btcGuessDemo}>
      <BTCGuess />
    </div>
  );
};

export default BTCGuessDemo;
