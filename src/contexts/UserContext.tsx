import { createContext, ReactNode, useContext, useState } from "react";
import { useCookies } from "react-cookie";

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextData {
  user: User;
  updateUser(user: User): void;
};

interface User {
  name?: string;
  email?: string;
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

    console.log(cookie)

    setUser({
      email: user.email,
      name: user.name,
    })
  }

  return (
    <UserContext.Provider value={{user, updateUser}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext);