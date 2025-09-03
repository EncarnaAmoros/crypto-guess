import { create } from "zustand";

export interface GeneralLayoutState {
  generalError: string;
  setGeneralError: (generalError: string) => void;
}

const useGeneralLayoutStore = create<GeneralLayoutState>((set) => ({
  generalError: "",
  setGeneralError: (generalError) => set({ generalError }),
}));

export default useGeneralLayoutStore;
