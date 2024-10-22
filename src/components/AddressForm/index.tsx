import AddressInputs from "./AddressInputs";
import Input from "../Input";
import clsx from "clsx";
import style from "./index.module.css";
import { useAddressForm } from "../../stores/AddressFormContext/useAddressForm";
import formStyle from "../../css/form.module.css";

interface AddressFormProps {
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddressForm: React.FC<AddressFormProps> = ({ onRequestClose }) => {
  const {
    autofilled,
    displayMap,
    handleAutofill,
    handleLocation,
    handleOnSubmit,
    location,
    locationIsValid,
    dispatchAddress,
    addressForm,
  } = useAddressForm();

  return (
    <>
      <form onSubmit={handleOnSubmit} className={formStyle.wrapper}>
        <div>
          <h2>Add Address</h2>
          <hr />
        </div>
        <AddressInputs />

        {location !== null ? (
          <div
            style={{
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div id="map" className={style.map_wrapper}>
              {displayMap}
            </div>

            <div className={style.autofill_wrapper}>
              <div style={{ width: "100%" }}>
                <p>{autofilled.content.address_line_2}</p>

                <p>
                  {location.latitude} {location.longitude}
                </p>
              </div>
              <div>
                <button
                  onClick={handleAutofill}
                  className={style.autofill_button}
                  disabled={!autofilled.valid && !autofilled.isLoading}
                  type="button"
                >
                  {autofilled.isLoading ? (
                    <div className={style.loaderSpin}></div>
                  ) : (
                    "Autofill"
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={style.location_button_wrapper}>
            <button
              onClick={handleLocation}
              className={clsx(style.location_button, {
                [style.error]: !locationIsValid,
              })}
              type="button"
            >
              Add Location
            </button>
          </div>
        )}
        <div className={formStyle.checkbox_wrapper}>
          <label htmlFor="active">Set as active</label>
          <Input
            id="active"
            type="checkbox"
            name="active"
            onChange={() =>
              dispatchAddress({
                type: "onchange",
                field: "is_active",
                value:
                  addressForm.content.is_active === "false" ? "true" : "false",
              })
            }
            checked={addressForm.content.is_active === "true"}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => onRequestClose(false)}
            className={formStyle.button}
          >
            Cancel
          </button>
          <button type="submit" className={formStyle.submit}>
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default AddressForm;
