import { useIntl } from "react-intl";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "~/routing/routes";
import { AUTH_FORM_TYPES } from "~/modules/Auth/types/authForm";
import useSessionStore from "~/modules/Auth/store/useSessionStore";
import { addUser, getUserByUsername } from "~/modules/Auth/service/userService";

const useUserAuthForm = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [authFormError, setAuthFormError] = useState("");
  const [authFormType, setAuthFormType] = useState(AUTH_FORM_TYPES.SIGNIN);

  const { setSession } = useSessionStore();

  const handleToggleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string
  ) => {
    setUsername("");
    setAuthFormType(newValue);
  };

  const handleLogin = async () => {
    setLoading(true);
    const response = await getUserByUsername(username);

    if (response.error) {
      setAuthFormError(intl.formatMessage({ id: response.messageKey }));
      setLoading(false);
      return;
    }

    setLoading(false);
    setSession({ user: response.data });
    navigate(ROUTES.HOME);
  };

  const handleSignup = async () => {
    setLoading(true);
    const response = await addUser(username);

    if (response.error) {
      setAuthFormError(intl.formatMessage({ id: response.messageKey }));
      setLoading(false);
      return;
    }

    setLoading(false);
    setSession({ user: response.data });
    navigate(ROUTES.HOME);
  };

  const handleFormSubmit = async () => {
    setAuthFormError("");

    if (authFormType === AUTH_FORM_TYPES.SIGNIN) {
      await handleLogin();
    } else {
      await handleSignup();
    }
  };

  return {
    loading,
    username,
    authFormType,
    authFormError,
    setUsername,
    setAuthFormError,
    handleToggleChange,
    handleFormSubmit,
  };
};

export default useUserAuthForm;
