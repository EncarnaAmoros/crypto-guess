import { create } from "zustand";
import { UserBet, UserScore } from "~/modules/Bets/types/userBets";

export interface BetState {
  bitcoinPrice: number;
  setBitcoinPrice: (bitcoinPrice: number) => void;
  userBets: UserBet[];
  setUserBets: (userBets: UserBet[]) => void;
  userScore: UserScore | null;
  setUserScore: (userScore: UserScore) => void;
}

const useBetStore = create<BetState>((set) => ({
  bitcoinPrice: 0,
  setBitcoinPrice: (bitcoinPrice) => set({ bitcoinPrice }),
  userBets: [],
  setUserBets: (userBets) => set({ userBets }),
  userScore: null,
  setUserScore: (userScore) => set({ userScore }),
}));

export default useBetStore;
