import { create } from "zustand";

interface BasicsStore {
  loading: boolean;
  homeView: boolean;
  setLoading: (x: boolean) => void;
  setView: (x: boolean) => void;
}

const useBasicsStore = create<BasicsStore>((set, _get) => ({
  loading: false,
  homeView: true,
  setLoading: (bool) => set(() => ({ loading: bool })),
  setView: (bool) => set(() => ({ homeView: bool })),
}));

export default useBasicsStore;
