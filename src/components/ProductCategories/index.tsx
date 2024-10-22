import { useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../stores/store";
import style from "./index.module.css";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useDispatch } from "react-redux";
import {
  setGlobalLoading,
  setMustFetch,
} from "../../stores/GlobalLoadingReducer";

export default function ProductCategories(): JSX.Element {
  const { categoryData } = useSelector((state: RootState) => state.category);

  const navigate = useNavigate();

  const dispatchRedux: StoreDispatch = useDispatch();

  const handleOnClickCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatchRedux(setGlobalLoading(true));
    dispatchRedux(setMustFetch(true));

    window.scroll(0, 0);
    navigate(`/search?s=${e.currentTarget.name}`);
  };

  return (
    <>
      <section
        style={{
          paddingBottom: "1rem",
          paddingTop: "1rem",
        }}
      >
        <h2
          style={{
            paddingBottom: "1rem",
            paddingTop: "1rem",
            fontWeight: "500",
          }}
        >
          Categories
        </h2>
        <div className={style.product_categories_container}>
          <div className={style.product_categories}>
            {categoryData.map((item, index) => (
              <button
                title={item}
                className={style.product_category_card}
                key={index}
                name={item}
                onClick={handleOnClickCategory}
              >
                <p>{item}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
