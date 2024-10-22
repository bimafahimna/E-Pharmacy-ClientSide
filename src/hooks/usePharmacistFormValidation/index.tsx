import * as constants from "../../constants/pharmacist";
import { useReducer } from "react";
import {
  createPharmacistRequest,
  editPharmacistRequest,
  pharmacistForm,
  pharmacistFormValidities,
} from "../../utils/types";

export type pharmacistFormState = {
  content: pharmacistForm;
  validities: pharmacistFormValidities;
  validator: {
    [properties in keyof pharmacistForm]: (
      value: string,
      comparedString?: string
    ) => [boolean, string];
  };
  isAllValid: boolean;
};

export type pharmacistAction = {
  type: "onchange" | "validate";
  field: string;
  value: string;
};

export const initialContentState: pharmacistForm = {
  name: "",
  email: "",
  password: "",
  sipa_number: "",
  whatsapp_number: "",
  years_of_experience: "0",
};

const initialValiditiesState: pharmacistFormValidities = {
  name: [true, ""],
  email: [true, ""],
  password: [true, ""],
  sipa_number: [true, ""],
  whatsapp_number: [true, ""],
  years_of_experience: [true, ""],
};

const initialValidatorState = {
  name: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  email: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  password: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },

  sipa_number: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  whatsapp_number: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (/\D/.test(value)) return [false, constants.ErrMustBeANumber];
    if (Number(value) < 0) return [false, constants.ErrMustBeAPositiveNumber];
    return [true, ""];
  },
  years_of_experience: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (/\D/.test(value)) return [false, constants.ErrMustBeANumber];
    if (Number(value) < 0) return [false, constants.ErrMustBeAPositiveNumber];
    return [true, ""];
  },
};

export const initialPharmacistsFormState: pharmacistFormState = {
  content: initialContentState,
  validities: initialValiditiesState,
  validator: initialValidatorState,
  isAllValid: false,
};

export const pharmacistReducer = (
  state: pharmacistFormState,
  action: pharmacistAction
): pharmacistFormState => {
  switch (action.type) {
    case "onchange": {
      const updatedValues = {
        ...state.content,
        [action.field]: action.value,
      };

      const updatedValidities: pharmacistFormValidities = {
        ...state.validities,
        [action.field]: state.validator[action.field as keyof pharmacistForm](
          action.value
        ),
      };

      let isAllValid = true;
      for (const key in updatedValidities) {
        isAllValid =
          isAllValid &&
          updatedValidities[key as keyof pharmacistFormValidities][0];
      }
      return {
        ...state,
        content: updatedValues,
        validities: updatedValidities,
        isAllValid: isAllValid,
      };
    }
    case "validate": {
      let updatedValidities: pharmacistFormValidities = {
        ...state.validities,
      };

      for (const key in state.content) {
        updatedValidities = {
          ...updatedValidities,
          [key]: state.validator[key as keyof pharmacistFormValidities](
            state.content[key as keyof pharmacistForm]
          ),
        };
      }

      let isAllValid = true;
      for (const key in updatedValidities) {
        isAllValid =
          isAllValid &&
          updatedValidities[key as keyof pharmacistFormValidities][0];
      }

      return {
        ...state,
        validities: updatedValidities,
        isAllValid: isAllValid,
      };
    }
  }
};

export const usePharmacistValidation = (): [
  pharmacistFormState,
  React.Dispatch<pharmacistAction>,
  () => boolean,
  () => editPharmacistRequest,
  () => createPharmacistRequest
] => {
  const [pharmacistForm, dispatchPharmacist] = useReducer(
    pharmacistReducer,
    initialPharmacistsFormState
  );

  const isInputValid = (): boolean => {
    let isAllValid = true;
    for (const key in pharmacistForm.content) {
      if (key === "password") continue;
      isAllValid =
        isAllValid &&
        pharmacistForm.validator[key as keyof pharmacistFormValidities](
          pharmacistForm.content[key as keyof pharmacistForm]
        )[0];
    }
    return isAllValid;
  };

  const formattedCreateRequest = (): createPharmacistRequest => {
    const pharmacistCreate = {
      ...pharmacistForm.content,
      logo_url: "",
    };
    return pharmacistCreate;
  };

  const formattedEditRequest = (): editPharmacistRequest => {
    const pharmacistEdit = {
      whatsapp_number: pharmacistForm.content.whatsapp_number,
      years_of_experience: pharmacistForm.content.years_of_experience,
    };
    return pharmacistEdit;
  };
  return [
    pharmacistForm,
    dispatchPharmacist,
    isInputValid,
    formattedEditRequest,
    formattedCreateRequest,
  ];
};
