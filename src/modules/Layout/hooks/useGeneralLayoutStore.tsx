import { create } from "zustand";
import { NotificationMessage } from "../constants/notifications";

export interface GeneralLayoutState {
  generalError: string;
  setGeneralError: (generalError: string) => void;
  notification?: NotificationMessage;
  setNotification: (notificationMessage?: NotificationMessage) => void;
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

const useGeneralLayoutStore = create<GeneralLayoutState>((set) => ({
  generalError: "",
  setGeneralError: (generalError) => set({ generalError }),
  notification: undefined,
  setNotification: (notification) => set({ notification }),
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
}));

export default useGeneralLayoutStore;
