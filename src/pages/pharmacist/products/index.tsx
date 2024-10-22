import MasterProductTable from "../../../components/MasterProductTable";
import PharmacyProductsTable from "../../../components/PharmacyProductTable";
import style from "./index.module.css";

export default function PharmacyProductsPage() {
  return (
    <div className={style.wrapper}>
      <div>
        <PharmacyProductsTable />
      </div>
      <div>
        <MasterProductTable />
      </div>
    </div>
  );
}
