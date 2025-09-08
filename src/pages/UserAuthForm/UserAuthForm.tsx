import { useIntl } from "react-intl";
import {
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Button,
  CircularProgress,
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
    loading,
    setUsername,
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
              value={AUTH_FORM_TYPES.SIGNIN}
              aria-label="signin"
              className={classNames(styles.userAuthForm__navButton, {
                [styles["userAuthForm__navButton--active"]]:
                  authFormType === AUTH_FORM_TYPES.SIGNIN,
              })}
            >
              {intl.formatMessage({ id: "signin" })}
            </ToggleButton>
            <ToggleButton
              value={AUTH_FORM_TYPES.SIGNUP}
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
          <div className={styles.userAuthForm__description}>
            {intl.formatMessage({ id: `${authFormType}.description` })}
          </div>
          <TextField
            className={styles.userAuthForm__input}
            label={intl.formatMessage({ id: "username" })}
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value.replaceAll(/\s/g, ""))}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault();
              if (e.key === "Enter") handleFormSubmit();
            }}
            fullWidth
            margin="normal"
            error={!!authFormError}
          />

          <Button
            variant="contained"
            onClick={handleFormSubmit}
            disabled={loading || !username}
            startIcon={loading ? <CircularProgress size={14} /> : undefined}
          >
            {intl.formatMessage({
              id:
                authFormType === AUTH_FORM_TYPES.SIGNIN
                  ? "signin"
                  : "create.account",
            })}
          </Button>
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
