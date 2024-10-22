import clsx from "clsx";
import Input from "../Input";
import style from "./index.module.css";
import formStyle from "../../css/form.module.css";
import dropdownMenuStyle from "../../css/dropdown_menu.module.css";
import { entities, masterProductForm, ResponseError } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import {
  getMasterProductPaginated,
  postMasterProduct,
} from "../../stores/MasterProductReducer";
import { useNavigate } from "react-router-dom";
import { useMasterProductValidation } from "../../hooks/useMasterProductValidation";
import * as constants from "../../constants/masterProduct";
import * as formatTable from "../../utils/formatTable";
import utilStyle from "../../css/util.module.css";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import {
  fetchAdminCategories,
  fetchAdminManufacturers,
  fetchAdminProductClassifications,
  fetchAdminProductForms,
} from "../../utils/asyncFunctions";
import { FaSearch } from "react-icons/fa";

export interface masterProductFormProps {
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const MasterProductForm: React.FC<masterProductFormProps> = ({
  onRequestClose,
}) => {
  const navigate = useNavigate();
  const AppDispatch = useAppDispatch();
  const {
    post: { isLoading },
  } = useAppSelector((state) => state.masterProduct);
  const [
    { content, validities },
    dispatchProduct,
    formattedCreateRequest,
    isInputValid,
  ] = useMasterProductValidation();
  const [isOpen, setCategoryIsOpen] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<{
    [properties in keyof masterProductForm]?: entities[];
  }>({
    product_classification: [],
    product_form: [],
    manufacturer: [],
    categories: [],
  });

  const [categorySearch, setCategorySearch] = useState("");
  const [activeField, setActiveField] = useState<
    keyof masterProductForm | null
  >(null);
  const filteredCategories = dropdown.categories!.filter((item) => {
    return (
      item.name.includes(categorySearch) &&
      !content.categories.split(",").includes(item.name) &&
      item.name.length !== 0
    );
  });

  const handlePost = async () => {
    try {
      await AppDispatch(postMasterProduct(formattedCreateRequest())).unwrap();
      await AppDispatch(getMasterProductPaginated()).unwrap();
      onRequestClose(false);
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleGetCategories = async () => {
    try {
      const { data } = await fetchAdminCategories();
      if (data !== undefined)
        setDropdown({
          ...dropdown,
          [constants.MasterProductCreateKeys[12].keys]: data,
        });
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleGetManufacturers = async () => {
    try {
      const { data } = await fetchAdminManufacturers(content.manufacturer);
      if (data !== undefined)
        setDropdown({
          ...dropdown,
          manufacturer: data,
        });
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleGetProductClassifications = async () => {
    try {
      const { data } = await fetchAdminProductClassifications(
        content.product_classification
      );
      if (data !== undefined)
        setDropdown({
          ...dropdown,
          product_classification: data,
        });
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleGetProductForms = async () => {
    try {
      const { data } = await fetchAdminProductForms(content.product_form);
      if (data !== undefined)
        setDropdown({
          ...dropdown,
          product_form: data,
        });
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleOnSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files === null || event.target.files.length === 0) return;
    dispatchProduct({
      type: "onchange",
      value: event.target.files[0].name,
      field: event.target.id as keyof masterProductForm,
      file: event.target.files[0],
    });
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    dispatchProduct({
      type: "onchange",
      value: event.target.value,
      field: event.target.id as keyof masterProductForm,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatchProduct({ type: "validate" });
    if (!isInputValid()) return;
    handlePost();
  };

  const CategoryButton = ({ item }: { item: string }) => (
    <div className={utilStyle.add_input_wrapper}>
      <button type="button">{item}</button>
      <button
        type="button"
        onClick={() =>
          dispatchProduct({
            type: "onchange",
            field: "categories",
            value: content.categories
              .split(",")
              .filter((category) => item !== category)
              .join(","),
          })
        }
      >
        <IoMdClose />
      </button>
    </div>
  );

  useEffect(() => {
    handleGetCategories();
  }, [isOpen]);

  useEffect(() => {
    const debouncedTimeID = setTimeout(() => handleGetManufacturers(), 1000);
    return () => clearTimeout(debouncedTimeID);
  }, [content.manufacturer, activeField === "manufacturer"]);

  useEffect(() => {
    const debouncedTimeID = setTimeout(() => handleGetProductForms(), 1000);
    return () => clearTimeout(debouncedTimeID);
  }, [content.product_form, activeField === "product_form"]);

  useEffect(() => {
    const debouncedTimeID = setTimeout(
      () => handleGetProductClassifications(),
      1000
    );
    return () => clearTimeout(debouncedTimeID);
  }, [
    content.product_classification,
    activeField === "product_classification",
  ]);

  return (
    <>
      <form onSubmit={handleSubmit} className={formStyle.wrapper}>
        <div>
          <h2>Add Product</h2>
          <hr />
        </div>

        <div>
          <p>
            {formatTable.InputLabel(constants.MasterProductCreateKeys[0].keys)}
          </p>
          <Input
            id={constants.MasterProductCreateKeys[0].keys}
            name={constants.MasterProductCreateKeys[0].keys}
            type={constants.MasterProductCreateKeys[0].type}
            placeholder={formatTable.InputLabel(
              constants.MasterProductCreateKeys[0].keys
            )}
            onChange={handleOnChange}
            value={content[constants.MasterProductCreateKeys[0].keys]}
            className={clsx(style.input, style.form, {
              [style.error_input]:
                !validities[constants.MasterProductCreateKeys[0].keys][0],
            })}
          />
          <p className={formStyle.error}>
            {validities[constants.MasterProductCreateKeys[0].keys][1]}
          </p>
        </div>

        {constants.MasterProductCreateKeys.slice(1, 4).map((item) => (
          <div style={{ position: "relative" }}>
            <p>{formatTable.InputLabel(item.keys)}</p>
            <div style={{ color: "var(--accent-color)", position: "relative" }}>
              <Input
                id={item.keys}
                type={item.keys}
                name={item.keys}
                onChange={handleOnChange}
                onFocus={() => setActiveField(item.keys)}
                placeholder={formatTable.InputLabel(item.keys)}
                value={content[item.keys]}
                className={clsx(style.input, style.multiple_input, {
                  [style.error_input]: !validities[item.keys][0],
                })}
                autoComplete="off"
              />
              <FaSearch className={dropdownMenuStyle.search_icon} />
            </div>
            <p className={formStyle.error}>{validities[item.keys][1]}</p>

            {activeField === item.keys && (
              <div className={dropdownMenuStyle.dropdown_menu}>
                <div
                  className={clsx({
                    [dropdownMenuStyle.dropdown_menu_overflow]:
                      dropdown[item.keys]!.length >= 10,
                  })}
                >
                  {dropdown[item.keys]!.map((val, index) => {
                    return (
                      <button
                        key={index}
                        className={dropdownMenuStyle.dropdown_menu_items}
                        onClick={() => {
                          dispatchProduct({
                            type: "onchange",
                            field: item.keys,
                            value: val.name,
                            id: val.id.toString(),
                          });

                          setActiveField(null);
                        }}
                      >
                        <p>{val.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {constants.MasterProductCreateKeys.slice(4, 8).map((item) => (
          <div>
            <p>{formatTable.InputLabel(item.keys)}</p>
            <Input
              id={item.keys}
              name={item.keys}
              type={item.type}
              placeholder={formatTable.InputLabel(item.keys)}
              onChange={handleOnChange}
              value={content[item.keys]}
              className={clsx(style.input, style.form, {
                [style.error_input]: !validities[item.keys][0],
              })}
            />
            <p className={formStyle.error}>{validities[item.keys][1]}</p>
          </div>
        ))}

        <div
          className={[formStyle.inline_input, formStyle.inline_input_even].join(
            " "
          )}
        >
          {constants.MasterProductCreateKeys.slice(8, 12).map((item) => (
            <div>
              <p>{formatTable.InputLabel(item.keys)}</p>
              <Input
                id={item.keys}
                name={item.keys}
                type={item.type}
                placeholder={formatTable.InputLabel(item.keys)}
                onChange={handleOnChange}
                value={content[item.keys]}
                className={clsx(style.input, style.form, {
                  [style.error_input]: !validities[item.keys][0],
                })}
              />
              <p className={formStyle.error}>{validities[item.keys][1]}</p>
            </div>
          ))}
        </div>

        <div>
          <p>Categories</p>
          <div className={utilStyle.wrapper}>
            <button
              type="button"
              className={utilStyle.add_filter_button}
              onClick={() => setCategoryIsOpen(!isOpen)}
            >
              + add categories
            </button>
            {content.categories.split(",").map((item) => {
              if (item.length !== 0) return <CategoryButton item={item} />;
            })}
            {isOpen && (
              <div className={utilStyle.dropdown_inputs}>
                <input
                  placeholder={"Search categories..."}
                  onChange={(e) => {
                    e.preventDefault();
                    setCategorySearch(e.target.value);
                  }}
                  value={categorySearch}
                ></input>
                {filteredCategories.length > 0 && (
                  <div style={{ minHeight: "3rem" }}>
                    <div
                      className={clsx(utilStyle.product_dropdown, {
                        [utilStyle.product_dropdown_overflow]:
                          filteredCategories.length >= 3,
                      })}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {filteredCategories.map((item) => (
                          <button
                            type="button"
                            onClick={() =>
                              dispatchProduct({
                                type: "onchange",
                                field: "categories",
                                value: content.categories + item.name + ",",
                              })
                            }
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className={formStyle.error}>{validities.categories[1]}</p>
        </div>

        <div>
          <p>Image</p>
          <Input
            id="image_url"
            name="image_url"
            type="file"
            accept="image/*"
            onChange={handleOnSelectImage}
            className={clsx(style.input, style.form, {
              [style.error_input]: !validities.image_url[0],
            })}
          />

          <p className={formStyle.error}>{validities.image_url[1]}</p>
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
          <p className={formStyle.error}>{validities.is_active[1]}</p>
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

export default MasterProductForm;
