import { Outlet } from "react-router-dom";
import MainSideBar from "./components/MainSideBar/MainSideBar";
import Header from "./components/Header/Header";

import styles from "./GeneralLayout.module.scss";

const GeneralLayout = () => {
  return (
    <div className={styles.generalLayout}>
      <MainSideBar />
      <div className={styles.generalLayout__main}>
        <Header />
        <div className={styles.generalLayout__content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default GeneralLayout;
