import { FaSearch } from "react-icons/fa";
import style from "./index.module.css";
import Input from "../Input";
import Form from "../Form";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { RootState, StoreDispatch } from "../../stores/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../../stores/SearchReducer";
import { useEffect, useState } from "react";
import {
  setGlobalLoading,
  setMustFetch,
} from "../../stores/GlobalLoadingReducer";
import { errorHandler } from "../../errorHandler/errorHandler";

export default function SearchBar(): JSX.Element {
  const navigate = useNavigate();

  const location = useLocation();

  const isHomePage = location.pathname.startsWith("/home");

  const { userSearchParam, searchPageDataLoading } = useSelector(
    (state: RootState) => state.searchProduct
  );

  const { globalIsLoading } = useSelector(
    (state: RootState) => state.globalLoading
  );

  const [searchParams] = useSearchParams();

  const dispatchRedux: StoreDispatch = useDispatch();

  const [debouncedValue, setDebouncedValue] = useState(userSearchParam.query);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      dispatchRedux(setSearchQuery(debouncedValue));
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [debouncedValue, dispatchRedux]);

  useEffect(() => {
    if (searchParams.get("s") !== null) {
      dispatchRedux(setSearchQuery(searchParams.get("s") || ""));
      setDebouncedValue(searchParams.get("s") || "");
    }
  }, [searchParams.get("s")]);

  const isSearchParamPresent = searchParams.has("s");

  useEffect(() => {
    if (!isSearchParamPresent) {
      navigate(`/search?s=obat`, { replace: true });
    }
  }, [isSearchParamPresent, navigate]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDebouncedValue(e.currentTarget.value);
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (debouncedValue === searchParams.get("s")) {
      return;
    }

    if (!isHomePage) {
      if (
        !debouncedValue.split(" ").join("") ||
        !searchParams.get("s")?.split(" ").join("")
      ) {
        errorHandler(new Error("Please fill something in the search bar"));
        return;
      }
    } else {
      if (!debouncedValue.split(" ").join("")) {
        errorHandler(new Error("Please fill something in the search bar"));
        return;
      }
    }

    dispatchRedux(setGlobalLoading(true));
    dispatchRedux(setMustFetch(true));

    window.scroll(0, 0);

    navigate(`/search?s=${debouncedValue}`);
  };

  return (
    <>
      <Form
        aria-disabled={
          !isHomePage && (searchPageDataLoading || globalIsLoading)
        }
        onSubmit={handleOnSubmit}
        className={style.search_bar}
      >
        <Input
          type="text"
          placeholder="Search for medicine here"
          className={style.search_input}
          onChange={handleOnChange}
          value={debouncedValue}
        />
        <button
          aria-label="search for products"
          name="search for products"
          className={style.search_button}
          aria-disabled={
            !isHomePage && (searchPageDataLoading || globalIsLoading)
          }
          disabled={!isHomePage && (searchPageDataLoading || globalIsLoading)}
        >
          <FaSearch className={style.search_icon} />
        </button>
      </Form>
    </>
  );
}
