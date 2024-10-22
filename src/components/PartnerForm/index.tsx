import clsx from "clsx";
import Input from "../Input";
import style from "./index.module.css";
import formStyle from "../../css/form.module.css";
import { ResponseError } from "../../utils/types";
import { usePartnerValidation } from "../../hooks/usePartnerFormValidation";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import { getPartnersPaginated, postPartner } from "../../stores/PartnerReducer";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

export interface partnerFormProps {
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const PartnerForm: React.FC<partnerFormProps> = ({ onRequestClose }) => {
  const navigate = useNavigate();
  const AppDispatch = useAppDispatch();
  const {
    post: { isLoading },
  } = useAppSelector((state) => state.partner);
  const [
    partnerForm,
    dispatchPartner,
    formattedCreateRequest,
    _,
    isInputValid,
  ] = usePartnerValidation();

  const handlePost = async () => {
    try {
      await AppDispatch(postPartner(formattedCreateRequest())).unwrap();
      await AppDispatch(getPartnersPaginated()).unwrap();
      onRequestClose(false);
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleOnSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files === null || event.target.files.length === 0) return;
    dispatchPartner({
      type: "onchange",
      value: event.target.files[0].name,
      field: event.target.id,
      file: event.target.files[0],
    });
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    dispatchPartner({
      type: "onchange",
      value: event.target.value,
      field: event.target.id,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatchPartner({ type: "validate" });
    if (!isInputValid()) return;
    handlePost();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={formStyle.wrapper}>
        <div>
          <h2>Add Partner</h2>
          <hr />
        </div>
        <div>
          <p>Name</p>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Century"
            onChange={handleOnChange}
            value={partnerForm.content.name}
            className={clsx(style.input, style.form, {
              [style.error_input]: !partnerForm.validities.name[0],
            })}
          />
          <p className={formStyle.error}>{partnerForm.validities.name[1]}</p>
        </div>

        <div>
          <p>Year Founded</p>
          <Input
            id="year_founded"
            name="year_founded"
            type="text"
            placeholder="2001"
            onChange={handleOnChange}
            value={partnerForm.content.year_founded}
            className={clsx(style.input, style.form, {
              [style.error_input]: !partnerForm.validities.year_founded[0],
            })}
          />
          <p className={formStyle.error}>
            {partnerForm.validities.year_founded[1]}
          </p>
        </div>

        <div
          className={formStyle.inline_input + " " + formStyle.inline_input_even}
        >
          <div>
            <p>Operational Start</p>
            <Input
              id="operational_start"
              name="operational_start"
              type="time"
              placeholder="10:00+07"
              onChange={handleOnChange}
              value={partnerForm.content.operational_start}
              className={clsx(style.input, style.form, {
                [style.error_input]:
                  !partnerForm.validities.operational_start[0],
              })}
            />

            <p className={formStyle.error}>
              {partnerForm.validities.operational_start[1]}
            </p>
          </div>

          <div>
            <p>Operational Stop</p>
            <Input
              id="operational_stop"
              name="operational_stop"
              type="time"
              placeholder="20:00+07"
              onChange={handleOnChange}
              value={partnerForm.content.operational_stop}
              className={clsx(style.input, style.form, {
                [style.error_input]:
                  !partnerForm.validities.operational_stop[0],
              })}
            />
            <p className={formStyle.error}>
              {partnerForm.validities.operational_stop[1]}
            </p>
          </div>
        </div>

        <div>
          <p>Active Days</p>
          <div className={style.days}>
            {partnerForm.days.map((item, index) => (
              <Fragment key={index}>
                <input
                  onChange={() => {
                    dispatchPartner({
                      type: "ondaychange",
                      value: index.toString(),
                    });
                  }}
                  checked={item.checked}
                  type="checkbox"
                  name="day"
                  value={item.name}
                  id={item.name}
                />
                <label htmlFor={item.name}>
                  {item.name[0].toUpperCase()}
                  {item.name.slice(1, 3)}
                </label>
              </Fragment>
            ))}
          </div>
        </div>

        <div>
          <p>Logo</p>
          <Input
            id="logo_url"
            name="logo_url"
            type="file"
            accept="image/*"
            onChange={handleOnSelectImage}
            className={clsx(style.input, style.form, {
              [style.error_input]: !partnerForm.validities.logo_url[0],
            })}
          />

          <p className={formStyle.error}>
            {partnerForm.validities.logo_url[1]}
          </p>
        </div>
        <div className={formStyle.checkbox_wrapper}>
          <label htmlFor="active">Set as active</label>
          <Input
            id="active"
            type="checkbox"
            name="active"
            onChange={() =>
              dispatchPartner({
                type: "onchange",
                field: "is_active",
                value:
                  partnerForm.content.is_active === "false" ? "true" : "false",
              })
            }
            checked={partnerForm.content.is_active === "true"}
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

export default PartnerForm;
