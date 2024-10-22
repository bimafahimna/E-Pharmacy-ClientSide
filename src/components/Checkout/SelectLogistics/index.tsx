import style from "./index.module.css";
import React, { useEffect, useState } from "react";
import { checkoutLogistics } from "../../../utils/types";
import Input from "../../Input";
import FormatPrice from "../../../utils/formatNumber";
import { RootState, StoreDispatch } from "../../../stores/store";
import { useDispatch } from "react-redux";
import { setChosenLogistic } from "../../../stores/LogisticsReducer";
import { useSelector } from "react-redux";

export default function SelectLogistics({
  pharmacy_name,
}: {
  pharmacy_name: string;
}): JSX.Element {
  const [modalLogistic, setModalLogistics] = useState<checkoutLogistics>();

  const { logisticsData } = useSelector(
    (state: RootState) => state.pharmacyLogistics
  );

  const dispatchRedux: StoreDispatch = useDispatch();

  const handleChosenPharmacy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const logisticId = e.currentTarget.id.split("_")[0];
    const pharmacyName = e.currentTarget.id.split("_")[1];

    dispatchRedux(
      setChosenLogistic({
        id: Number(logisticId),
        pharmacy_name: pharmacyName,
      })
    );
  };

  useEffect(() => {
    const selectedData = logisticsData.find((pharmacy) => {
      return pharmacy.pharmacy_name === pharmacy_name;
    });

    setModalLogistics(selectedData);
  }, [pharmacy_name, logisticsData]);

  return (
    <div className={style.form_container}>
      <form action="submit" className={style.form_logistics}>
        <p className={style.form_title}>Available Logistics: </p>
        {modalLogistic?.logistics.map((logistic, idx) => {
          return (
            <div
              key={`${logistic.id}+${idx}+"address"`}
              className={style.logistics_info_container}
            >
              <Input
                className={style.radio_button}
                id={`${logistic.id}_${pharmacy_name}`}
                type="radio"
                checked={logistic.currently_chosen}
                onChange={handleChosenPharmacy}
                name={"address_radio"}
              />
              <label
                className={style.label}
                htmlFor={`${logistic.id}_${pharmacy_name}`}
              >
                <div className={style.logistic_detail}>
                  <img
                    className={style.logistic_info_logo}
                    src={logistic.image_url}
                    alt={logistic.name + " logo"}
                  />
                  <div>
                    <p className={style.logistic_info_name}>{logistic.name}</p>
                    <p className={style.logistic_info_price}>
                      {FormatPrice(logistic.price)}
                    </p>
                    <p className={style.logistic_info_estimation}>
                      Est. arrival: {logistic.estimation}
                    </p>
                  </div>
                </div>
              </label>
            </div>
          );
        })}
      </form>
    </div>
  );
}
