import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import style from "./index.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../stores/store";
import { useDispatch } from "react-redux";
import {
  fetchPopularProductsData,
  getPopularProductsDataWithLocation,
} from "../../stores/ProductReducer";
import { errorHandler } from "../../errorHandler/errorHandler";
import { useCookie } from "../../stores/CookieContext/useCookie";
import LoaderDots from "../Spinners/dots";
import { useAppSelector } from "../../hooks/useApp";
import ProductCardCarousel from "../ProductCardCarousel";

export default function ProductCarousel(): JSX.Element {
  const { cookies } = useCookie();
  const { shopPopularData, shopLoading, shopError } = useSelector(
    (state: RootState) => state.product
  );

  const { chosenAddress, isGet } = useAppSelector((state) => state.profile);

  const dispatchRedux: StoreDispatch = useDispatch();

  const [page, setPage] = useState(1);
  const popularProductsLength = shopPopularData.length;
  const maxPage = Math.ceil(popularProductsLength / 4);

  const isAddressValid = !(
    chosenAddress === undefined || chosenAddress === null
  );

  const handlePrevClick = () => {
    setPage((page) => (page - 1 < 1 ? page : page - 1));
  };

  const handleNextClick = () => {
    setPage((page) => (page + 1 > maxPage ? page : page + 1));
  };

  useEffect(() => {
    if (shopError !== null && !shopError.includes("aborted")) {
      errorHandler(new Error(shopError));
    } else {
      return;
    }
  }, [shopError]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (cookies.user_role === "customer") {
      if (isGet && isAddressValid) {
        dispatchRedux(
          getPopularProductsDataWithLocation({
            latitude: chosenAddress.latitude.toString(),
            longitude: chosenAddress.longitude.toString(),
            signal,
          })
        );
      } else if (isGet && !isAddressValid) {
        dispatchRedux(fetchPopularProductsData(signal));
      }
    } else {
      dispatchRedux(fetchPopularProductsData(signal));
    }

    return () => {
      controller.abort();
    };
  }, [isGet, cookies.user_role]);

  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "var(--gray-color)",
        paddingBottom: "2rem",
        paddingTop: "1rem",
      }}
    >
      <h2
        style={{ paddingBottom: "1rem", paddingTop: "1rem", fontWeight: "500" }}
      >
        Popular
      </h2>
      <div style={{ position: "relative" }}>
        <div className={style.products_wrapper}>
          <div
            className={style.products}
            style={{
              transform: `translateX(calc( -${(page - 1) * 100}% + ${
                (page - 1) * 2
              }rem))`,
            }}
          >
            {shopLoading ? (
              <div className={style.empty_section}>
                <LoaderDots />
              </div>
            ) : shopPopularData.length === 0 ? (
              <p className={style.empty_section}>
                No product available currently, please try again later
              </p>
            ) : (
              shopPopularData.map((product, index) => (
                <ProductCardCarousel
                  key={index + "productCards"}
                  product={product}
                  index={index}
                  parentProduct={shopPopularData}
                />
              ))
            )}
          </div>
        </div>
        <button
          aria-label="previous items on most popular carousel"
          className={style.left_carousel_button}
          onClick={handlePrevClick}
          name="previous items on most popular carousel"
        >
          <IoIosArrowBack />
        </button>
        <button
          aria-label="next items on most popular carousel"
          className={style.right_carousel_button}
          onClick={handleNextClick}
          name="next items on most popular carousel"
        >
          <IoIosArrowForward />
        </button>
      </div>
    </section>
  );
}
