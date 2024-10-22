import * as constants from "../../constants/pharmacist";
import Input from "../Input";
import LoaderCirle from "../Spinner/circle";
import clsx from "clsx";
import formStyle from "../../css/form.module.css";
import style from "./index.module.css";
import { ResponseError } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePharmacistValidation } from "../../hooks/usePharmacistFormValidation";
import {
  getPharmacistByID,
  getPharmacistsPaginated,
  putPharmacist,
} from "../../stores/PharmacistReducer";

export interface pharmacistFormProps {
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
  ID: string;
}

const PharmacistsEditForm: React.FC<pharmacistFormProps> = ({
  onRequestClose,
  ID,
}: pharmacistFormProps) => {
  const navigate = useNavigate();
  const AppDispatch = useAppDispatch();
  const {
    put: { data, isLoading },
  } = useAppSelector((state) => state.pharmacist);
  const [
    pharmacistForm,
    dispatchPharmacist,
    isInputValid,
    formattedEditRequest,
  ] = usePharmacistValidation();

  const handleEdit = async () => {
    try {
      await AppDispatch(putPharmacist(formattedEditRequest())).unwrap();
      await AppDispatch(getPharmacistsPaginated()).unwrap();
      onRequestClose(false);
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    dispatchPharmacist({
      type: "onchange",
      value: event.target.value,
      field: event.target.id,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatchPharmacist({
      type: "validate",
      value: "",
      field: "",
    });
    if (!isInputValid()) return;
    handleEdit();
  };

  useEffect(() => {
    AppDispatch(getPharmacistByID());
  }, []);

  useEffect(() => {
    if (data === null) return;
    constants.PharmacistEditFields.forEach((key) => {
      dispatchPharmacist({
        type: "onchange",
        field: key,
        value: data[key],
      });
    });
  }, [data]);

  if (isLoading) return <LoaderCirle />;
  return (
    <>
      <form onSubmit={handleSubmit} className={formStyle.wrapper}>
        <div>
          <h2>Edit Pharmacist</h2>
          <hr />
        </div>
        <div className={formStyle.inline_input}>
          <div>
            <p>ID</p>
            <Input
              id="id"
              name="id"
              type="text"
              onChange={handleOnChange}
              value={ID}
              className={clsx(style.input, style.form, {
                [style.error_input]: !pharmacistForm.validities.name,
                [formStyle.disabled]: true,
              })}
              readOnly={true}
            />
          </div>
          <div>
            <p>Name</p>
            <Input
              id="name"
              name="name"
              type="text"
              onChange={handleOnChange}
              value={pharmacistForm.content.name}
              className={clsx(style.input, style.form, {
                [style.error_input]: !pharmacistForm.validities.name,
                [formStyle.disabled]: true,
              })}
              readOnly={true}
            />
          </div>
        </div>

        <div>
          <p>Email</p>
          <Input
            id="email"
            name="email"
            type="text"
            onChange={handleOnChange}
            value={pharmacistForm.content.email}
            className={clsx(style.input, style.form, {
              [style.error_input]: !pharmacistForm.validities.email,
              [formStyle.disabled]: true,
            })}
            readOnly={true}
          />
        </div>

        <div>
          <p>Sipa Number</p>
          <Input
            id="sipa_number"
            name="sipa_number"
            type="text"
            onChange={handleOnChange}
            value={pharmacistForm.content.sipa_number}
            className={clsx(style.input, style.form, {
              [style.error_input]: !pharmacistForm.validities.sipa_number,
              [formStyle.disabled]: true,
            })}
            readOnly={true}
          />
        </div>

        <div>
          <p>Whatsapp Number</p>
          <Input
            id="whatsapp_number"
            name="whatsapp_number"
            type="text"
            onChange={handleOnChange}
            value={pharmacistForm.content.whatsapp_number}
            className={clsx(style.input, style.form, {
              [style.error_input]:
                !pharmacistForm.validities.whatsapp_number[0],
            })}
          />
          <p className={formStyle.error}>
            {pharmacistForm.validities.whatsapp_number[1]}
          </p>
        </div>

        <div>
          <p>Years of Experience</p>
          <Input
            id="years_of_experience"
            name="years_of_experience"
            type="text"
            onChange={handleOnChange}
            value={pharmacistForm.content.years_of_experience}
            className={clsx(style.input, style.form, {
              [style.error_input]:
                !pharmacistForm.validities.years_of_experience[0],
            })}
          />
          <p className={formStyle.error}>
            {pharmacistForm.validities.years_of_experience[1]}
          </p>
        </div>
        <div>
          <button
            type="button"
            className={formStyle.button}
            onClick={() => onRequestClose(false)}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className={clsx(formStyle.submit, {
              [formStyle.opacity]: isLoading,
            })}
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default PharmacistsEditForm;
