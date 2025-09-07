import { Button } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "~/routing/routes";
import styles from "./UserBetsListEmptyState.module.scss";

const UserBetsListEmptyState = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const navigateToHome = () => navigate(ROUTES.HOME);

  return (
    <div className={styles.userBetsListEmptyState}>
      <div className={styles.userBetsListEmptyState__message}>
        <div>{intl.formatMessage({ id: "bet.table.empty.message.line1" })}</div>
        <div>{intl.formatMessage({ id: "bet.table.empty.message.line2" })}</div>
      </div>

      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={navigateToHome}
        className={styles.userBetsListEmptyState__button}
      >
        {intl.formatMessage({ id: "bet.table.empty.action" })}
      </Button>
    </div>
  );
};

export default UserBetsListEmptyState;
