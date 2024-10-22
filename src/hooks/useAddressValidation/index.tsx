import { useReducer } from "react";
import * as constants from "../../constants/address";
import { addressForm, addressFormValidities } from "../../utils/types";

export type addressFormState = {
  id: {
    [properties in keyof addressForm]?: string | null;
  };
  official_id: {
    [properties in keyof addressForm]?: string | null;
  };
  content: addressForm;
  validities: addressFormValidities;
  validator: {
    [properties in keyof addressForm]: (
      value: string,
      comparedString?: string
    ) => [boolean, string];
  };
  isAllValid: boolean;
};

export type addressAction = {
  type: "onchange" | "validate";
  field?: keyof addressForm;
  value?: string;
  id?: string | null;
  official_id?: string | null;
};

export const initialIdState = {
  city: null,
  province: null,
};

export const initialOfficialIdState = {
  city: null,
  district: null,
  sub_district: null,
};

export const initialContentState: addressForm = {
  name: "",
  receiver_name: "",
  receiver_phone_number: "",
  address_details: "",
  address_line_2: "",
  sub_district: "",
  district: "",
  city: "",
  province: "",
  postcode: "",
  is_active: "false",
};

const initialValiditiesState: addressFormValidities = {
  name: [true, ""],
  receiver_name: [true, ""],
  receiver_phone_number: [true, ""],
  address_details: [true, ""],
  address_line_2: [true, ""],
  sub_district: [true, ""],
  district: [true, ""],
  city: [true, ""],
  province: [true, ""],
  postcode: [true, ""],
};

const initialValidatorState = {
  name: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (value.length > 75) return [false, constants.ErrName];
    return [true, ""];
  },
  receiver_name: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (value.length > 75) return [false, constants.ErrName];
    return [true, ""];
  },
  receiver_phone_number: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (/\D/.test(value)) return [false, constants.ErrMustBeANumber];
    if (Number(value) < 0) return [false, constants.ErrMustBeAPositiveNumber];
    return [true, ""];
  },
  address_details: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  address_line_2: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  sub_district: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  district: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  city: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  province: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  postcode: (value: string): [boolean, string] => {
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

export const initialAddressState: addressFormState = {
  id: initialIdState,
  official_id: initialOfficialIdState,
  content: initialContentState,
  validities: initialValiditiesState,
  validator: initialValidatorState,
  isAllValid: false,
};

export const AddressReducer = (
  state: addressFormState,
  action: addressAction
): addressFormState => {
  switch (action.type) {
    case "onchange": {
      if (action.field === undefined || action.value === undefined)
        return state;
      let updatedValues = {
        ...state.content,
        [action.field]: action.value,
      };

      updatedValues = {
        ...updatedValues,
        ["address_line_2"]: [
          updatedValues.address_details,
          updatedValues.sub_district,
          updatedValues.district,
          updatedValues.city,
          updatedValues.province,
        ].join(", "),
      };

      let isValid: boolean;
      let message: string;
      [isValid, message] = state.validator[action.field](action.value);

      let updatedID = state.id;
      if (state.id[action.field] !== undefined) {
        if (action.id === null || action.id === undefined) {
          updatedID = { ...state.id, [action.field]: null };
        } else updatedID = { ...state.id, [action.field]: action.id };
        isValid = true;
      }

      let updatedOfficialID = state.official_id;
      if (state.official_id[action.field] !== undefined) {
        if (action.official_id === null || action.official_id === undefined) {
          updatedOfficialID = { ...state.official_id, [action.field]: null };
        } else
          updatedOfficialID = {
            ...state.official_id,
            [action.field]: action.official_id,
          };
        isValid = true;
      }

      const updatedValidities: addressFormValidities = {
        ...state.validities,
        [action.field]: [isValid, message],
      };

      let isAllValid = true;
      for (const key in updatedValidities) {
        isAllValid =
          isAllValid &&
          updatedValidities[key as keyof addressFormValidities][0];
      }
      return {
        ...state,
        official_id: updatedOfficialID,
        id: updatedID,
        content: updatedValues,
        validities: updatedValidities,
        isAllValid: isAllValid,
      };
    }
    case "validate": {
      let updatedValidities: addressFormValidities = state.validities;
      for (const key in state.content) {
        let isValid: boolean;
        let message: string;
        [isValid, message] = state.validator[key as keyof addressForm](
          state.content[key as keyof addressForm]
        );

        if (state.id[key as keyof addressForm] !== undefined) {
          if (state.id[key as keyof addressForm] === null) {
            message = constants.ErrDropdown;
            isValid = false;
          }
        }

        if (state.official_id[key as keyof addressForm] !== undefined) {
          if (state.official_id[key as keyof addressForm] === null) {
            message = constants.ErrDropdown;
            isValid = false;
          }
        }

        updatedValidities = {
          ...updatedValidities,
          [key]: [isValid, message],
        };
      }
      let isAllValid = true;
      for (const key in updatedValidities) {
        isAllValid =
          isAllValid &&
          updatedValidities[key as keyof addressFormValidities][0];
      }

      return {
        ...state,
        validities: updatedValidities,
        isAllValid: isAllValid,
      };
    }
  }
};

export const useAddressValidation = (): [
  addressFormState,
  React.Dispatch<addressAction>
] => {
  const [addressForm, dispatchAddress] = useReducer(
    AddressReducer,
    initialAddressState
  );
  return [addressForm, dispatchAddress];
};
