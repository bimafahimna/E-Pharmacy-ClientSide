import * as constants from "../../constants/pharmacyProduct";
import {
  pharmacyProductForm,
  pharmacyProductValidities,
  createPharmacyProductRequest,
  editPharmacyProductRequest,
} from "../../utils/types";
import { useReducer } from "react";

export type pharmacyProductFormState = {
  id: {
    [properties in keyof pharmacyProductForm]?: string | null;
  };
  content: pharmacyProductForm;
  validities: pharmacyProductValidities;
  validator: {
    [properties in keyof pharmacyProductForm]: (
      value: string,
      comparedString?: string
    ) => [boolean, string];
  };
  isAllValid: boolean;
  image: File | null;
};

export type pharmacyProductAction = {
  type: "onchange" | "validate";
  field?: keyof pharmacyProductForm;
  value?: string;
  file?: File;
};

export const initialIdState = {
  manufacturer: null,
  product_classification: null,
  product_form: null,
};

export const initialContentState: pharmacyProductForm = {
  product_id: "",
  price: "",
  stock: "",
  is_active: "false",
};

const initialValiditiesState: pharmacyProductValidities = {
  product_id: [true, ""],
  price: [true, ""],
  stock: [true, ""],
  is_active: [true, ""],
};

const initialValidatorState = {
  product_id: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (/\D/.test(value)) return [false, constants.ErrMustBeANumber];
    if (Number(value) < 0) return [false, constants.ErrMustBeAPositiveNumber];
    return [true, ""];
  },
  price: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (/\D/.test(value)) return [false, constants.ErrMustBeANumber];
    if (Number(value) < 0) return [false, constants.ErrMustBeAPositiveNumber];
    return [true, ""];
  },
  stock: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (/\D/.test(value)) return [false, constants.ErrMustBeANumber];
    if (Number(value) < 0) return [false, constants.ErrMustBeAPositiveNumber];
    return [true, ""];
  },
  is_active: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
};

export const initialMasterProductFormState: pharmacyProductFormState = {
  id: initialIdState,
  content: initialContentState,
  validities: initialValiditiesState,
  validator: initialValidatorState,
  isAllValid: false,
  image: null,
};

export const masterProductReducer = (
  state: pharmacyProductFormState,
  action: pharmacyProductAction
): pharmacyProductFormState => {
  const { content, validator, validities } = state;
  const { field, value } = action;
  switch (action.type) {
    case "onchange": {
      if (
        field === undefined ||
        value === undefined ||
        validator[field] === undefined
      )
        return state;
      const updatedValues = {
        ...content,
        [field]: action.value,
      };

      let updatedValidities: pharmacyProductValidities = validities;
      let isValid: boolean;
      let message: string;
      [isValid, message] = validator[field](value);

      updatedValidities = {
        ...validities,
        [field]: [isValid, message],
      };

      let isAllValid = true;
      for (const key in updatedValidities) {
        if (
          updatedValidities[key as keyof pharmacyProductValidities] ===
          undefined
        )
          continue;

        isAllValid =
          isAllValid &&
          updatedValidities[key as keyof pharmacyProductValidities]![0];
      }

      const newState = {
        ...state,
        content: updatedValues,
        validities: updatedValidities,
        isAllValid: isAllValid,
      };

      if (action.file !== undefined)
        return {
          ...newState,
          image: action.file,
        };

      return newState;
    }
    case "validate": {
      let updatedValidities: pharmacyProductValidities = state.validities;

      for (const key in state.validities) {
        let isValid: boolean;
        let message: string;
        [isValid, message] = validator[key as keyof pharmacyProductValidities]!(
          content[key as keyof pharmacyProductValidities]!
        );

        updatedValidities = {
          ...updatedValidities,
          [key]: [isValid, message],
        };
      }

      let isAllValid = true;
      for (const key in updatedValidities) {
        isAllValid =
          isAllValid &&
          updatedValidities[key as keyof pharmacyProductValidities]![0];
      }

      return {
        ...state,
        validities: updatedValidities,
        isAllValid: isAllValid,
      };
    }
  }
};

export const usePharmacyProductValidation = (): [
  pharmacyProductFormState,
  React.Dispatch<pharmacyProductAction>,
  () => createPharmacyProductRequest,
  () => editPharmacyProductRequest,
  (validation: "edit" | "create") => boolean
] => {
  const [productForm, dispatchProduct] = useReducer(
    masterProductReducer,
    initialMasterProductFormState
  );
  const { content, validator } = productForm;

  const isInputValid = (validation: "edit" | "create"): boolean => {
    let isAllValid = true;
    for (const key in content) {
      if (key === "price" && validation === "edit") continue;
      isAllValid =
        isAllValid &&
        validator[key as keyof pharmacyProductValidities]!(
          content[key as keyof pharmacyProductForm]!
        )[0];
    }
    return isAllValid;
  };

  const formattedCreateRequest = (): createPharmacyProductRequest => {
    const productRequest: createPharmacyProductRequest = {
      product_id: Number(content.product_id),
      stock: Number(content.stock),
      price: content.price,
    };
    return productRequest;
  };

  const formattedEditRequest = (): editPharmacyProductRequest => {
    const productRequest: editPharmacyProductRequest = {
      stock: Number(content.stock),
      status: content.is_active === "false" ? "t" : "f",
    };

    return productRequest;
  };

  return [
    productForm,
    dispatchProduct,
    formattedCreateRequest,
    formattedEditRequest,
    isInputValid,
  ];
};
