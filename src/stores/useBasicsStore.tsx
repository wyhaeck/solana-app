import { create } from "zustand";

interface BasicsStore {
  loading: boolean;
  notifications: Array<{
    type: string;
    message: string;
    description?: string;
    txid?: string;
  }>;
  setLoading: (x: boolean) => void;
}

const useBasicsStore = create<BasicsStore>((set, _get) => ({
  loading: false,
  notifications: [],
  setLoading: (bool) => set(() => ({ loading: bool })),
}));

export default useBasicsStore;
