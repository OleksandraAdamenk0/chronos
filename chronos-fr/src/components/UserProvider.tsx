import React, {type ReactNode, useEffect, useState} from "react";
import {GET} from "@/utils/api.ts";
import type {UserType} from "@/types";
import {UserContext} from "@/contexts/UserContext.tsx";

interface Props {
  children: ReactNode;
}

const UserProvider: React.FC<Props> = ({ children }: Props) => {
  const [value, setValue] = useState<UserType | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (isLoaded) return; // works only once
    fetchUser();
  }, [])

  useEffect(() => {
    if (value) setIsLoaded(true);
  }, [value]);

  useEffect(() => {
  }, [isLoaded]);

  const fetchUser = async () => {
    try {
      const result = await GET('auth/verify');
      if (result.success) setValue(result.data);
      else console.error(result.error);
    } catch (e) {
      console.error("unexpected error in user context while fetching user", e);
      setIsLoaded(true);
    }
  }

  const getUser = (): UserType | null => {
    if (!isLoaded) fetchUser().then(() => {return value});
    return value;
  };

  const setUser = (user: UserType): void => {
    setValue(user);
    setIsLoaded(true);
  };

  const logout = () => {
    setValue(null);
    setIsLoaded(false);
  }

  return <UserContext.Provider value={{isLoaded, getUser, setUser, logout}}>{children}</UserContext.Provider>
}

export default UserProvider;