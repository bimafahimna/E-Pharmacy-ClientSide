import clsx from "clsx";
import { usePharmacistValidation } from "../../hooks/usePharmacistFormValidation";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import Input from "../Input";
import { ResponseError } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import {
  getPharmacistsPaginated,
  postPharmacist,
} from "../../stores/PharmacistReducer";
import formStyle from "../../css/form.module.css";
import style from "./index.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { passwordGenerator } from "../../utils/passwordGenerator";

export interface pharmacistFormProps {
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const PharmacistsForm: React.FC<pharmacistFormProps> = ({ onRequestClose }) => {
  const navigate = useNavigate();
  const AppDispatch = useAppDispatch();
  const {
    post: { isLoading },
  } = useAppSelector((state) => state.pharmacist);
  const [
    pharmacistForm,
    dispatchPharmacist,
    isInputValid,
    _,
    formattedCreateRequest,
  ] = usePharmacistValidation();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const handlePost = async () => {
    try {
      await AppDispatch(postPharmacist(formattedCreateRequest())).unwrap();
      await AppDispatch(getPharmacistsPaginated()).unwrap();
      onRequestClose(false);
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleVisiblePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isPasswordVisible) {
      setIsPasswordVisible(false);
    } else if (!isPasswordVisible) {
      setIsPasswordVisible(true);
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
    handlePost();
  };

  useEffect(() => {
    dispatchPharmacist({
      type: "onchange",
      value: passwordGenerator(),
      field: "password",
    });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className={formStyle.wrapper}>
        <div>
          <h2>Add Pharmacist</h2>
          <hr />
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
              [style.error_input]: !pharmacistForm.validities.name[0],
            })}
          />
          <p className={formStyle.error}>{pharmacistForm.validities.name[1]}</p>
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
              [style.error_input]: !pharmacistForm.validities.email[0],
            })}
          />
          <p className={formStyle.error}>
            {pharmacistForm.validities.email[1]}
          </p>
        </div>

        <div>
          <p>Password</p>
          <div style={{ position: "relative" }}>
            <Input
              id="password"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              onChange={handleOnChange}
              value={pharmacistForm.content.password}
              className={clsx(style.input, style.form, {
                [style.error_input]: !pharmacistForm.validities.password[0],
              })}
              autoComplete="off"
            />

            <button
              onClick={handleVisiblePassword}
              className={style.eyeIconWrapper}
            >
              {isPasswordVisible ? (
                <AiOutlineEyeInvisible className={style.eyeIcon} />
              ) : (
                <AiOutlineEye className={style.eyeIcon} />
              )}
            </button>
          </div>
          <p className={formStyle.error}>
            {pharmacistForm.validities.password[1]}
          </p>
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
              [style.error_input]: !pharmacistForm.validities.sipa_number[0],
            })}
          />
          <p className={formStyle.error}>
            {pharmacistForm.validities.sipa_number[1]}
          </p>
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
            onClick={() => onRequestClose(false)}
            className={formStyle.button}
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

export default PharmacistsForm;
