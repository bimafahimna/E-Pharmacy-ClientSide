import clsx from "clsx";
import style from "./index.module.css";
import { CiLogout } from "react-icons/ci";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { errorHandler } from "../../errorHandler/errorHandler";
import { invokeToast } from "../../utils/invokeToast";
import { useCookie } from "../../stores/CookieContext/useCookie";
import { useAuth } from "../../stores/AuthContext/useAuth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../stores/store";
import { resetAddress } from "../../stores/ProfileReducer";

export default function AdminSideNav(): JSX.Element {
  const { logout } = useAuth();
  const { removeCookie } = useCookie();
  const navigate = useNavigate();
  const navs = [
    {
      url: "/admin/users",
      title: "Users",
    },
    {
      url: "/admin/pharmacists",
      title: "Pharmacists",
    },
    {
      url: "/admin/partner",
      title: "Partner",
    },
    {
      url: "/admin/pharmacy",
      title: "Pharmacy",
    },
    {
      url: "/admin/products",
      title: "Products",
    },
  ];

  const location = useLocation();
  const locationIndex = navs.findIndex(
    (item) => item.url === location.pathname
  );

  const dispatchRedux: StoreDispatch = useDispatch();

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

  return (
    <>
      <nav className={style.wrapper}>
        <div className={style.title}>
          <div className={style.logo}>
            <h2>Puxing</h2>
            <p>Admin</p>
          </div>
          <p>admin@gmail.com</p>
        </div>

        <div className={style.links}>
          <div
            style={{
              position: "relative",
              backgroundColor: "var(--gray-color)",
              gridTemplateRows: `repeat(${navs.length}, 1fr)`,
            }}
            className={style.links_wrapper}
          >
            {navs.map((item, index) => {
              return (
                <div
                  className={clsx(style.link, {
                    [style.active]: item.url === location.pathname,
                  })}
                  key={index}
                >
                  <Link to={item.url}>{item.title}</Link>
                </div>
              );
            })}
            <div
              className={style.selection_third}
              style={{
                transform: `translateY(${locationIndex * 100}% )`,
                height: `${100 / navs.length}%`,
              }}
            ></div>
            <div
              className={style.selection_first}
              style={{
                transform: `translateY(${
                  locationIndex * (100 / navs.length)
                }% )`,
              }}
            ></div>
            <div
              className={style.selection_second}
              style={{
                transform: `translateY(${
                  locationIndex * (100 / navs.length) + 100 / navs.length
                }%)`,
              }}
            ></div>
          </div>
        </div>

        <div className={style.title}>
          <button
            onClick={handleLogout}
            className={style.logout_button}
            disabled={isLoading}
          >
            <CiLogout />
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
