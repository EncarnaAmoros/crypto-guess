import { useIntl } from "react-intl";
import {
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Button,
} from "@mui/material";
import { AUTH_FORM_TYPES } from "~/modules/Auth/types/authForm";
import { InfoDialog } from "~/components";
import useUserAuthForm from "./useUserAuthForm";
import classNames from "classnames";

import styles from "./UserAuthForm.module.scss";

const UserAuthForm = () => {
  const intl = useIntl();

  const {
    username,
    authFormType,
    authFormError,
    setUsername,
    setAuthFormType,
    setAuthFormError,
    handleToggleChange,
    handleFormSubmit,
  } = useUserAuthForm();

  return (
    <main className={styles.userAuthForm}>
      <div className={styles.userAuthForm__container}>
        <header className={styles.userAuthForm__header}>
          <ToggleButtonGroup
            value={authFormType}
            exclusive
            onChange={handleToggleChange}
            aria-label="auth navigation"
          >
            <ToggleButton
              value={AUTH_FORM_TYPES.LOGIN}
              onClick={() => setAuthFormType(AUTH_FORM_TYPES.LOGIN)}
              aria-label="login"
              className={classNames(styles.userAuthForm__navButton, {
                [styles["userAuthForm__navButton--active"]]:
                  authFormType === AUTH_FORM_TYPES.LOGIN,
              })}
            >
              {intl.formatMessage({ id: "login" })}
            </ToggleButton>
            <ToggleButton
              value={AUTH_FORM_TYPES.SIGNUP}
              onClick={() => setAuthFormType(AUTH_FORM_TYPES.SIGNUP)}
              aria-label="signup"
              className={classNames(styles.userAuthForm__navButton, {
                [styles["userAuthForm__navButton--active"]]:
                  authFormType === AUTH_FORM_TYPES.SIGNUP,
              })}
            >
              {intl.formatMessage({ id: "signup" })}
            </ToggleButton>
          </ToggleButtonGroup>
        </header>

        <section className={styles.userAuthForm__content}>
          <div className={styles.userAuthForm__userAuthForm}>
            <p>{intl.formatMessage({ id: `${authFormType}.description` })}</p>
            <TextField
              label={intl.formatMessage({ id: "username" })}
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
            />

            <Button variant="contained" onClick={handleFormSubmit}>
              {intl.formatMessage({ id: authFormType })}
            </Button>
          </div>
        </section>
      </div>

      <InfoDialog
        open={!!authFormError}
        onClose={() => setAuthFormError("")}
        message={authFormError}
      />
    </main>
  );
};

export default UserAuthForm;
