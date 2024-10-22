import style from "./index.module.css";
import { useAddressForm } from "../../stores/AddressFormContext/useAddressForm";

const DisplayPosition: React.FC = () => {
  const { handleUserLocation, handleFormLocation } = useAddressForm();

  return (
    <>
      <div className={style.wrapper}>
        <button onClick={handleFormLocation} className={style.button}>
          Use form location
        </button>
        <button onClick={handleUserLocation} className={style.button}>
          Use your location
        </button>
      </div>
    </>
  );
};

export default DisplayPosition;
