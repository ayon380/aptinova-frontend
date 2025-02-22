import { create } from 'zustand';

interface StoreState {
  theme: 'light' | 'dark';
  userToken: string | null;
  setTheme: (theme: 'light' | 'dark') => void;
  setUserToken: (token: string | null) => void;
}

const useStore = create<StoreState>((set) => ({
  theme: 'light',
  userToken: null,
  setTheme: (theme: 'light' | 'dark') => set({ theme }),
  setUserToken: (token: string | null) => set({ userToken: token }),
}));

export default useStore;
