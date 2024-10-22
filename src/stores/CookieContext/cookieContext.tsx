import React, { createContext } from "react";
import { useCookies } from "react-cookie";

export interface CookieContextType {
  cookies: Record<string, string>;
  setCookie: (name: string, value: string, options?: object) => void;
  removeCookie: (name: string, options?: object) => void;
  saveDataInCookies: (
    isVerified: string | undefined,
    role: string | undefined,
    id: string | undefined
  ) => void;
}

export const CookieContext = createContext<CookieContextType | undefined>(
  undefined
);

export const CookieProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies();

  function saveDataInCookies(
    isVerified: string | undefined,
    role: string | undefined,
    id: string | undefined
  ) {
    const expiryDate = new Date();
    expiryDate.setMinutes(
      expiryDate.getMinutes() +
        import.meta.env.VITE_EXPIRY_FRONTEND_TOKEN_MINUTES
    );
    setCookie("user_is_verified", isVerified, {
      path: "/",
      expires: expiryDate,
      secure: true,
      sameSite: "none",
    });
    setCookie("user_role", role, {
      path: "/",
      expires: expiryDate,
      secure: true,
      sameSite: "none",
    });
    setCookie("user_id", id, {
      path: "/",
      expires: expiryDate,
      secure: true,
      sameSite: "none",
    });
  }

  return (
    <CookieContext.Provider
      value={{
        cookies,
        setCookie,
        removeCookie,
        saveDataInCookies,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};
