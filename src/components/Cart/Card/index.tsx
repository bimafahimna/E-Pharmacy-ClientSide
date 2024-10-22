import style from "./index.module.css";
import CardItems from "./CardItems";
import { cartCardPersisted, cartTrimmedData } from "../../../utils/types";

export default function CartPageCart({
  handleOnChangeItemCheckbox,
  handleOnChangePharmacyCheckbox,
  handleAddQuantity,
  handleReduceQuantity,
  handleChangeQuantity,
  handleOnBlur,
  handleDeleteCart,
  handleToProductDetails,
  cartData,
  cartPageTrimmedData,
}: {
  handleOnChangeItemCheckbox: React.ChangeEventHandler<HTMLInputElement>;
  handleOnChangePharmacyCheckbox: React.ChangeEventHandler<HTMLInputElement>;
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
  cartData: cartCardPersisted;
  cartPageTrimmedData: cartTrimmedData[];
}): JSX.Element {
  return (
    <>
      <div className={style.cartCard}>
        <div className={style.cardHeader}>
          <input
            id={cartData.pharmacy_name}
            onChange={handleOnChangePharmacyCheckbox}
            className={style.checkbox}
            type="checkbox"
            name={cartData.pharmacy_name}
            checked={cartData.is_selected_all_item}
          />
          <label
            htmlFor={cartData.pharmacy_name}
            className={style.pharmacyName}
          >
            {cartData.pharmacy_name}
          </label>
        </div>

        <div className={style.cardContents}>
          {cartData.items.map((data, idx) => {
            const trimmedData = cartPageTrimmedData.filter((item) => {
              if (
                item.pharmacy_id === data.pharmacy_id &&
                item.product_id === data.product_id
              ) {
                return {
                  pharmacy_id: item.pharmacy_id,
                  product_id: item.product_id,
                  quantity: item.quantity,
                };
              }
            });

            const isDisabled = data.stock <= 0;
            return (
              <CardItems
                handleOnChangeItemCheckbox={handleOnChangeItemCheckbox}
                handleAddQuantity={handleAddQuantity}
                handleReduceQuantity={handleReduceQuantity}
                handleChangeQuantity={handleChangeQuantity}
                handleOnBlur={handleOnBlur}
                handleDeleteCart={handleDeleteCart}
                handleToProductDetails={handleToProductDetails}
                key={idx + 1}
                data={data}
                trimmedData={trimmedData[0]}
                isDisabled={isDisabled}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
