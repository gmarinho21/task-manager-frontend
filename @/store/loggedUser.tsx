import { create } from "zustand";

interface User {
  userLogged:
    | {
        _id: string;
        createdAt: string;
        email: string;
        name: string;
        updatedAt: string;
      }
    | Record<string, never>;
  changeUser: (
    newUser:
      | {
          _id: string;
          createdAt: string;
          email: string;
          name: string;
          updatedAt: string;
        }
      | Record<string, never>
  ) => void;
}

export const useUserLoggedStore = create<User>()((set) => ({
  userLogged: {},
  changeUser: (newUser) => set(() => ({ userLogged: newUser })),
}));
