import { create } from "zustand";
import { UserBet } from "~/modules/Bets/types/userBets";

export interface BetState {
  bitcoinPrice: number;
  setBitcoinPrice: (bitcoinPrice: number) => void;
  userBets: UserBet[];
  setUserBets: (userBets: UserBet[]) => void;
}

const useBetStore = create<BetState>((set) => ({
  bitcoinPrice: 0,
  setBitcoinPrice: (bitcoinPrice) => set({ bitcoinPrice }),
  userBets: [],
  setUserBets: (userBets) => set({ userBets }),
}));

export default useBetStore;
