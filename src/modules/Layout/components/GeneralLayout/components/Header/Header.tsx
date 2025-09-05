import { useIntl } from "react-intl";
import { useShallow } from "zustand/shallow";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import PersonIcon from "@mui/icons-material/Person";
import { Button } from "@mui/material";

import styles from "./Header.module.scss";

const Header = () => {
  const intl = useIntl();

  const { session, cleanSession } = useSessionStore(
    useShallow((state) => ({
      session: state.session,
      cleanSession: state.cleanSession,
    }))
  );

  const handleClearAccount = () => {
    cleanSession();
  };

  return (
    <header className={styles.header}>
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
        startIcon={<PersonIcon />}
      >
        {intl.formatMessage({ id: "logout" })}
      </Button>
    </header>
  );
};

export default Header;
