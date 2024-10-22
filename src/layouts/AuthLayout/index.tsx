import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCookie } from "../../stores/CookieContext/useCookie";
import { useAuth } from "../../stores/AuthContext/useAuth";
import { Helmet } from "react-helmet";

export default function AuthLayout(): JSX.Element {
  const navigate = useNavigate();

  const location = useLocation();

  const { cookies, removeCookie } = useCookie();

  const { isVerified, role, login } = useAuth();

  useEffect(() => {
    const checkLoginContext = () => {
      if (isVerified && role) {
        if (role === "customer") {
          navigate("/home");
        } else if (role === "admin") {
          navigate("/admin");
        } else if (role === "pharmacist") {
          navigate("/pharmacist");
        }
      } else {
        navigate("/auth/login");
      }
    };

    const checkLoginCookies = () => {
      if (
        cookies.user_is_verified !== undefined &&
        cookies.user_role !== undefined
      ) {
        login(
          cookies.user_is_verified.toString(),
          cookies.user_role,
          cookies.user_id
        );
        if (cookies.user_role === "customer") {
          navigate("/home");
        } else if (cookies.user_role === "admin") {
          navigate("/admin");
        } else if (cookies.user_role === "pharmacist") {
          navigate("/pharmacist");
        }
      } else {
        navigate("/auth/login");
      }
    };

    const checkRegisterContext = () => {
      if (isVerified && role) {
        if (role === "customer") {
          navigate("/home");
        } else if (role === "admin") {
          navigate("/admin");
        } else if (role === "pharmacist") {
          navigate("/pharmacist");
        }
      } else {
        navigate("/auth/register");
      }
    };

    const checkRegisterCookies = () => {
      if (
        cookies.user_is_verified !== undefined &&
        cookies.user_role !== undefined
      ) {
        login(
          cookies.user_is_verified.toString(),
          cookies.user_role,
          cookies.user_id
        );
        if (cookies.user_role === "customer") {
          navigate("/home");
        } else if (cookies.user_role === "admin") {
          navigate("/admin");
        } else if (cookies.user_role === "pharmacist") {
          navigate("/pharmacist");
        }
      } else {
        navigate("/auth/register");
      }
    };

    const checkVerifyContext = () => {
      if (isVerified && role) {
        if (isVerified.toString() === "true") {
          if (role === "customer") {
            navigate("/home");
          } else if (role === "admin") {
            navigate("/admin");
          } else if (role === "pharmacist") {
            navigate("/pharmacist");
          }
        } else {
          navigate("/auth/login");
        }
      }
    };

    const checkCookiesVerify = () => {
      if (cookies.user_is_verified && cookies.user_role) {
        login(
          cookies.user_is_verified.toString(),
          cookies.user_role,
          cookies.user_id
        );
        if (cookies.user_is_verified.toString() === "true") {
          if (cookies.user_role === "customer") {
            navigate("/home");
          } else if (
            cookies.user_role === "admin" ||
            cookies.user_role === "pharmacist"
          ) {
            navigate("/auth/login");
          }
        }
      }
    };

    if (location.pathname.startsWith("/auth/register")) {
      checkRegisterContext();
      checkRegisterCookies();
    }

    if (location.pathname.startsWith("/auth/login")) {
      checkLoginContext();
      checkLoginCookies();
    }

    if (location.pathname.startsWith("/auth/verify-account")) {
      checkVerifyContext();
      checkCookiesVerify();
    }

    if (location.pathname === "/auth" || location.pathname.endsWith("/")) {
      navigate("/auth/login");
    }
  }, [
    cookies,
    navigate,
    removeCookie,
    location.pathname,
    isVerified,
    role,
    login,
  ]);

  return (
    <>
      <Helmet>
        <title>Puxing - Auth</title>
      </Helmet>
      <Outlet />
    </>
  );
}
