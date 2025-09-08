import { Outlet } from "react-router-dom";
import { useShallow } from "zustand/shallow";
import { IconButton } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import useGeneralLayout from "./components/useGeneralLayout";
import MainSideBar from "./components/MainSideBar/MainSideBar";
import { InfoDialog, Notification } from "~/components";
import Header from "./components/Header/Header";

import styles from "./GeneralLayout.module.scss";

const GeneralLayout = () => {
  const { isMobileSidebarOpen, toggleMobileSidebar, closeMobileSidebar } =
    useGeneralLayout();

  const { isMobile, generalError, setGeneralError } = useGeneralLayoutStore(
    useShallow((state) => ({
      isMobile: state.isMobile,
      generalError: state.generalError,
      setGeneralError: state.setGeneralError,
    }))
  );

  return (
    <div className={styles.generalLayout}>
      {isMobile && (
        <IconButton
          className={styles.generalLayout__mobileMenuButton}
          onClick={toggleMobileSidebar}
          aria-label="Toggle menu"
        >
          {isMobileSidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      )}

      <MainSideBar isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />

      {isMobile && isMobileSidebarOpen && (
        <div
          className={styles.generalLayout__overlay}
          onClick={closeMobileSidebar}
        />
      )}

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
