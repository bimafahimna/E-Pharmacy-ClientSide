import clsx from "clsx";
import Input from "../Input";
import style from "./index.module.css";
import formStyle from "../../css/form.module.css";
import { generalResponse, ResponseError } from "../../utils/types";
import { useAppDispatch } from "../../hooks/useApp";
import { getMasterProductPaginated } from "../../stores/MasterProductReducer";
import { useNavigate } from "react-router-dom";
import * as constants from "../../constants/masterProduct";
import * as formatTable from "../../utils/formatTable";
import { useState } from "react";
import { post } from "../../utils/fetch";

export interface masterProductFormProps {
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryProductForm: React.FC<masterProductFormProps> = ({
  onRequestClose,
}) => {
  const navigate = useNavigate();
  const AppDispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    try {
      setIsLoading(true);
      await post<{ name: string }, generalResponse<undefined>>(
        import.meta.env.VITE_BASE_URL + "/admin/categories",
        { name: name },
        {
          credentials: "include" as RequestCredentials,
        }
      );
      setIsLoading(false);
      await AppDispatch(getMasterProductPaginated()).unwrap();
      onRequestClose(false);
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handlePost();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={formStyle.wrapper}>
        <div>
          <h2>Add Product Category</h2>
          <hr />
        </div>

        <div>
          <p>Category Name</p>
          <Input
            id={"name"}
            name={"name"}
            type={constants.MasterProductCreateKeys[0].type}
            placeholder={formatTable.InputLabel("name")}
            onChange={handleOnChange}
            value={name}
            className={clsx(style.input, style.form)}
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

export default CategoryProductForm;
