import { useCallback } from "react";
import { useIntl } from "react-intl";
import useGeneralLayoutStore from "./useGeneralLayoutStore";

export const useErrorHandler = () => {
  const intl = useIntl();
  const setGeneralError = useGeneralLayoutStore((state) => state.setGeneralError);

  const handleError = useCallback(
    (messageKey: string) => {
      setGeneralError(intl.formatMessage({ id: messageKey }));
    },
    [intl, setGeneralError]
  );

  return { handleError };
};
