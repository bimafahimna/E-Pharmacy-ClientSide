import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCookie } from "../../stores/CookieContext/useCookie";
import AdminSideNav from "../../components/AdminSideNav";
import style from "./index.module.css";
import { Helmet } from "react-helmet";

export default function AdminLayout(): JSX.Element {
  const navigate = useNavigate();
  const { cookies, removeCookie } = useCookie();

  const location = useLocation();

  useEffect(() => {
    const checkAdminCookies = () => {
      if (location.pathname === "/admin" || location.pathname === "/admin/") {
        navigate("/admin/users");
      }

      if (cookies.user_role !== "admin") {
        navigate("/home");
      }
    };

    checkAdminCookies();
  }, [cookies, navigate, removeCookie, location.pathname]);

  return (
    <>
      <Helmet>
        <title>Puxing - Admin</title>
      </Helmet>
      <div className={style.wrapper}>
        <AdminSideNav />
        <div className={style.outlet}>
          <div className={style.inner_outlet}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
