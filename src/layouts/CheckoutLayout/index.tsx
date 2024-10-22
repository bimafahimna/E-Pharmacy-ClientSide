import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCookie } from "../../stores/CookieContext/useCookie";
import { useEffect } from "react";
import TransactionNavbar from "../../components/TransactionNavbar";
import { invokeToast } from "../../utils/invokeToast";
import { errorHandler } from "../../errorHandler/errorHandler";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet";

export default function CheckoutLayout(): JSX.Element {
  const navigate = useNavigate();

  const location = useLocation();

  const { cookies, removeCookie } = useCookie();

  useEffect(() => {
    const checkCheckoutCookies = () => {
      if (!cookies.user_is_verified && !cookies.user_role) {
        navigate("/auth/login");
        return;
      } else {
        if (
          !cookies.user_is_verified ||
          cookies.user_is_verified.toString() !== "true"
        ) {
          errorHandler(
            new Error("You aren't verified, please verify your account first")
          );

          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }

        if (cookies.user_role !== "customer") {
          errorHandler(new Error("Unauthorized, not a customer"));
          navigate("/admin");
          return;
        }

        if (cookies.is_verified && cookies.user_role) {
          if (cookies.user_is_verified.toString() !== "true") {
            errorHandler(new Error("Unauthorized"));
            invokeToast("You are not verified", "info");
            invokeToast(
              "Please verify your account first by following the link in your email",
              "info"
            );
            invokeToast("Returning to homepage........", "info");

            setTimeout(() => {
              navigate("/home");
            }, 1000);
          }
        }
      }
    };

    if (location.pathname.startsWith("/checkout")) {
      checkCheckoutCookies();
    }
  }, [cookies, navigate, removeCookie, location.pathname]);

  return (
    <>
      <Helmet>
        <title>Puxing - Checkout</title>
      </Helmet>
      <TransactionNavbar />
      <Outlet />
      <Footer />
    </>
  );
}
