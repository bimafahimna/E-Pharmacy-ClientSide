import React from "react";
import { CookieProvider } from "../../stores/CookieContext/cookieContext";
import { AuthContextProvider } from "../../stores/AuthContext/authContext";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppContextProvider = ({
  children,
}: AppProviderProps): JSX.Element => {
  return (
    <CookieProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </CookieProvider>
  );
};
