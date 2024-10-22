import * as constants from "../../constants/masterProduct";
import * as formatTable from "../../utils/formatTable";
import Input from "../Input";
import clsx from "clsx";
import formStyle from "../../css/form.module.css";
import style from "./index.module.css";
import {
  pharmacyProduct,
  pharmacyProductForm,
  ResponseError,
} from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import { useNavigate } from "react-router-dom";
import { usePharmacyProductValidation } from "../../hooks/usePharmacyProductValidation";
import {
  getPharmacyProductPaginated,
  getMasterProductPaginated,
  putPharmacyProduct,
} from "../../stores/PharmacyProductReducer";
import { useEffect } from "react";

export interface pharmacyProductFormProps {
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
  pharmacyProduct: pharmacyProduct;
}

const PharmacyProductEditForm: React.FC<pharmacyProductFormProps> = ({
  onRequestClose,
  pharmacyProduct: pharmacyProduct,
}) => {
  const navigate = useNavigate();
  const AppDispatch = useAppDispatch();
  const {
    put: { isLoading },
  } = useAppSelector((state) => state.pharmacyProduct.pharmacyProduct);
  const [
    { content, validities },
    dispatchProduct,
    _formattedCreateRequest,
    formattedEditRequest,
    isInputValid,
  ] = usePharmacyProductValidation();

  const handlePost = async () => {
    try {
      await AppDispatch(putPharmacyProduct(formattedEditRequest())).unwrap();
      await AppDispatch(getPharmacyProductPaginated()).unwrap();
      await AppDispatch(getMasterProductPaginated()).unwrap();
      onRequestClose(false);
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    dispatchProduct({
      type: "onchange",
      value: event.target.value,
      field: event.target.id as keyof pharmacyProductForm,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatchProduct({ type: "validate" });
    if (!isInputValid("edit")) return;
    handlePost();
  };

  useEffect(() => {
    dispatchProduct({
      type: "onchange",
      value: pharmacyProduct.product_id.toString(),
      field: "product_id",
    });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className={formStyle.wrapper}>
        <div>
          <h2>Edit Product</h2>
          <hr />
        </div>

        <div>
          <p>{formatTable.InputLabel("product_id")}</p>
          <Input
            id="product_id"
            name="product_id"
            type="text"
            placeholder={formatTable.InputLabel(
              constants.MasterProductCreateKeys[0].keys
            )}
            onChange={handleOnChange}
            value={content.product_id}
            className={clsx(style.input, style.form, {
              [style.error_input]: !validities.product_id![0],
              [formStyle.disabled]: true,
            })}
            readOnly={true}
          />
          <p className={formStyle.error}>{validities.product_id![1]}</p>
        </div>

        <div>
          <p>{formatTable.InputLabel("stock")}</p>
          <Input
            id="stock"
            name="stock"
            type="text"
            placeholder={formatTable.InputLabel("stock")}
            onChange={handleOnChange}
            value={content.stock}
            className={clsx(style.input, style.form, {
              [style.error_input]: !validities.stock![0],
            })}
          />
          <p className={formStyle.error}>{validities.stock![1]}</p>
        </div>

        <div className={formStyle.checkbox_wrapper}>
          <p>Set as active</p>
          <Input
            id="is_active"
            name="is_active"
            type="checkbox"
            placeholder="is_active"
            onChange={() =>
              dispatchProduct({
                type: "onchange",
                field: "is_active",
                value: content.is_active === "false" ? "true" : "false",
              })
            }
            checked={content.is_active === "true"}
          />
          <p className={formStyle.error}>{validities.is_active![1]}</p>
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

export default PharmacyProductEditForm;
