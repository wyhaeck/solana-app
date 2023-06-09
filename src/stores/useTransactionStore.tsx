import { create } from "zustand";

interface TransactionStore {
  address: string;
  sol: number;
  setTransactionAddress: (x: string) => void;
  setTransactionSol: (x: number) => void;
}

const useTransactionStore = create<TransactionStore>((set, _get) => ({
  address: "",
  sol: 0,
  setTransactionAddress: (txt) => set(() => ({ address: txt })),
  setTransactionSol: (solana) => set(() => ({ sol: solana })),
}));

export default useTransactionStore;
