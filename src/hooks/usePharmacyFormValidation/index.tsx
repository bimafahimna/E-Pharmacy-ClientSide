import { useReducer } from "react";
import {
  createPharmacyRequest,
  locationForm,
  pharmacyForm,
  pharmacyFormId,
  pharmacyFormValidities,
} from "../../utils/types";

export type pharmacyFormState = {
  id: pharmacyFormId;
  content: pharmacyForm;
  validities: pharmacyFormValidities;
  validator: {
    [properties in keyof pharmacyForm]: (
      value: string,
      comparedString?: string
    ) => boolean;
  };
  isAllValid: boolean;
};

export type pharmacyAction = {
  type: "onchange" | "validate";
  field: string;
  value: string;
  id?: string | null;
};

export const initialIdState: pharmacyFormId = {
  pharmacist: null,
  partner: null,
  name: null,
  address: null,
  city: null,
  is_active: null,
};

export const initialContentState: pharmacyForm = {
  pharmacist: "",
  partner: "",
  name: "",
  address: "",
  city: "",
  is_active: "false",
};

const initialValiditiesState: pharmacyFormValidities = {
  pharmacist: true,
  partner: true,
  name: true,
  address: true,
  city: true,
  is_active: true,
};

const initialValidatorState = {
  pharmacist: (value: string) => {
    return value !== "";
  },
  partner: (value: string) => {
    return value !== "";
  },
  name: (value: string) => {
    return value !== "";
  },
  address: (value: string) => {
    return value !== "";
  },
  city: (value: string) => {
    return value !== "";
  },
  is_active: (value: string) => {
    return value !== "";
  },
};

export const initialPharmacyFormState: pharmacyFormState = {
  id: initialIdState,
  content: initialContentState,
  validities: initialValiditiesState,
  validator: initialValidatorState,
  isAllValid: false,
};

export const pharmacyReducer = (
  state: pharmacyFormState,
  action: pharmacyAction
): pharmacyFormState => {
  switch (action.type) {
    case "onchange": {
      const updatedValues = {
        ...state.content,
        [action.field]: action.value,
      };

      const updatedValidities: pharmacyFormValidities = {
        ...state.validities,
        [action.field]: state.validator[action.field as keyof pharmacyForm](
          action.value
        ),
      };

      let updatedId = {
        ...state.id,
      };

      if (!(action.id === undefined)) {
        updatedId = {
          ...state.id,
          [action.field]: action.id,
        };
      }

      let isAllValid = true;
      for (const key in updatedValidities) {
        isAllValid =
          isAllValid && updatedValidities[key as keyof pharmacyFormValidities];
      }

      return {
        ...state,
        id: updatedId,
        content: updatedValues,
        validities: updatedValidities,
        isAllValid: isAllValid,
      };
    }
    case "validate": {
      let updatedValidities: pharmacyFormValidities = {
        ...state.validities,
      };

      for (const key in state.content) {
        if (state.content[key as keyof pharmacyForm]) continue;
        updatedValidities = {
          ...updatedValidities,
          [key]: state.validator[key as keyof pharmacyFormValidities](
            state.content[key as keyof pharmacyForm]
          ),
        };
      }

      let isAllValid = true;
      for (const key in updatedValidities) {
        isAllValid =
          isAllValid && updatedValidities[key as keyof pharmacyFormValidities];
      }

      return {
        ...state,
        validities: updatedValidities,
        isAllValid: isAllValid,
      };
    }
  }
};

export const usePharmacyValidation = (): [
  pharmacyFormState,
  React.Dispatch<pharmacyAction>,
  () => boolean,
  (location: locationForm, logistics: number[]) => createPharmacyRequest
] => {
  const [pharmacyForm, dispatchPharmacy] = useReducer(
    pharmacyReducer,
    initialPharmacyFormState
  );
  const formattedCreateRequest = (
    location: locationForm,
    logistics: number[]
  ): createPharmacyRequest => {
    return {
      ...pharmacyForm.content,
      longitude: location!.longitude.toString(),
      latitude: location!.latitude.toString(),
      pharmacist_id: Number(pharmacyForm.id.pharmacist!),
      partner_id: Number(pharmacyForm.id.partner!),
      city_id: Number(pharmacyForm.id.city),
      logistics: logistics,
    };
  };
  const isInputValid = (): boolean => {
    let isAllValid = true;
    for (const key in pharmacyForm.content) {
      isAllValid =
        isAllValid &&
        pharmacyForm.validator[key as keyof pharmacyFormValidities](
          pharmacyForm.content[key as keyof pharmacyForm]
        );
    }

    isAllValid = isAllValid && pharmacyForm.id.pharmacist !== null;
    isAllValid = isAllValid && pharmacyForm.id.partner !== null;
    return isAllValid;
  };

  return [pharmacyForm, dispatchPharmacy, isInputValid, formattedCreateRequest];
};
