import { LOCAL_STORAGE_SESSION_KEY } from "~/modules/Auth/constants/sessionStorage";
import { Session } from "~/modules/Auth/types/session";

export const getSessionStorage = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
  if (!data) return null;
  return JSON.parse(data) as Session;
};

export const setSessionStorage = (session: Session) => {
  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(session));
};

export const cleanSessionStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
};
