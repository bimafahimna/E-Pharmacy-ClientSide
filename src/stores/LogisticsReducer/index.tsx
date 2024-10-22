import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  logisticsDataState,
  logisticsParam,
  checkoutLogistics,
  logisticsItem,
} from "../../utils/types";
import { fetchPharmacyLogistics } from "../../utils/asyncFunctions";

export const getPharmacyLogistics = createAsyncThunk<
  checkoutLogistics,
  logisticsParam,
  { rejectValue: string }
>(
  "checkout/fetch/logistics",
  async (params: logisticsParam, { rejectWithValue }) => {
    try {
      const result = await fetchPharmacyLogistics(
        params.pharmacy_id,
        params.address_id,
        params.order_weight
      );

      if (result.message[0] !== "S") throw new Error("fetch failed");

      if (!result.data) {
        throw new Error("Fetching failed");
      }

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "unknown error"
      );
    }
  }
);

const initialState: logisticsDataState = {
  logisticsData: [],
  logisticsLoading: false,
  logisticsError: null,
};

export const checkoutLogisticsData = createSlice({
  name: "checkoutLogisticsData",
  initialState,
  reducers: {
    setChosenLogistic: (
      state,
      action: PayloadAction<{ id: number; pharmacy_name: string }>
    ) => {
      state.logisticsData = state.logisticsData.map((pharmacy) => {
        if (pharmacy.pharmacy_name === action.payload.pharmacy_name) {
          return {
            ...pharmacy,
            logistics: pharmacy.logistics.map((logistic) => {
              return {
                ...logistic,
                currently_chosen:
                  logistic.id === action.payload.id ? true : false,
              };
            }),
          };
        } else {
          return {
            ...pharmacy,
          };
        }
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getPharmacyLogistics.fulfilled, (state, { payload }) => {
      const isLogisticsAlreadyExists = state.logisticsData.find(
        (pharmacy) => pharmacy.pharmacy_id === payload.pharmacy_id
      );

      if (!isLogisticsAlreadyExists) {
        // state.logisticsData.push({
        //   ...payload,
        //   logistics: payload.logistics.map((logistic) => ({
        //     ...logistic,
        //     currently_chosen: logistic.is_recommended,
        //   })),
        // });

        const nonZeroLogistic: logisticsItem[] = payload.logistics.filter(
          (item) => {
            return item.price !== "0";
          }
        );

        const isReccExists: logisticsItem | undefined = nonZeroLogistic.find(
          (item) => {
            return item.is_recommended === true;
          }
        );

        if (isReccExists) {
          const populateCurrChosen: logisticsItem[] = nonZeroLogistic.map(
            (item) => {
              return {
                ...item,
                currently_chosen: item.is_recommended,
              };
            }
          );
          state.logisticsData.push({
            ...payload,
            logistics: populateCurrChosen,
          });
        } else {
          const minPriceLogistic = nonZeroLogistic.reduce(
            (minItem, currentItem) =>
              parseFloat(currentItem.price) < parseFloat(minItem.price)
                ? currentItem
                : minItem
          );

          const populateCurrChosen: logisticsItem[] = nonZeroLogistic.map(
            (item) => ({
              ...item,
              currently_chosen: item.id === minPriceLogistic.id,
            })
          );

          state.logisticsData.push({
            ...payload,
            logistics: populateCurrChosen,
          });
        }
      } else {
        //
      }
      state.logisticsLoading = false;
      state.logisticsError = null;
    });
    builder.addCase(getPharmacyLogistics.pending, (state) => {
      return {
        ...state,
        logisticsLoading: true,
        logisticsError: null,
      };
    });
    builder.addCase(getPharmacyLogistics.rejected, (state, { payload }) => {
      return {
        ...state,
        logisticsData: [],
        logisticsError: payload ?? "unknown error",
        logisticsLoading: false,
      };
    });
  },
});

export const { setChosenLogistic } = checkoutLogisticsData.actions;

export default checkoutLogisticsData.reducer;
