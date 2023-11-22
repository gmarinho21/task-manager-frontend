import { create } from 'zustand'


export const useIsUserLoggedStore = create((set) => ({
    isLogged: false,
    changeLoggedState: (newState) => set(() => ({ isLogged: newState})),
  }))