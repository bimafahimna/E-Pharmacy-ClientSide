import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  address,
  createAddressRequest,
  locationForm,
  profileState,
} from "../../utils/types";
import { get, post } from "../../utils/fetch";
import { addressFormState } from "../../hooks/useAddressValidation";

const initialState: profileState = {
  data: {
    email: "puxing@puxing.com",
    profile_photo_url:
      "https://i.pinimg.com/originals/a6/80/ff/a680ffed40a23b4c384aa764cce82e2f.jpg",
    profile_addresses: [],
  },
  isGet: false,
  chosenAddress: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(getAddresses.pending, (state) => {
      state.isGet = false;
    });
    builder.addCase(getAddresses.fulfilled, (state, action) => {
      const formattedAddress = action.payload.data.map((address) => {
        return {
          ...address,
          currently_selected: address.is_active === "true",
        };
      });
      state.data.profile_addresses = formattedAddress;
      state.chosenAddress = formattedAddress.filter((address) => {
        return address.currently_selected;
      })[0];
      state.isGet = true;
    });

    builder.addCase(postAddresses.rejected, (state, action) => {
      state.isGet = true;
      throw new Error(action.error.message);
    });
  },
  reducers: {
    setChosenAddress: (state, action: PayloadAction<number>) => {
      const replaceData = state.data.profile_addresses.map((address) => {
        return {
          ...address,
          currently_selected: address.id === action.payload ? true : false,
        };
      });

      state.data.profile_addresses = replaceData;

      state.chosenAddress = replaceData.filter((address) => {
        return address.currently_selected;
      })[0];
    },

    resetAddress: (state) => ({
      ...state,
      data: {
        email: "puxing@puxing.com",
        profile_photo_url:
          "https://i.pinimg.com/originals/a6/80/ff/a680ffed40a23b4c384aa764cce82e2f.jpg",
        profile_addresses: [],
      },
      isGet: true,
      chosenAddress: null,
    }),
  },
});

const addressURL = "/profile/addresses";

export const getAddresses = createAsyncThunk(
  "profile/get/addresses",
  async (): Promise<{ data: address[]; message: string }> => {
    const config = {
      credentials: "include" as RequestCredentials,
    };
    return await get<{ data: address[]; message: string }>(
      import.meta.env.VITE_BASE_URL + addressURL,
      {
        ...config,
      }
    );
  }
);

export const postAddresses = createAsyncThunk(
  "profile/post/addresses",
  async ({
    addressForm,
    location,
  }: {
    addressForm: addressFormState;
    location: locationForm;
  }): Promise<{ message: string }> => {
    const config = {
      credentials: "include" as RequestCredentials,
    };
    return await post<
      createAddressRequest,
      {
        message: string;
      }
    >(
      import.meta.env.VITE_BASE_URL + addressURL,
      {
        ...addressForm.content,
        city_id: addressForm.id.city!,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
      },
      {
        ...config,
      }
    );
  }
);

export const { setChosenAddress, resetAddress } = profileSlice.actions;

export default profileSlice.reducer;
