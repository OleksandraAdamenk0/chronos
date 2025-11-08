import {createContext} from 'react';

import type {UserType} from "@/types";

type AuthContextType = {
  isLoaded: boolean;
  getUser: () => UserType | null;
  setUser: (user: UserType) => void;
  logout: () => void;
};

export const UserContext = createContext<AuthContextType | null>(null);
