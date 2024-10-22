import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import style from "./index.module.css";
import Modal from "../Modal";
import AddressForm from "../AddressForm";
import AddressFormContextProvider from "../../stores/AddressFormContext";
import { getAddresses } from "../../stores/ProfileReducer";

export default function AddressList(): JSX.Element {
  const { data } = useAppSelector((state) => state.profile);
  const AppDispatch = useAppDispatch();
  const [open, onRequestClose] = useState(false);

  useEffect(() => {
    AppDispatch(getAddresses());
  }, []);

  return (
    <>
      <div className={style.addresses}>
        <div className={style.addresses_title}>
          <h2>My Addresses</h2>
          <button
            className={style.add_address}
            onClick={() => {
              onRequestClose(true);
            }}
          >
            + Add New Address
          </button>
        </div>
        {data.profile_addresses.map((item, index) => {
          return (
            <Fragment key={index}>
              <div>
                <hr style={{ margin: 0 }} />
                <div className={style.address_card}>
                  <div className={style.address_name}>
                    <h3>{item.name}</h3>
                    {item.is_active === "true" && (
                      <p className={style.is_active}>Active</p>
                    )}
                  </div>
                  <div className={style.inline + " " + style.receiver}>
                    <h4>{item.receiver_name}</h4>
                    <p> | </p>
                    <h4>{item.receiver_phone_number}</h4>
                  </div>
                  <div className={style.inline + " " + style.address_details}>
                    <p>{item.address_details}</p>
                  </div>
                  <div className={style.inline + " " + style.address_details}>
                    <p>{item.sub_district} Sub District, </p>
                    <p>{item.district} District, </p>
                    <p>{item.city}, </p>
                    <p>{item.province} Province</p>
                  </div>
                  <div className={style.actions}>
                    <div className={style.inline}>
                      <button className={style.edit}>Edit</button>
                      <p> | </p>
                      <button className={style.delete}>Delete</button>
                    </div>
                    <button className={style.edit}>Set as Active</button>
                  </div>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
      <Modal onRequestClose={onRequestClose} shouldShow={open}>
        <AddressFormContextProvider onRequestClose={onRequestClose}>
          <AddressForm onRequestClose={onRequestClose} />
        </AddressFormContextProvider>
      </Modal>
    </>
  );
}
