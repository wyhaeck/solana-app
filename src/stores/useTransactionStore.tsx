import { create } from "zustand";

interface TransactionStore {
  address: string;
  sol: number;
  setAddress: (x: string) => void;
  setSol: (x: number) => void;
}

const useTransactionStore = create<TransactionStore>((set, _get) => ({
  address: "",
  sol: 0,
  setAddress: (txt) => set(() => ({ address: txt })),
  setSol: (solana) => set(() => ({ sol: solana })),
}));

export default useTransactionStore;
