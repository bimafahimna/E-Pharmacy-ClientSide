import OrderTable from "../../../components/OrderTable";
import style from "./index.module.css";

export default function PharmacyOrdersPage() {
  return (
    <div className={style.wrapper}>
      <OrderTable />
    </div>
  );
}
