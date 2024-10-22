import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { RootState, StoreDispatch } from "../../stores/store";
import { useSelector } from "react-redux";
import {
  getPaginatedRequest,
  shopProduct,
  userSearchParam,
} from "../../utils/types";
import { useDispatch } from "react-redux";
import {
  getHomePageData,
  getMoreSearchData,
  getSearchData,
  setSearchLatLong,
} from "../../stores/SearchReducer";
import style from "./index.module.css";
import { useCookie } from "../../stores/CookieContext/useCookie";
import LoaderDots from "../../components/Spinners/dots";
import ProductCard from "../../components/ProductCard";
import { errorHandler } from "../../errorHandler/errorHandler";
import { Helmet } from "react-helmet";
import {
  setGlobalLoading,
  setMustFetch,
} from "../../stores/GlobalLoadingReducer";

export default function SearchPage(): JSX.Element {
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const [dataParams, setGetDataParams] = useState<userSearchParam>({
    query: "obat",
    limit: 0,
    page: 1,
    latitude: "",
    longitude: "",
  });

  const { chosenAddress, isGet } = useSelector(
    (state: RootState) => state.profile
  );

  const {
    userSearchParam,
    searchPageData,
    searchPagePagination,
    homePageDataLoading,
    homePageData,
    searchPageDataError,
    searchPageDataLoading,
  } = useSelector((state: RootState) => state.searchProduct);

  const { globalIsLoading, mustfetch } = useSelector(
    (state: RootState) => state.globalLoading
  );

  const dispatchRedux: StoreDispatch = useDispatch();

  const isHomePage = location.pathname.startsWith("/home");

  const { cookies } = useCookie();

  const isUserLoggedIn = cookies.user_role === "customer";

  const isAddressValid = !(
    chosenAddress === undefined || chosenAddress === null
  );

  const handleLoadMoreData = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (searchPagePagination?.next_page === true) {
        const controller = new AbortController();
        const signal = controller.signal;

        const newPage = Number(e.currentTarget.name.split("_")[0]) + 1;

        dispatchRedux(
          getMoreSearchData({ ...dataParams, page: newPage, signal })
        ).then((result) => {
          if (typeof result.payload === "object") {
            const payload: getPaginatedRequest<shopProduct> = result.payload;

            setGetDataParams((prevValue) => ({
              ...prevValue,
              query: searchParams.get("s") || "",
              limit: 20,
              page: payload.pagination.current_page,
            }));
          }
        });
      } else {
        throw new Error(
          "No more product is available, search for something else ?"
        );
      }
    } catch (error) {
      errorHandler(new Error(error as string));
    }
  };

  useEffect(() => {
    if (
      searchPageDataError !== null &&
      !searchPageDataError.includes("aborted")
    ) {
      errorHandler(new Error(searchPageDataError));
    } else {
      return;
    }
  }, [searchPageDataError]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (isHomePage) {
      if (isUserLoggedIn) {
        if (isGet && isAddressValid) {
          setGetDataParams((prevValue) => ({
            ...prevValue,
            latitude: chosenAddress.latitude.toString(),
            longitude: chosenAddress.longitude.toString(),
          }));

          dispatchRedux(
            setSearchLatLong({
              latitude: chosenAddress.latitude.toString(),
              longitude: chosenAddress.longitude.toString(),
            })
          );

          dispatchRedux(
            getHomePageData({
              query: "obat",
              limit: 0,
              page: 1,
              latitude: chosenAddress.latitude.toString(),
              longitude: chosenAddress.longitude.toString(),
              signal,
            })
          ).then(() => {
            dispatchRedux(setGlobalLoading(false));
            dispatchRedux(setMustFetch(false));
          });
          // .finally(() => {
          //   dispatchRedux(setGlobalLoading(false));
          //   dispatchRedux(setMustFetch(false));
          // });
        } else if (isGet && !isAddressValid) {
          dispatchRedux(getHomePageData({ ...dataParams, signal })).then(() => {
            dispatchRedux(setGlobalLoading(false));
            dispatchRedux(setMustFetch(false));
          });
          // .finally(() => {
          //   dispatchRedux(setGlobalLoading(false));
          //   dispatchRedux(setMustFetch(false));
          // });
        }
      } else {
        dispatchRedux(getHomePageData({ ...dataParams, signal })).then(() => {
          dispatchRedux(setGlobalLoading(false));
          dispatchRedux(setMustFetch(false));
        });
        // .finally(() => {
        //   dispatchRedux(setGlobalLoading(false));
        //   dispatchRedux(setMustFetch(false));
        // });
      }
    }

    return () => {
      controller.abort();
    };
  }, [isGet, cookies.role]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (!isHomePage) {
      if (isUserLoggedIn) {
        if (isGet && isAddressValid) {
          if (mustfetch) {
            dispatchRedux(
              getSearchData({
                ...userSearchParam,
                query: searchParams.get("s") || "obat",
                limit: 20,
                page: 1,
                latitude: `${chosenAddress.latitude}`,
                longitude: `${chosenAddress.longitude}`,
                signal,
              })
            )
              .then((result) => {
                if (typeof result.payload === "object") {
                  const payload: getPaginatedRequest<shopProduct> =
                    result.payload;

                  if (payload.message[0] === "S") {
                    dispatchRedux(setGlobalLoading(false));
                    dispatchRedux(setMustFetch(false));
                    setGetDataParams((prevValue) => ({
                      ...prevValue,
                      query: searchParams.get("s") || "obat",
                      limit: 20,
                      page: payload.pagination.current_page,
                    }));
                  }
                }
              })
              .finally(() => {
                dispatchRedux(setGlobalLoading(false));
                dispatchRedux(setMustFetch(false));
              });
          }
        } else if (isGet && !isAddressValid) {
          if (mustfetch) {
            dispatchRedux(
              getSearchData({
                ...userSearchParam,
                query: searchParams.get("s") || "obat",
                limit: 20,
                page: 1,
                signal,
              })
            )
              .then((result) => {
                if (typeof result.payload === "object") {
                  const payload: getPaginatedRequest<shopProduct> =
                    result.payload;

                  if (payload.message[0] === "S") {
                    dispatchRedux(setGlobalLoading(false));
                    dispatchRedux(setMustFetch(false));
                    setGetDataParams((prevValue) => ({
                      ...prevValue,
                      query: searchParams.get("s") || "obat",
                      limit: 20,
                      page: payload.pagination.current_page,
                    }));
                  }
                }
              })
              .finally(() => {
                dispatchRedux(setGlobalLoading(false));
                dispatchRedux(setMustFetch(false));
              });
          }
        }
      } else {
        if (mustfetch) {
          dispatchRedux(
            getSearchData({
              ...userSearchParam,
              query: searchParams.get("s") || "obat",
              limit: 20,
              page: 1,
              signal,
            })
          )
            .then((result) => {
              if (typeof result.payload === "object") {
                const payload: getPaginatedRequest<shopProduct> =
                  result.payload;

                if (payload.message[0] === "S") {
                  dispatchRedux(setGlobalLoading(false));
                  dispatchRedux(setMustFetch(false));

                  setGetDataParams((prevValue) => ({
                    ...prevValue,
                    query: searchParams.get("s") || "obat",
                    limit: 20,
                    page: payload.pagination.current_page,
                  }));
                }
              }
            })
            .finally(() => {
              dispatchRedux(setGlobalLoading(false));
              dispatchRedux(setMustFetch(false));
            });
        }
      }
    }

    return () => {
      controller.abort();
    };
  }, [isGet, searchParams.get("s"), cookies.role]);

  return (
    <>
      <Helmet>
        <title>
          {isHomePage
            ? "Puxing - home"
            : `Puxing - search ${
                searchParams.get("s") !== null ? searchParams.get("s") : ""
              }`}
        </title>
      </Helmet>
      <section className={style.search_section}>
        <div
          className={
            isHomePage ? style.after_section : style.after_section_search
          }
        >
          <p className={style.section_title}>
            {isHomePage ? "Available Products" : "Search Result"}
          </p>

          {isHomePage ? (
            homePageDataLoading || globalIsLoading ? (
              <LoaderDots />
            ) : homePageData.length === 0 ? (
              <p className={style.empty_section}>
                There are no Pharmacy near you, consider changing location
              </p>
            ) : (
              <div className={style.card_wrapper}>
                {homePageData.map((product, index) => {
                  return (
                    <ProductCard
                      key={index + "productCards"}
                      product={product}
                      index={index}
                      parentProduct={homePageData}
                    />
                  );
                })}
              </div>
            )
          ) : (searchPageDataLoading && searchPagePagination == null) ||
            globalIsLoading ||
            searchPageDataLoading ? (
            <LoaderDots />
          ) : searchPageData.length === 0 ? (
            <p className={style.empty_section}>
              Product not found, search for something else?
            </p>
          ) : (
            <>
              <div className={style.card_wrapper}>
                {searchPageData.map((product, index) => {
                  return (
                    <ProductCard
                      key={index + "productCards"}
                      product={product}
                      index={index}
                      parentProduct={searchPageData}
                    />
                  );
                })}
              </div>

              {(searchPageDataLoading &&
                searchPagePagination !== null &&
                searchPagePagination.current_page + 1 > 1) ||
              globalIsLoading ? (
                <LoaderDots />
              ) : searchPagePagination?.next_page === false ? (
                "There are no more product available, search for something else"
              ) : (
                <button
                  onClick={handleLoadMoreData}
                  className={style.load_more_button}
                  name={
                    searchPagePagination?.current_page + "_next page button"
                  }
                >
                  Load more data
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
