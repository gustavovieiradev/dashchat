import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { parseCookies } from "../helpers";

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextData {
  user: User;
};

interface User {
  name?: string;
  email?: string;
}

const UserContext = createContext({} as UserContextData);

export function UserProvider({children}: UserProviderProps) {
  const [cookie] = useCookies(["user"])

  let user = {};
  if (cookie?.user?.user) {
    user = {
      name: cookie.user.user.data.name,
      email: cookie.user.user.data.email,
    }
  }

  return (
    <UserContext.Provider value={{user}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext);