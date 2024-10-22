import style from "./index.module.css";
import { FaHouseMedical } from "react-icons/fa6";
import { FaHouseMedicalCircleCheck } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import FormatPrice from "../../../utils/formatNumber";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RootState, StoreDispatch } from "../../../stores/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getProductAvailablePharmacies } from "../../../stores/ProductReducer";
import LoaderDots from "../../Spinners/dots";

export default function UserSelectPharmacy({
  onRequestCloseSelectPharmacy,
  currentPharmacyId,
  currentProductId,
}: {
  onRequestCloseSelectPharmacy: React.Dispatch<React.SetStateAction<boolean>>;
  currentPharmacyId: string;
  currentProductId: string;
}): JSX.Element {
  const navigate = useNavigate();

  const { shopProductDetailsAvailablePharmacies, availablePharmacyLoading } =
    useSelector((state: RootState) => state.product);

  const dispatchRedux: StoreDispatch = useDispatch();

  const handleChosenPharmacy = (pharmacy_id: number) => {
    onRequestCloseSelectPharmacy(false);
    navigate(`/pharmacy/${pharmacy_id}/product/${currentProductId}`);
  };

  useEffect(() => {
    dispatchRedux(getProductAvailablePharmacies(Number(currentProductId)));
  }, []);

  return (
    <div className={style.select_pharmacy_section}>
      <p className={style.modal_title}>Select Pharmacy</p>

      {availablePharmacyLoading ? (
        <LoaderDots />
      ) : (
        <div className={style.form_select_pharmacy}>
          {shopProductDetailsAvailablePharmacies.map((pharmacy, idx) => {
            return (
              <div
                key={`${idx}_${pharmacy.pharmacy_id}`}
                className={
                  Number(pharmacy.pharmacy_id) === Number(currentPharmacyId)
                    ? style.select_pharmacy_card_current
                    : style.select_pharmacy_card
                }
              >
                <div className={style.card_header}>
                  {Number(pharmacy.pharmacy_id) ===
                  Number(currentPharmacyId) ? (
                    <FaHouseMedicalCircleCheck
                      className={style.pharmacy_logo_current}
                    />
                  ) : (
                    <FaHouseMedical className={style.pharmacy_logo} />
                  )}
                  <p className={style.title}>{pharmacy.pharmacy_name}</p>
                </div>

                <div className={style.card_content}>
                  <div className={style.content_location}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <IoLocationSharp className={style.location_logo} />
                      <p className={style.address}>{pharmacy.address}</p>
                    </div>
                    <p className={style.city}>{pharmacy.city_name}</p>
                  </div>

                  <p className={style.product_stock}>
                    Available stock: {pharmacy.stock}
                  </p>

                  <p className={style.product_price}>
                    {FormatPrice(pharmacy.product_price)}
                  </p>
                </div>

                <div className={style.card_actions}>
                  <button
                    onClick={() => {
                      handleChosenPharmacy(pharmacy.pharmacy_id);
                    }}
                    className={
                      Number(pharmacy.pharmacy_id) === Number(currentPharmacyId)
                        ? style.choose_button_current
                        : style.choose_button
                    }
                  >
                    {Number(pharmacy.pharmacy_id) === Number(currentPharmacyId)
                      ? "Current pharmacy"
                      : "Choose this pharmacy"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
