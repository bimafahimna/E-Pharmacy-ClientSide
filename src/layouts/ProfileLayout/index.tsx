import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCookie } from "../../stores/CookieContext/useCookie";
import { useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { invokeToast } from "../../utils/invokeToast";
import { errorHandler } from "../../errorHandler/errorHandler";
import UserSideNav from "../../components/UserSideNav";

import style from "./index.module.css";
import { Helmet } from "react-helmet";

export default function ProfileLayout(): JSX.Element {
  const navigate = useNavigate();

  const location = useLocation();

  const { cookies, removeCookie } = useCookie();

  useEffect(() => {
    const checkProfilePage = () => {
      if (!cookies.user_is_verified && !cookies.user_role) {
        invokeToast("Please log in first", "warning");
        navigate("/auth/login");
      } else if (cookies.user_is_verified && cookies.user_role) {
        if (cookies.user_role === "customer") {
          if (
            location.pathname === "/profile" ||
            location.pathname === "/profile/"
          ) {
            navigate("/profile/address");
          } else {
            return;
          }
        } else if (
          cookies.user_role === "admin" ||
          cookies.user_role === "pharmacist"
        ) {
          errorHandler(new Error("Unauthorized, not a customer"));
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        navigate("/home");
      }
    };

    checkProfilePage();
  }, [cookies, navigate, removeCookie, location.pathname]);

  return (
    <>
      <Helmet>
        <title>Puxing - Profile</title>
      </Helmet>
      <NavBar />
      <section className={style.profile_section}>
        <div className={style.after_section}>
          <UserSideNav />

          <Outlet />
        </div>
      </section>
      <Footer />
    </>
  );
}
