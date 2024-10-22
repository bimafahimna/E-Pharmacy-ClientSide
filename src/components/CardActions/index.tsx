import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";

import style from "./index.module.css";
import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import LoaderDots from "../Spinners/dots";

export default function CardActions({
  handleAddQuantity,
  handleReduceQuantity,
  handleChangeQuantity,
  handleOnBlur,
  handleDeleteCart,
  productQuantity,
  pharmacy_id,
  product_id,
  isDisabled,
}: {
  handleAddQuantity: (
    pharmacy_id: number,
    product_id: number,
    quantity: number | ""
  ) => void;
  handleReduceQuantity: (
    pharmacy_id: number,
    product_id: number,
    quantity: number | ""
  ) => void;
  handleChangeQuantity: React.ChangeEventHandler<HTMLInputElement>;
  handleOnBlur: React.FocusEventHandler<HTMLInputElement>;
  handleDeleteCart: (pharmacy_id: number, product_id: number) => void;
  productQuantity: number | "";
  pharmacy_id: number;
  product_id: number;
  isDisabled: boolean;
}): JSX.Element {
  const location = useLocation();

  const notCartPage = !location.pathname.startsWith("/cart");

  const { cartPageDataLoading } = useSelector(
    (state: RootState) => state.cartPage
  );

  return (
    <div className={notCartPage ? style.cardActionsNc : style.cardActions}>
      {cartPageDataLoading ? (
        <div className={style.loadingWrapper}>
          <LoaderDots />
        </div>
      ) : (
        <>
          <button
            aria-label={`delete product ${product_id} from your cart`}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCart(pharmacy_id, product_id);
            }}
            className={style.deleteButton}
            name={`delete product ${product_id} from your cart`}
          >
            <FaTrash className={style.deleteIcon} />
          </button>

          <div className={style.qty}>
            <button
              aria-label={`remove product ${product_id} by one from your cart`}
              onClick={(e) => {
                e.stopPropagation();
                handleReduceQuantity(pharmacy_id, product_id, productQuantity);
              }}
              className={style.minusButton}
              disabled={isDisabled}
              name={`remove product ${product_id} by one from your cart`}
            >
              <FaMinus className={style.minusIcon} />
            </button>

            <input
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={handleChangeQuantity}
              onBlur={handleOnBlur}
              type="number"
              className={style.quantityInput}
              value={productQuantity || "" || 0}
              name={`${pharmacy_id.toString()}_${product_id.toString()}`}
              disabled={isDisabled}
            />

            <button
              aria-label={`add product ${product_id} by one from your cart`}
              onClick={(e) => {
                e.stopPropagation();
                handleAddQuantity(pharmacy_id, product_id, productQuantity);
              }}
              className={style.plusButton}
              disabled={isDisabled}
              name={`add product ${product_id} by one to your cart`}
            >
              <FaPlus className={style.plusIcon} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
