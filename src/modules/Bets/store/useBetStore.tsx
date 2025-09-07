import { create } from "zustand";
import { UserBet, UserScore } from "~/modules/Bets/types/userBets";

export interface BetState {
  bitcoinPrice: number;
  setBitcoinPrice: (bitcoinPrice: number) => void;
  userBets: UserBet[];
  setUserBets: (userBets: UserBet[]) => void;
  userScore: UserScore | null;
  setUserScore: (userScore: UserScore) => void;
  updateOnGoingBet: (bet: UserBet) => UserBet[];
}

const useBetStore = create<BetState>((set) => ({
  bitcoinPrice: 0,
  setBitcoinPrice: (bitcoinPrice) => set({ bitcoinPrice }),
  userBets: [],
  setUserBets: (userBets) => set({ userBets }),
  userScore: null,
  setUserScore: (userScore) => set({ userScore }),
  updateOnGoingBet: (bet) => {
    let updatedBets: UserBet[] = [];
    set((state) => {
      updatedBets = state.userBets.map((b) => (b.id === bet.id ? bet : b));
      return { userBets: updatedBets };
    });
    return updatedBets;
  },
}));

export default useBetStore;
