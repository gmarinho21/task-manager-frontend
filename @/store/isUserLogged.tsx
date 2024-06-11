import { create } from "zustand";

interface IsUser {
  isLogged: boolean;
  changeLoggedState: (newState: boolean) => void;
}

export const useIsUserLoggedStore = create<IsUser>()((set) => ({
  isLogged: false,
  changeLoggedState: (newState) => set(() => ({ isLogged: newState })),
}));
