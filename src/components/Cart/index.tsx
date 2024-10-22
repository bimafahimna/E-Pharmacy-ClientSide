import { IoMdCart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import style from "./index.module.css";
import { useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../stores/store";
import { errorHandler } from "../../errorHandler/errorHandler";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import { useEffect, useState } from "react";
import { getAddresses } from "../../stores/ProfileReducer";
import Modal from "../Modal";
import AddressFormContextProvider from "../../stores/AddressFormContext";
import AddressForm from "../AddressForm";
import { invokeToast } from "../../utils/invokeToast";
import { useCookie } from "../../stores/CookieContext/useCookie";
import { useDispatch } from "react-redux";
import { fetchUserCartData } from "../../stores/CartPageReducer";

export default function Cart(): JSX.Element {
  const { cartPageTrimmedData } = useSelector(
    (state: RootState) => state.cartPage
  );

  const [open, onRequestClose] = useState(false);

  const navigate = useNavigate();

  const { cookies } = useCookie();

  const { data } = useAppSelector((state) => state.profile);
  const AppDispatch = useAppDispatch();

  const dispatchRedux: StoreDispatch = useDispatch();

  const handleShowAlert = () => {
    if (
      cookies.user_role === undefined ||
      cookies.user_is_verified === undefined
    ) {
      errorHandler(new Error("Unauthorized, please log in first"));
      navigate("/auth/login");
      return;
    } else if (
      cookies.user_is_verified.toString() === "true" &&
      cookies.user_role === "customer"
    ) {
      if (data.profile_addresses.length === 0) {
        invokeToast("Please fill your address first", "info");
        onRequestClose(true);
        return;
      }
      navigate("/cart");
    } else if (
      cookies.user_is_verified.toString() === "false" &&
      cookies.user_role === "customer"
    ) {
      errorHandler(new Error("Please verify your account first"));
    }
  };

  useEffect(() => {
    if (
      (cookies.user_is_verified && cookies.user_role === "customer") ||
      (cookies.user_role === "customer" &&
        cookies.user_is_verified.toString() === "true")
    ) {
      AppDispatch(getAddresses());

      if (cartPageTrimmedData.length === 0) {
        dispatchRedux(fetchUserCartData());
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button
        aria-label="to your cart"
        name="to your cart"
        onClick={handleShowAlert}
        className={style.cart}
      >
        <div
          className={
            cartPageTrimmedData.length === 0 ? "" : style.cart_notification
          }
        >
          {cartPageTrimmedData.length === 0 ? "" : cartPageTrimmedData.length}
        </div>
        <IoMdCart className={style.cart_icon} />
      </button>

      <Modal onRequestClose={onRequestClose} shouldShow={open}>
        <AddressFormContextProvider onRequestClose={onRequestClose}>
          <AddressForm onRequestClose={onRequestClose} />
        </AddressFormContextProvider>
      </Modal>
    </>
  );
}
