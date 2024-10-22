import * as constants from "../../constants/masterProduct";
import * as formatTable from "../../utils/formatTable";
import Input from "../Input";
import clsx from "clsx";
import formStyle from "../../css/form.module.css";
import style from "./index.module.css";
import {
  masterProduct,
  pharmacyProductForm,
  ResponseError,
} from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import { useNavigate } from "react-router-dom";
import { usePharmacyProductValidation } from "../../hooks/usePharmacyProductValidation";
import {
  getPharmacyProductPaginated,
  postPharmacyProduct,
  getMasterProductPaginated,
} from "../../stores/PharmacyProductReducer";
import { useEffect } from "react";

export interface pharmacyProductFormProps {
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
  masterProduct: masterProduct;
}

const PharmacyProductForm: React.FC<pharmacyProductFormProps> = ({
  onRequestClose,
  masterProduct,
}) => {
  const navigate = useNavigate();
  const AppDispatch = useAppDispatch();
  const {
    post: { isLoading },
  } = useAppSelector((state) => state.pharmacyProduct.pharmacyProduct);
  const [
    { content, validities },
    dispatchProduct,
    formattedCreateRequest,
    _,
    isInputValid,
  ] = usePharmacyProductValidation();

  const handlePost = async () => {
    try {
      await AppDispatch(postPharmacyProduct(formattedCreateRequest())).unwrap();
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
    if (!isInputValid("create")) return;
    handlePost();
  };

  useEffect(() => {
    dispatchProduct({
      type: "onchange",
      value: masterProduct.id.toString(),
      field: "product_id",
    });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className={formStyle.wrapper}>
        <div>
          <h2>Add Product</h2>
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

        <div>
          <p>{formatTable.InputLabel("price")}</p>
          <Input
            id="price"
            name="price"
            type="text"
            placeholder={formatTable.InputLabel("price")}
            onChange={handleOnChange}
            value={content.price}
            className={clsx(style.input, style.form, {
              [style.error_input]: !validities.price![0],
            })}
          />
          <p className={formStyle.error}>{validities.price![1]}</p>
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

export default PharmacyProductForm;
