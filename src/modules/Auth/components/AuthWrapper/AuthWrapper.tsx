import { useState } from "react";
import { useIntl } from "react-intl";
import { Outlet } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { AUTH_FORM_TYPES } from "~/modules/Auth/types/authForm";
import classNames from "classnames";

import styles from "./AuthWrapper.module.scss";

const AuthWrapper = () => {
  const intl = useIntl();
  const [authFormType, setAuthFormType] = useState(AUTH_FORM_TYPES.LOGIN);

  const handleToggleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string
  ) => {
    setAuthFormType(newValue);
  };

  return (
    <main className={styles.authWrapper}>
      <div className={styles.authWrapper__container}>
        <header className={styles.authWrapper__header}>
          <ToggleButtonGroup
            value={authFormType}
            exclusive
            onChange={handleToggleChange}
            aria-label="auth navigation"
          >
            <ToggleButton
              value={AUTH_FORM_TYPES.LOGIN}
              aria-label="login"
              className={classNames(styles.authWrapper__navButton, {
                [styles["authWrapper__navButton--active"]]:
                  authFormType === AUTH_FORM_TYPES.LOGIN,
              })}
            >
              {intl.formatMessage({ id: "login" })}
            </ToggleButton>
            <ToggleButton
              value={AUTH_FORM_TYPES.SIGNUP}
              aria-label="signup"
              className={classNames(styles.authWrapper__navButton, {
                [styles["authWrapper__navButton--active"]]:
                  authFormType === AUTH_FORM_TYPES.SIGNUP,
              })}
            >
              {intl.formatMessage({ id: "signup" })}
            </ToggleButton>
          </ToggleButtonGroup>
        </header>

        <section className={styles.authWrapper__content}>
          <Outlet />
        </section>
      </div>
    </main>
  );
};

export default AuthWrapper;
