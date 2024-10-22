import { useContext } from "react";
import { AddressFormContext, AddressFormContextProps } from ".";

export const useAddressForm = (): AddressFormContextProps => {
  const context = useContext(AddressFormContext);
  if (!context) {
    throw new Error("useAddressForm must be used within a AuthContextProvider");
  }
  return context;
};
