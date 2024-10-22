import { useLocation } from "react-router-dom";
import Banner from "../../components/Banner";
import ProductCarousel from "../../components/ProductCarousel";
import ProductCategories from "../../components/ProductCategories";
import { useEffect } from "react";
import { saveState } from "../../utils/localStorageUtil";
import { useAuth } from "../../stores/AuthContext/useAuth";
import { useCookie } from "../../stores/CookieContext/useCookie";
import { Helmet } from "react-helmet";
import SearchPage from "../search";

export default function HomePage(): JSX.Element {
  const location = useLocation();

  const { role } = useAuth();

  const { cookies } = useCookie();

  useEffect(() => {
    if (role === "customer" && cookies.user_role === "customer") {
      saveState("lastVisitedPage", location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Helmet>
        <title>Puxing - Home</title>
      </Helmet>
      <Banner />
      <ProductCategories />
      <ProductCarousel />
      <SearchPage />
    </>
  );
}
