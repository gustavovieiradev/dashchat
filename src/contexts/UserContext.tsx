import { createContext, ReactNode, useContext, useState } from "react";
import { useCookies } from "react-cookie";

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextData {
  user: User;
  updateUser(user: User): void;
  createUser(data: CookieData): void;
};

interface User {
  name?: string;
  email?: string;
}

interface CookieData {
  user: {
    data: User
  };
  token: string;
}

const UserContext = createContext({} as UserContextData);

export function UserProvider({children}: UserProviderProps) {
  const [cookie, setCookie] = useCookies(["user"])
  const [user, setUser] = useState<User>(() => {
    if (cookie?.user?.user) {
      return {
        name: cookie.user.user.data.name,
        email: cookie.user.user.data.email,
      }
    }

    return {} as User;
  });
  
  function updateUser(user: User) {
    cookie.user.user.data.name = user.name;
    setCookie("user", JSON.stringify(cookie.user), {
      path: "/",
      maxAge: 3600,
      sameSite: true,
    })

    setUser({
      email: user.email,
      name: user.name,
    })
  }

  function createUser(data: CookieData) {

    console.log(data);

    setCookie("user", JSON.stringify(data), {
      path: "/",
      maxAge: 3600,
      sameSite: true,
    })
    
    setUser({
      email: data.user.data.email,
      name: data.user.data.name,
    })

    console.log(user);
  }

  return (
    <UserContext.Provider value={{user, updateUser, createUser}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext);