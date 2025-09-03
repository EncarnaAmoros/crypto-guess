import { create } from "zustand";

export interface BetState {
  bitcoinPrice: number;
  setBitcoinPrice: (bitcoinPrice: number) => void;
}

const useBetStore = create<BetState>((set) => ({
  bitcoinPrice: 0,
  setBitcoinPrice: (bitcoinPrice) => set({ bitcoinPrice }),
}));

export default useBetStore;
