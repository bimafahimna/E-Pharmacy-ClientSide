import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCookie } from "../../stores/CookieContext/useCookie";
import style from "./index.module.css";
import PharmacistSideNav from "../../components/PharmacistSideNav";
import { Helmet } from "react-helmet";

export default function PharmacistLayout(): JSX.Element {
  const navigate = useNavigate();
  const { cookies, removeCookie } = useCookie();

  const location = useLocation();

  useEffect(() => {
    const checkAdminCookies = () => {
      if (
        location.pathname === "/pharmacist" ||
        location.pathname === "/pharmacist/"
      ) {
        navigate("/pharmacist/products");
      }

      if (cookies.user_role !== "pharmacist") {
        navigate("/home");
      }
    };

    checkAdminCookies();
  }, [cookies, navigate, removeCookie, location.pathname]);

  return (
    <>
      <Helmet>
        <title>Puxing - Pharmacist Management</title>
      </Helmet>
      <div className={style.wrapper}>
        <PharmacistSideNav />
        <div className={style.outlet}>
          <div className={style.inner_outlet}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
