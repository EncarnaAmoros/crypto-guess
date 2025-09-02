import styles from "./MainSideBar.module.scss";
import BitcoinIcon from "~/../public/bitcoin-icon.svg";

const MainSideBar = () => {
  return (
    <div className={styles.mainSideBar}>
      <header className={styles.mainSideBar__header}>
        <img
          className={styles.mainSideBar__icon}
          src={BitcoinIcon}
          alt="Bitcoin Icon"
        />
        <div className={styles.mainSideBar__title}>Crypto Games</div>
      </header>
    </div>
  );
};

export default MainSideBar;
