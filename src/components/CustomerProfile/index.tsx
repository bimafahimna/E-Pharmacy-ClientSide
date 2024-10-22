import { useAppSelector } from "../../hooks/useApp";
import { Link, useNavigate } from "react-router-dom";
import style from "./index.module.css";
import { useCookie } from "../../stores/CookieContext/useCookie";
import { StoreDispatch } from "../../stores/store";
import { useDispatch } from "react-redux";
import { resetCartState } from "../../stores/CartPageReducer";
import { errorHandler } from "../../errorHandler/errorHandler";
import { invokeToast } from "../../utils/invokeToast";
import { useAuth } from "../../stores/AuthContext/useAuth";
import { useState } from "react";
import { resetAddress } from "../../stores/ProfileReducer";
export default function CustomerProfile(): JSX.Element {
  const { cookies, removeCookie } = useCookie();
  const { data } = useAppSelector((state) => state.profile);
  const { logout } = useAuth();
  const dispatchRedux: StoreDispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + "/logout", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      invokeToast(data.message, "success");

      dispatchRedux(resetCartState());
      removeCookie("user_is_verified", {
        path: "/",
        secure: true,
        sameSite: "none",
      });
      removeCookie("user_role", {
        path: "/",
        secure: true,
        sameSite: "none",
      });
      removeCookie("user_id", {
        path: "/",
        secure: true,
        sameSite: "none",
      });
      logout();
      dispatchRedux(resetAddress());
      navigate("/home");
    } catch (error) {
      if (error instanceof Error) {
        errorHandler(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToAddress = () => {
    if (
      cookies.user_is_verified.toString() !== "true" ||
      cookies.user_role !== "customer"
    ) {
      errorHandler(new Error("Please verify your account first"));
      return;
    }
    navigate("/profile/address");
  };

  const handleToOrders = () => {
    if (
      cookies.user_is_verified.toString() !== "true" ||
      cookies.user_role !== "customer"
    ) {
      errorHandler(new Error("Please verify your account first"));
      return;
    }
    navigate("/profile/orders");
  };

  if (cookies.user_is_verified === undefined && cookies.user_role === undefined)
    return (
      <Link to="/auth/login" className={style.signin_button}>
        Sign In
      </Link>
    );
  return (
    <>
      <div className={style.customer_profile_wrapper}>
        <div className={style.customer_profile}>
          {!(
            data.profile_photo_url === undefined ||
            data.profile_photo_url === null ||
            data.profile_photo_url === ""
          ) ? (
            <img
              className={style.customer_profile_image}
              src={data.profile_photo_url}
              alt="User Profile Photo"
            />
          ) : (
            <div className={style.customer_profile_image}>{data.email[0]}</div>
          )}
        </div>
        <div className={style.dropdown_menu}>
          <div style={{ zIndex: 103 }}>
            <div className={style.triangle}></div>
          </div>
          <div className={style.dropdown_menu_items}>
            <button className={style.item_button} onClick={handleToAddress}>
              My Profile
            </button>
            <hr />
            <button className={style.item_button} onClick={handleToOrders}>
              My Orders
            </button>
            <hr />
            <button
              onClick={handleLogout}
              className={style.logout_button}
              disabled={isLoading}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
