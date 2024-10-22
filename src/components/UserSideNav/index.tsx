import React, { useEffect, useState } from "react";
import style from "./index.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";

import { LiaUserEditSolid } from "react-icons/lia";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "../../stores/AuthContext/useAuth";
import { useCookie } from "../../stores/CookieContext/useCookie";
import { useLocation, useNavigate } from "react-router-dom";
import { errorHandler } from "../../errorHandler/errorHandler";
import { invokeToast } from "../../utils/invokeToast";
import { resetCartState } from "../../stores/CartPageReducer";
import { StoreDispatch } from "../../stores/store";
import { useDispatch } from "react-redux";
import { resetAddress } from "../../stores/ProfileReducer";

export default function UserSideNav(): JSX.Element {
  const { data } = useAppSelector((state) => state.profile);
  const AppDispatch = useAppDispatch();

  const { logout } = useAuth();
  const { removeCookie } = useCookie();
  const navigate = useNavigate();

  const dispatchRedux: StoreDispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const location = useLocation();

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

  const isAddress = location.pathname.endsWith("address");

  const handleChangeLocation = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`${e.currentTarget.name}`);
  };

  useEffect(() => {
    // AppDispatch(getAddresses()); //simulate fteching address
  }, [AppDispatch]);

  return (
    <div className={style.container}>
      <div className={style.account_wrapper}>
        <div className={style.account_info_wrapper}>
          <img
            className={style.account_info_photo}
            src={data.profile_photo_url}
            alt={data.profile_photo_url + "picture"}
          />
          <p className={style.account_info_name}>
            {"distressedElfButNotReally1000"}
            <button title="Edit Profile" className={style.edit_account}>
              <LiaUserEditSolid className={style.edit_account_logo} />
            </button>
          </p>
        </div>
      </div>

      <div className={style.list}>
        <button
          onClick={handleChangeLocation}
          className={isAddress ? style.list_item_active : style.list_item}
          name="/profile/address"
        >
          Address
        </button>
        <button
          onClick={handleChangeLocation}
          className={isAddress ? style.list_item : style.list_item_active}
          name="/profile/orders"
        >
          Orders
        </button>
        <button
          onClick={handleLogout}
          className={style.logout_button}
          title="Logout"
          disabled={isLoading}
        >
          <CiLogout />
          Logout
        </button>
      </div>
    </div>
  );
}
