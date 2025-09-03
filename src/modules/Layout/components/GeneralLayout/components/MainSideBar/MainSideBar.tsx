import styles from "./MainSideBar.module.scss";

const APP_NAME = "PlayCrypto";

const MainSideBar = () => {
  return (
    <div className={styles.mainSideBar}>
      <header className={styles.mainSideBar__header}>
        <img
          className={styles.mainSideBar__icon}
          src="/bitcoin-icon.svg"
          alt="Bitcoin Icon"
        />
        <div className={styles.mainSideBar__title}>{APP_NAME}</div>
      </header>
    </div>
  );
};

export default MainSideBar;
