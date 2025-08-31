import { create } from "zustand";
import { Session } from "~/modules/Auth/types/session";
import {
  getSessionStorage,
  cleanSessionStorage,
  setSessionStorage,
} from "~/modules/Auth/helpers/sessionStorage";

export interface SessionState {
  session: Session | null;
  setSession: (session: Session) => void;
  cleanSession: () => void;
}

const initialSessionData = getSessionStorage() || null;

const useSessionStore = create<SessionState>((set) => ({
  session: initialSessionData,
  setSession: (session) => {
    setSessionStorage(session);
    set({ session });
  },
  cleanSession: () => {
    cleanSessionStorage();
    set({ session: null });
  },
}));

export default useSessionStore;
