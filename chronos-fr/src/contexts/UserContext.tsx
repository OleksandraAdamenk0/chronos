import {createContext} from 'react';

import type {UserType} from "@/types";

type AuthContextType = {
  user: UserType | null;
  isLoaded: boolean;
  getUser: () => UserType | null;
  setUser: (user: UserType) => void;
  logout: () => Promise<void>;
  deleteUser: () => Promise<void>;
};

export const UserContext = createContext<AuthContextType | null>(null);
