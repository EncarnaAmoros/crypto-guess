import { useCallback } from "react";
import { useIntl } from "react-intl";
import { NOTIFICATION_SEVERITY } from "~/modules/Layout/constants/notifications";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";

const useBetNotifications = () => {
  const intl = useIntl();
  const setNotification = useGeneralLayoutStore(
    (state) => state.setNotification
  );

  const notifyBetResult = useCallback(
    (betPoints: number) => {
      const getNotificationConfig = () => {
        if (betPoints > 0) {
          return {
            messageId: "notification.bet.score.increase",
            severity: NOTIFICATION_SEVERITY.SUCCESS,
          };
        }
        if (betPoints < 0) {
          return {
            messageId: "notification.bet.score.decrease",
            severity: NOTIFICATION_SEVERITY.ERROR,
          };
        }
        return {
          messageId: "notification.bet.score.equal",
          severity: NOTIFICATION_SEVERITY.INFO,
        };
      };

      const { messageId, severity } = getNotificationConfig();
      setNotification({
        message: intl.formatMessage({ id: messageId }),
        severity,
      });
    },
    [intl, setNotification]
  );

  return { notifyBetResult };
};

export default useBetNotifications;
