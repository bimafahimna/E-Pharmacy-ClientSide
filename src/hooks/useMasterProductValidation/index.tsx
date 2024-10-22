import * as constants from "../../constants/masterProduct";
import {
  createMasterProductRequest,
  masterProductForm,
  masterProductFormValidities,
} from "../../utils/types";
import { useReducer } from "react";

export type masterProductFormState = {
  id: {
    [properties in keyof masterProductForm]?: string | null;
  };
  content: masterProductForm;
  validities: masterProductFormValidities;
  validator: {
    [properties in keyof masterProductForm]: (
      value: string,
      comparedString?: string
    ) => [boolean, string];
  };
  isAllValid: boolean;
  image: File | null;
};

export type masterProductAction = {
  type: "onchange" | "validate";
  field?: keyof masterProductForm;
  value?: string;
  file?: File;
  id?: string | null;
};

export const initialIdState = {
  manufacturer: null,
  product_classification: null,
  product_form: null,
};

export const initialContentState: masterProductForm = {
  name: "",
  manufacturer: "",
  product_classification: "",
  product_form: "",
  generic_name: "",
  categories: "",
  description: "",
  unit_in_pack: "",
  selling_unit: "",
  weight: "",
  height: "",
  length: "",
  width: "",
  image_url: "",
  is_active: "false",
};

const initialValiditiesState: masterProductFormValidities = {
  name: [true, ""],
  manufacturer: [true, ""],
  product_classification: [true, ""],
  product_form: [true, ""],
  generic_name: [true, ""],
  categories: [true, ""],
  description: [true, ""],
  unit_in_pack: [true, ""],
  selling_unit: [true, ""],
  weight: [true, ""],
  height: [true, ""],
  length: [true, ""],
  width: [true, ""],
  image_url: [true, ""],
  is_active: [true, ""],
};

const initialValidatorState = {
  name: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (value.length > 75) return [false, constants.ErrName];
    return [true, ""];
  },
  manufacturer: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  product_classification: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  product_form: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },

  generic_name: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },

  categories: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },

  description: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },

  unit_in_pack: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (/\D/.test(value)) return [false, constants.ErrMustBeANumber];
    if (Number(value) < 0) return [false, constants.ErrMustBeAPositiveNumber];
    return [true, ""];
  },
  selling_unit: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  weight: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (/\D/.test(value)) return [false, constants.ErrMustBeANumber];
    if (Number(value) < 0) return [false, constants.ErrMustBeAPositiveNumber];
    return [true, ""];
  },

  height: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (/\D/.test(value)) return [false, constants.ErrMustBeANumber];
    if (Number(value) < 0) return [false, constants.ErrMustBeAPositiveNumber];
    return [true, ""];
  },

  length: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (/\D/.test(value)) return [false, constants.ErrMustBeANumber];
    if (Number(value) < 0) return [false, constants.ErrMustBeAPositiveNumber];
    return [true, ""];
  },

  width: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (/\D/.test(value)) return [false, constants.ErrMustBeANumber];
    if (Number(value) < 0) return [false, constants.ErrMustBeAPositiveNumber];
    return [true, ""];
  },

  image_url: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },

  is_active: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
};

export const initialMasterProductFormState: masterProductFormState = {
  id: initialIdState,
  content: initialContentState,
  validities: initialValiditiesState,
  validator: initialValidatorState,
  isAllValid: false,
  image: null,
};

export const masterProductReducer = (
  state: masterProductFormState,
  action: masterProductAction
): masterProductFormState => {
  const { content, validator, validities } = state;
  const { field, value } = action;
  switch (action.type) {
    case "onchange": {
      if (field === undefined || value === undefined) return state;
      const updatedValues = {
        ...content,
        [field]: action.value,
      };

      let updatedValidities: masterProductFormValidities = validities;
      let isValid: boolean;
      let message: string;
      [isValid, message] = validator[field](value);

      let isFileValid = true;
      if (action.file !== undefined) {
        isFileValid = action.file.size < 500000;
        if (!isFileValid) message = constants.ErrFileSize;
      }

      let updatedID = state.id;
      if (state.id[field] !== undefined) {
        if (action.id === null || action.id === undefined) {
          message = constants.ErrDropdown;
          isValid = false;
          updatedID = { ...state.id, [field]: null };
        } else updatedID = { ...state.id, [field]: action.id };
      }

      updatedValidities = {
        ...validities,
        [field]: [isValid && isFileValid, message],
      };

      let isAllValid = true;
      for (const key in updatedValidities) {
        isAllValid =
          isAllValid &&
          updatedValidities[key as keyof masterProductFormValidities][0];
      }

      const newState = {
        ...state,
        id: updatedID,
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
      let updatedValidities: masterProductFormValidities = state.validities;

      for (const key in state.content) {
        let isValid: boolean;
        let message: string;
        [isValid, message] = validator[key as keyof masterProductForm](
          content[key as keyof masterProductForm]
        );

        if (state.id[key as keyof masterProductForm] !== undefined) {
          if (state.id[key as keyof masterProductForm] === null) {
            message = constants.ErrDropdown;
            isValid = false;
          }
        }

        let isFileValid = true;
        if (action.file !== undefined) {
          isFileValid = action.file.size < 500000;
          if (!isFileValid && key === "image_url")
            message = constants.ErrFileSize;
        }

        updatedValidities = {
          ...updatedValidities,
          [key]: [isValid && isFileValid, message],
        };
      }

      let isAllValid = true;
      for (const key in updatedValidities) {
        isAllValid =
          isAllValid &&
          updatedValidities[key as keyof masterProductFormValidities][0];
      }

      return {
        ...state,
        validities: updatedValidities,
        isAllValid: isAllValid,
      };
    }
  }
};

export const useMasterProductValidation = (): [
  masterProductFormState,
  React.Dispatch<masterProductAction>,
  () => FormData,
  () => boolean
] => {
  const [partnerForm, dispatchPartner] = useReducer(
    masterProductReducer,
    initialMasterProductFormState
  );
  const { id, content, validator, image } = partnerForm;

  const isInputValid = (): boolean => {
    let isAllValid = true;
    for (const key in content) {
      isAllValid =
        isAllValid &&
        validator[key as keyof masterProductFormValidities](
          content[key as keyof masterProductForm]
        )[0];
    }
    return isAllValid;
  };

  const formattedCreateRequest = (): FormData => {
    const productRequest: createMasterProductRequest = {
      ...content,
      categories:
        "{" +
        content
          .product_classification!.split(",")
          .map((item) => '"' + item + '"')
          .join(",") +
        "}",
      manufacturer_id: id.manufacturer!,
      product_classification_id: id.product_classification!,
      product_form_id: id.product_form!,
      unit_in_pack: content.unit_in_pack,
    };

    const formData = new FormData();
    formData.append("file", image!);
    constants.MasterProductCreateRequest.forEach((key) => {
      formData.append(key, productRequest[key]);
    });

    return formData;
  };

  return [partnerForm, dispatchPartner, formattedCreateRequest, isInputValid];
};
