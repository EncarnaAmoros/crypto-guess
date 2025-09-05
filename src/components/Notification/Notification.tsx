import { useShallow } from "zustand/shallow";
import { Snackbar } from "@mui/material";
import { CheckCircle, Error, Info, Close } from "@mui/icons-material";
import { NOTIFICATION_SEVERITY } from "~/modules/Layout/constants/notifications";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";
import classNames from "classnames";

import styles from "./Notification.module.scss";

const Notification = () => {
  const { notification, setNotification } = useGeneralLayoutStore(
    useShallow((state) => ({
      notification: state.notification,
      setNotification: state.setNotification,
    }))
  );

  const getIcon = () => {
    switch (notification?.severity) {
      case NOTIFICATION_SEVERITY.SUCCESS:
        return <CheckCircle className={styles.notification__icon} />;
      case NOTIFICATION_SEVERITY.ERROR:
        return <Error className={styles.notification__icon} />;
      case NOTIFICATION_SEVERITY.INFO:
        return <Info className={styles.notification__icon} />;
      default:
        return null;
    }
  };

  const handleClose = () => {
    setNotification(undefined);
  };

  return (
    <Snackbar
      open={!!notification?.message}
      autoHideDuration={notification?.autoHideDuration || 600000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleClose}
    >
      <div
        className={classNames(
          styles.notification__alert,
          styles[`notification__alert--${notification?.severity}`]
        )}
      >
        {getIcon()}
        <span className={styles.notification__message}>
          {notification?.message}
        </span>
        <Close className={styles.notification__close} onClick={handleClose} />
      </div>
    </Snackbar>
  );
};

export default Notification;
