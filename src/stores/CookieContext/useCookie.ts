import { useContext } from "react";
import { CookieContext, CookieContextType } from "./cookieContext";

export const useCookie = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error("useCookie must be used within a CookieProvider");
  }
  return context;
};
