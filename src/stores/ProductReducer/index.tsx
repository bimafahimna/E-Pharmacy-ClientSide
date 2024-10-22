import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  generalResponse,
  shopProductState,
  shopProduct,
  shopProductDetails,
  shopDetailsRequest,
  productDetailsPharmacies,
  popularRequest,
} from "../../utils/types";
import {
  fetchPopularProducts,
  fetchPopularProductsWithLocation,
  fetchProductDetailsAvailablePharmacies,
  fetchShopProductDetails,
} from "../../utils/asyncFunctions";

export const fetchPopularProductsData = createAsyncThunk<
  shopProduct[],
  AbortSignal,
  { rejectValue: string }
>("shopPopular/fetch", async (signal: AbortSignal, { rejectWithValue }) => {
  try {
    const result: generalResponse<shopProduct[]> = await fetchPopularProducts(
      signal
    );

    if (!result.data || result.message[0] !== "S") {
      return rejectWithValue(result.message || "No cart items found");
    }

    return result.data;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return [];
    } else {
      return rejectWithValue(
        error instanceof Error ? error.message : "unknown error"
      );
    }
  }
});

export const getPopularProductsDataWithLocation = createAsyncThunk<
  shopProduct[],
  popularRequest & { signal: AbortSignal },
  { rejectValue: string }
>(
  "shopPopular/fetchWithLoco",
  async (
    params: popularRequest & { signal: AbortSignal },
    { rejectWithValue }
  ) => {
    try {
      const result: generalResponse<shopProduct[]> =
        await fetchPopularProductsWithLocation(
          params.latitude,
          params.longitude,
          params.signal
        );

      if (!result.data || result.message[0] !== "S") {
        return rejectWithValue(result.message || "No cart items found");
      }

      return result.data;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return [];
      } else {
        return rejectWithValue(
          error instanceof Error ? error.message : "unknown error"
        );
      }
    }
  }
);

export const getUserProductDetails = createAsyncThunk<
  shopProductDetails,
  shopDetailsRequest,
  { rejectValue: string }
>(
  "shopProductDetails/fetch",
  async (params: shopDetailsRequest, { rejectWithValue }) => {
    try {
      const result: generalResponse<shopProductDetails> =
        await fetchShopProductDetails(params.pharmacy_id, params.product_id);

      if (result.data === undefined || result.message[0] !== "S") {
        return rejectWithValue(result.message || "unknown error");
      }

      if (result.message.includes("not found") || result.data === null) {
        return result.data;
      }

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "unknown error"
      );
    }
  }
);

export const getProductAvailablePharmacies = createAsyncThunk<
  productDetailsPharmacies[],
  number,
  { rejectValue: string }
>("availablePharmacies/fetch", async (params: number, { rejectWithValue }) => {
  try {
    const result: generalResponse<productDetailsPharmacies[]> =
      await fetchProductDetailsAvailablePharmacies(params);

    if (result.data === undefined || result.message[0] !== "S") {
      return rejectWithValue(result.message || "unknown error");
    }

    if (result.message.includes("not found") || result.data === null) {
      return result.data;
    }

    return result.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "unknown error"
    );
  }
});

const initialState: shopProductState = {
  shopPopularData: [],
  shopPopularDataWithLocation: [],
  shopProductDetailsData: null,
  shopProductDetailsAvailablePharmacies: [],
  availablePharmacyLoading: false,
  shopLoading: false,
  shopError: null,
};

const productSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    resetProductDetails: (state, action: PayloadAction<shopProductDetails>) => {
      state.shopProductDetailsData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchPopularProductsData.fulfilled,
      (state, { payload }) => {
        return {
          ...state,
          shopPopularData: payload,
          shopLoading: false,
          shopError: null,
        };
      }
    );
    builder.addCase(fetchPopularProductsData.pending, (state) => {
      return {
        ...state,
        shopLoading: true,
        shopError: null,
      };
    });
    builder.addCase(fetchPopularProductsData.rejected, (state, { payload }) => {
      if (payload === "abort") {
        return {
          ...state,
          shopLoading: false,
        };
      } else {
        return {
          ...state,
          shopLoading: false,
          shopError: payload ?? "unknown error",
        };
      }
    });

    builder.addCase(
      getPopularProductsDataWithLocation.fulfilled,
      (state, { payload }) => {
        return {
          ...state,
          shopPopularData: payload,
          shopLoading: false,
          shopError: null,
        };
      }
    );
    builder.addCase(getPopularProductsDataWithLocation.pending, (state) => {
      return {
        ...state,
        shopLoading: true,
        shopError: null,
      };
    });
    builder.addCase(
      getPopularProductsDataWithLocation.rejected,
      (state, { payload }) => {
        if (payload === "abort") {
          return {
            ...state,
            shopLoading: false,
          };
        } else {
          return {
            ...state,
            shopLoading: false,
            shopError: payload ?? "unknown error",
          };
        }
      }
    );

    builder.addCase(getUserProductDetails.fulfilled, (state, { payload }) => {
      return {
        ...state,
        shopProductDetailsData: payload,
        shopLoading: false,
        shopError: null,
      };
    });
    builder.addCase(getUserProductDetails.pending, (state) => {
      return {
        ...state,
        shopLoading: true,
        shopError: null,
      };
    });
    builder.addCase(getUserProductDetails.rejected, (state, { payload }) => {
      return {
        ...state,
        shopLoading: false,
        shopError: payload ?? "unknown error",
      };
    });

    builder.addCase(
      getProductAvailablePharmacies.fulfilled,
      (state, { payload }) => {
        return {
          ...state,
          shopProductDetailsAvailablePharmacies: payload,
          availablePharmacyLoading: false,
          shopError: null,
        };
      }
    );
    builder.addCase(getProductAvailablePharmacies.pending, (state) => {
      return {
        ...state,
        availablePharmacyLoading: true,
        shopError: null,
      };
    });
    builder.addCase(
      getProductAvailablePharmacies.rejected,
      (state, { payload }) => {
        if (payload === "abort") {
          return {
            ...state,
            availablePharmacyLoading: false,
          };
        } else {
          return {
            ...state,
            availablePharmacyLoading: false,
            shopError: payload ?? "unknown error",
          };
        }
      }
    );
  },
});

export const { resetProductDetails } = productSlice.actions;

export default productSlice.reducer;
