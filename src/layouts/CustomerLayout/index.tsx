import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCookie } from "../../stores/CookieContext/useCookie";
import { useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { invokeToast } from "../../utils/invokeToast";
import { errorHandler } from "../../errorHandler/errorHandler";
import { Helmet } from "react-helmet";
import { StoreDispatch } from "../../stores/store";
import { useDispatch } from "react-redux";
import { resetAddress } from "../../stores/ProfileReducer";
import { resetCartState } from "../../stores/CartPageReducer";

export default function CustomerLayout(): JSX.Element {
  const navigate = useNavigate();

  const location = useLocation();

  const { cookies, removeCookie } = useCookie();

  const dispatchRedux: StoreDispatch = useDispatch();

  useEffect(() => {
    const checkAndRemoveExpiredCookies = () => {
      if (cookies.user_is_verified && cookies.user_role) {
        if (cookies.user_role === "customer") {
          navigate("/home");
        } else if (cookies.user_role === "admin") {
          navigate("/admin/pharmacists");
        } else if (cookies.user_role === "pharmacist") {
          navigate("/pharmacist/products");
        } else {
          dispatchRedux(resetAddress());
          dispatchRedux(resetCartState());
          navigate("/home");
        }
      } else {
        navigate("/home");
      }
    };

    const checkProfilePage = () => {
      if (!cookies.user_is_verified && !cookies.user_role) {
        invokeToast("Please log in first", "warning");
        navigate("/auth/login");
      } else if (cookies.user_is_verified && cookies.user_role) {
        if (cookies.user_role === "customer") {
          navigate("/profile/address");
        } else if (
          cookies.user_role === "admin" ||
          cookies.user_role === "pharmacist"
        ) {
          errorHandler(new Error("Unauthorized, not a customer"));
          navigate("/admin");
        } else {
          dispatchRedux(resetAddress());
          dispatchRedux(resetCartState());
          navigate("/home");
        }
      } else {
        navigate("/home");
      }
    };

    if (location.pathname === "/" || location.pathname === "/home") {
      checkAndRemoveExpiredCookies();
    }

    if (location.pathname === "/profile") {
      checkProfilePage();
    }
  }, [cookies, navigate, removeCookie, location.pathname, dispatchRedux]);

  return (
    <>
      <Helmet>
        <title>Puxing - Home</title>
      </Helmet>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}
