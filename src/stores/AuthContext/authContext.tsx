import {
  createContext,
  useState,
  FunctionComponent,
  ReactNode,
  useEffect,
} from "react";
import { useCookie } from "../CookieContext/useCookie";
import { saveState } from "../../utils/localStorageUtil";

export interface AuthContextProps {
  isVerified: string;
  role: string;
  id: string;
  login: (
    isVerified: string,
    role: string | undefined,
    id: string | undefined
  ) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: FunctionComponent<
  AuthContextProviderProps
> = ({ children }) => {
  const [isVerified, setIsVerified] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [id, setId] = useState<string>("");

  const login = (
    isVerified: string | undefined,
    role: string | undefined,
    id: string | undefined
  ) => {
    if (isVerified && role && id) {
      setIsVerified(isVerified);
      setRole(role);
      setId(id);
      saveState("user_id", id);
    }
  };

  const logout = () => {
    setIsVerified("");
    setRole("");
    setId("");
  };

  const { cookies } = useCookie();

  useEffect(() => {
    if (cookies.user_is_verified && cookies.user_role && cookies.user_id) {
      setIsVerified(cookies.user_is_verified);
      setRole(cookies.user_role);
      setId(cookies.user_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ isVerified, role, id, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
