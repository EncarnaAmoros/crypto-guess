import { useIntl } from "react-intl";
import { useShallow } from "zustand/shallow";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import PersonIcon from "@mui/icons-material/Person";
import { Button } from "@mui/material";
import classNames from "classnames";

import styles from "./Header.module.scss";

const Header = () => {
  const intl = useIntl();

  const { session, cleanSession } = useSessionStore(
    useShallow((state) => ({
      session: state.session,
      cleanSession: state.cleanSession,
    }))
  );

  const isMobile = useGeneralLayoutStore((state) => state.isMobile);

  const handleClearAccount = () => {
    cleanSession();
  };

  return (
    <header
      className={classNames(styles.header, {
        [styles["header--mobile"]]: isMobile,
      })}
    >
      <div className={styles.header__title}>
        {intl.formatMessage(
          { id: "hello.username" },
          { username: session?.user?.username }
        )}
      </div>
      <Button
        variant="text"
        onClick={handleClearAccount}
        className={styles.header__button}
        startIcon={!isMobile ? <PersonIcon /> : undefined}
        size={isMobile ? "small" : "medium"}
      >
        {intl.formatMessage({ id: "logout" })}
      </Button>
    </header>
  );
};

export default Header;
