import { useSelector } from "react-redux";
import style from "./index.module.css";
import { RootState, StoreDispatch } from "../../../stores/store";
import { useDispatch } from "react-redux";
import Input from "../../Input";
import React, { useState } from "react";
import { setChosenAddress } from "../../../stores/ProfileReducer";
import Modal from "../../Modal";
import AddressFormContextProvider from "../../../stores/AddressFormContext";
import AddressForm from "../../AddressForm";

export default function SelectAddress(): JSX.Element {
  const { data } = useSelector((state: RootState) => state.profile);
  const dispatchRedux: StoreDispatch = useDispatch();

  const handleOnSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatchRedux(setChosenAddress(Number(e.currentTarget.id)));
  };

  const [open, onRequestClose] = useState<boolean>(false);

  return (
    <div className={style.form_container}>
      <Modal onRequestClose={onRequestClose} shouldShow={open}>
        <AddressFormContextProvider onRequestClose={onRequestClose}>
          <AddressForm onRequestClose={onRequestClose} />
        </AddressFormContextProvider>
      </Modal>

      <div className={style.selectFormHeader}>
        <h1>Available Addresses</h1>
        <button
          className={style.add_address}
          onClick={() => {
            onRequestClose(true);
          }}
        >
          + Add New Address
        </button>
      </div>

      <form action="submit" className={style.form_address}>
        {data.profile_addresses.map((address, idx) => {
          return (
            <div
              key={`${address.id}+${idx}+"address"`}
              className={style.address_info_container}
            >
              <Input
                className={style.radio_button}
                id={`${address.id}`}
                type="radio"
                checked={address?.currently_selected}
                onChange={handleOnSelect}
                name={"address_radio"}
              />
              <label className={style.label} htmlFor={`${address?.id}`}>
                <div className={style.address_details}>
                  <p className={style.receiver_info}>
                    {address?.receiver_name}
                    {" | "}
                    {address?.receiver_phone_number} {" | "}
                    {address?.name}
                  </p>
                  <p className={style.address_details}>
                    {address?.address_details}
                  </p>
                  <p className={style.address_details}>
                    {address?.address_line_2}
                  </p>
                  <p className={style.address_regions}>
                    {`${address?.sub_district.toUpperCase()} ${address?.district.toUpperCase()}, ${address?.city.toUpperCase()}, ${address?.province.toUpperCase()}`}
                  </p>
                </div>
              </label>
            </div>
          );
        })}
      </form>
    </div>
  );
}
