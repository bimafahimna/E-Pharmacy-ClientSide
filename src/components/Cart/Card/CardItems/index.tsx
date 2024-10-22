import style from "./index.module.css";
import { cartItemsPersisted, cartTrimmedData } from "../../../../utils/types";
import FormatPrice from "../../../../utils/formatNumber";
import CardActions from "../../../CardActions";
import React from "react";

export default function CardItems({
  handleOnChangeItemCheckbox,
  handleAddQuantity,
  handleReduceQuantity,
  handleChangeQuantity,
  handleOnBlur,
  handleDeleteCart,
  handleToProductDetails,
  data,
  trimmedData,
  isDisabled,
}: {
  handleOnChangeItemCheckbox: React.ChangeEventHandler<HTMLInputElement>;
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
  handleToProductDetails: (pharmacy_id: number, product_id: number) => void;
  data: cartItemsPersisted;
  trimmedData: cartTrimmedData | undefined;
  isDisabled: boolean;
}): JSX.Element {
  return (
    <div className={style.cardItems}>
      <div
        className={isDisabled ? style.cardDetailsDisabled : style.cardDetails}
      >
        <div className={style.productDetailsWrapper}>
          <input
            onChange={handleOnChangeItemCheckbox}
            className={style.checkbox}
            type="checkbox"
            name={`${data.pharmacy_id}_${data.product_id}`}
            checked={data.is_selected_item}
            disabled={isDisabled}
          />
          <div
            title="see product details"
            onClick={() => {
              handleToProductDetails(data.pharmacy_id, data.product_id);
            }}
            className={style.productDetails}
          >
            <img
              src={data.image_url}
              alt={data.name}
              className={style.productImage}
            />
            <div>
              <p className={style.productTitle}>
                {data.name}{" "}
                {isDisabled ? "Item Unavailable, Please Remove the item" : ""}
              </p>
              <p className={style.productDesc}>per-{data.selling_unit}</p>
              <p className={style.productPrice}>{FormatPrice(data.price)}</p>
              <p className={style.productDesc}>{data.description}</p>
            </div>
          </div>
        </div>
      </div>

      <CardActions
        handleAddQuantity={handleAddQuantity}
        handleReduceQuantity={handleReduceQuantity}
        handleChangeQuantity={handleChangeQuantity}
        handleOnBlur={handleOnBlur}
        handleDeleteCart={handleDeleteCart}
        pharmacy_id={trimmedData?.pharmacy_id || 0}
        product_id={trimmedData?.product_id || 0}
        productQuantity={trimmedData?.quantity || 0}
        isDisabled={isDisabled}
      />
    </div>
  );
}
