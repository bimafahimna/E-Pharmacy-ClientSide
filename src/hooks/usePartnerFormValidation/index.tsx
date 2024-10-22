import * as constants from "../../constants/partner";
import {
  createPartnerRequest,
  editPartnerRequest,
  partnerForm,
  partnerFormValidities,
} from "../../utils/types";
import { useReducer } from "react";

interface day {
  name: string;
  value: number;
  checked: boolean;
}

export type partnerFormState = {
  content: partnerForm;
  validities: partnerFormValidities;
  validator: {
    [properties in keyof partnerForm]: (
      value: string,
      comparedString?: string
    ) => [boolean, string];
  };
  isAllValid: boolean;
  createPartnerRequest: createPartnerRequest | null;
  logo: File | null;
  days: day[];
};

export type partnerAction = {
  type: "onchange" | "validate" | "ondaychange" | "onfetchday";
  field?: string;
  value?: string;
  file?: File;
};

export const initialContentState: partnerForm = {
  name: "",
  year_founded: "",
  operational_start: "",
  operational_stop: "",
  logo_url: "",
  is_active: "false",
};

const initialValiditiesState: partnerFormValidities = {
  name: [true, ""],
  year_founded: [true, ""],
  operational_start: [true, ""],
  operational_stop: [true, ""],
  logo_url: [true, ""],
  is_active: [true, ""],
};

const initialValidatorState = {
  name: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  year_founded: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (/\D/.test(value)) return [false, constants.ErrMustBeANumber];
    if (Number(value) < 0) return [false, constants.ErrMustBeAPositiveNumber];
    return [true, ""];
  },
  operational_start: (
    value: string,
    comparedString?: string
  ): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (comparedString !== undefined && comparedString !== "")
      return [
        value < comparedString,
        value < comparedString ? "" : constants.ErrMustBeLess,
      ];
    return [true, ""];
  },
  operational_stop: (
    value: string,
    comparedString?: string
  ): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    if (comparedString !== undefined && comparedString !== "")
      return [
        value > comparedString,
        value > comparedString ? "" : constants.ErrMustBeMore,
      ];
    return [true, ""];
  },
  logo_url: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
  is_active: (value: string): [boolean, string] => {
    if (value === "") return [false, constants.ErrRequiredField];
    return [true, ""];
  },
};

export const initialDaysState = [
  {
    name: "monday",
    value: 0,
    checked: false,
  },
  {
    name: "tuesday",
    value: 1,
    checked: false,
  },
  {
    name: "wednesday",
    value: 2,
    checked: false,
  },
  {
    name: "thursday",
    value: 3,
    checked: false,
  },
  {
    name: "friday",
    value: 4,
    checked: false,
  },
  {
    name: "saturday",
    value: 5,
    checked: false,
  },
  {
    name: "sunday",
    value: 6,
    checked: false,
  },
];

export const initialPartnerFormState: partnerFormState = {
  content: initialContentState,
  validities: initialValiditiesState,
  validator: initialValidatorState,
  isAllValid: false,
  createPartnerRequest: null,
  days: initialDaysState,
  logo: null,
};

export const partnerReducer = (
  state: partnerFormState,
  action: partnerAction
): partnerFormState => {
  const { content, validator, validities } = state;
  const { field, value } = action;
  switch (action.type) {
    case "onchange": {
      if (field === undefined || value === undefined) return state;
      const updatedValues = {
        ...content,
        [field]: action.value,
      };

      let updatedValidities: partnerFormValidities = validities;
      if (field === "operational_start") {
        updatedValidities = {
          ...validities,
          ["operational_start"]: validator["operational_start"](
            value,
            content.operational_stop
          ),
          ["operational_stop"]: validator["operational_stop"](
            content.operational_stop,
            value
          ),
        };
      } else if (field === "operational_stop") {
        updatedValidities = {
          ...validities,
          ["operational_start"]: validator["operational_start"](
            content.operational_start,
            value
          ),
          ["operational_stop"]: validator["operational_stop"](
            value,
            content.operational_start
          ),
        };
      } else {
        let isValid: boolean;
        let message: string;

        if (validator[field as keyof partnerFormValidities] === undefined) {
          isValid = true;
          message = "";
        } else
          [isValid, message] =
            validator[field as keyof partnerFormValidities](value);

        let isFileValid = true;
        if (action.file !== undefined) {
          isFileValid = action.file.size < 500000;
          if (!isFileValid) message = constants.ErrFileSize;
        }

        updatedValidities = {
          ...validities,
          [field]: [isValid && isFileValid, message],
        };
      }

      let isAllValid = true;
      for (const key in updatedValidities) {
        isAllValid =
          isAllValid &&
          updatedValidities[key as keyof partnerFormValidities][0];
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
          logo: action.file,
        };

      return newState;
    }
    case "validate": {
      let updatedValidities: partnerFormValidities = state.validities;

      for (const key in state.content) {
        let isValid: boolean;
        let message: string;

        if (validator[field as keyof partnerFormValidities] === undefined) {
          isValid = true;
          message = "";
        } else if (key === "operational_start")
          [isValid, message] = validator[key as keyof partnerForm](
            content[key as keyof partnerFormValidities],
            content.operational_stop
          );
        else if (key === "operational_stop")
          [isValid, message] = validator[key as keyof partnerForm](
            content[key as keyof partnerFormValidities],
            content.operational_start
          );
        else
          [isValid, message] = validator[key as keyof partnerForm](
            content[key as keyof partnerForm]
          );

        let isFileValid = true;
        if (action.file !== undefined) {
          isFileValid = action.file.size < 500000;
          if (!isFileValid && key === "logo_url")
            message = constants.ErrFileSize;
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
          updatedValidities[key as keyof partnerFormValidities][0];
      }

      return {
        ...state,
        validities: updatedValidities,
        isAllValid: isAllValid,
      };
    }
    case "ondaychange": {
      if (action.value === undefined) return state;
      const updatedCheckedState = state.days.map((day, dayIndex) => {
        if (dayIndex === Number(action.value)) day.checked = !day.checked;
        return day;
      });
      return { ...state, days: updatedCheckedState };
    }

    case "onfetchday": {
      if (action.value === undefined) return state;
      const updatedCheckedState = state.days.map((day) => {
        return {
          ...day,
          checked: action.value!.split(",").includes(day.value.toString()),
        };
      });
      return { ...state, days: updatedCheckedState };
    }
  }
};

export const usePartnerValidation = (): [
  partnerFormState,
  React.Dispatch<partnerAction>,
  () => FormData,
  () => editPartnerRequest,
  (validation?: "edit" | "create") => boolean
] => {
  const [partnerForm, dispatchPartner] = useReducer(
    partnerReducer,
    initialPartnerFormState
  );
  const { content, validator, logo, days } = partnerForm;

  const isInputValid = (validation?: "edit" | "create"): boolean => {
    let isAllValid = true;
    for (const key in content) {
      if (validator[key as keyof partnerFormValidities] === undefined) continue;
      isAllValid =
        isAllValid &&
        validator[key as keyof partnerFormValidities](
          content[key as keyof partnerForm]
        )[0];
    }
    isAllValid =
      isAllValid && content.operational_stop > content.operational_start;
    if (validation !== "edit") isAllValid = isAllValid && logo !== null;
    return isAllValid;
  };

  const formattedCreateRequest = (): FormData => {
    const partnerRequest: createPartnerRequest = {
      ...content,
      operational_start: content.operational_start + "+07",
      operational_stop: content.operational_stop + "+07",
      year_founded: Number(content.year_founded),
      active_days: days
        .filter((item) => item.checked)
        .map((item) => item.value),
    };

    const formData = new FormData();
    formData.append("file", logo!);
    formData.append("tags", JSON.stringify(partnerRequest));

    return formData;
  };

  const formattedEditRequest = (): editPartnerRequest => {
    const partnerRequest: editPartnerRequest = {
      logo_url: content.logo_url,
      name: content.name,
      is_active: content.is_active,
      operational_start: content.operational_start + "+07",
      operational_stop: content.operational_stop + "+07",
      year_founded: Number(content.year_founded),
      active_days: days
        .filter((item) => item.checked)
        .map((item) => item.value),
    };

    return partnerRequest;
  };

  return [
    partnerForm,
    dispatchPartner,
    formattedCreateRequest,
    formattedEditRequest,
    isInputValid,
  ];
};
