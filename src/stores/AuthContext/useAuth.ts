import { useContext } from "react";
import { AuthContext, AuthContextProps } from "./authContext";

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within a AuthContextProvider");
  }
  return context;
};
