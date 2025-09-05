import { Outlet } from "react-router-dom";
import { useShallow } from "zustand/shallow";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import MainSideBar from "./components/MainSideBar/MainSideBar";
import Header from "./components/Header/Header";
import { InfoDialog, Notification } from "~/components";

import styles from "./GeneralLayout.module.scss";

const GeneralLayout = () => {
  const { generalError, setGeneralError } = useGeneralLayoutStore(
    useShallow((state) => ({
      generalError: state.generalError,
      setGeneralError: state.setGeneralError,
    }))
  );

  return (
    <div className={styles.generalLayout}>
      <MainSideBar />
      <div className={styles.generalLayout__main}>
        <Header />
        <div className={styles.generalLayout__content}>
          <Outlet />
        </div>
      </div>

      <InfoDialog
        open={!!generalError}
        onClose={() => setGeneralError("")}
        message={generalError}
      />

      <Notification />
    </div>
  );
};

export default GeneralLayout;
