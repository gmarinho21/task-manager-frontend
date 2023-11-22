import { create } from 'zustand'


export const useUserLoggedStore = create((set) => ({
    userLogged: {},
    changeUser: (newUser) => set(() => ({ userLogged: newUser})),
  }))