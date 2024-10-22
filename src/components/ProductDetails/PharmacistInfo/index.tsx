import { shopPharmacistInfo } from "../../../utils/types";
import style from "./index.module.css";
import { FaWhatsapp } from "react-icons/fa6";

export default function UserPharmacistInfo({
  shopPharmacistInfo,
}: {
  shopPharmacistInfo: shopPharmacistInfo;
}): JSX.Element {
  return (
    <>
      <div className={style.section_info}>
        <p className={style.modal_title}>Pharmacy's info</p>

        <div className={style.section_info_details}>
          <table>
            <tbody>
              <tr>
                <td className={style.details_head}>Pharmacist's Name</td>
                <td className={style.value}>
                  {shopPharmacistInfo.selected_pharmacist_name}
                </td>
              </tr>
              <tr>
                <td className={style.details_head}>SIPA Number</td>
                <td className={style.value}>
                  {shopPharmacistInfo.selected_pharmacist_SIPA_number}
                </td>
              </tr>
              <tr>
                <td className={style.details_head}>Pharmacy's Address</td>
                <td className={style.value}>
                  {shopPharmacistInfo.selected_pharmacy_address}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <a
          href={`https://wa.me/${shopPharmacistInfo.selected_pharmacist_phone_number}`}
          className={style.contact_with_whatsapp}
        >
          Contact Pharmacist via Whatsapp{" "}
          <FaWhatsapp className={style.whatsapp_logo} />
        </a>
      </div>
    </>
  );
}
