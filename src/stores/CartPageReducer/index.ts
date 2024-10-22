import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  cartCardType,
  cartSentDeleteRequest,
  cartPageState,
  cartSentUpdateRequest,
  cartTrimmedData,
  messageOnlyResponse,
  cartCardPersisted,
  cartRevertInput,
} from "../../utils/types";
import {
  fetchUserCart,
  fetchUpdateCartData,
  fetchDeleteCartData,
  fetchPostCart,
} from "../../utils/asyncFunctions";
import { loadState, saveState } from "../../utils/localStorageUtil";

export const addCartData = createAsyncThunk<
  messageOnlyResponse,
  cartSentUpdateRequest | undefined,
  { rejectValue: string }
>(
  "cart/post",
  async (params: cartSentUpdateRequest | undefined, { rejectWithValue }) => {
    try {
      if (!params) {
        throw new Error("Invalid cart data, failed to add item to your cart");
      }

      const result = await fetchPostCart(
        params.pharmacy_id,
        params.product_id,
        params.quantity
      );

      if (!result) {
        throw new Error(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "unknown error"
      );
    }
  }
);

export const deleteCartData = createAsyncThunk<
  messageOnlyResponse,
  cartSentDeleteRequest,
  { rejectValue: string }
>(
  "cart/delete",
  async (params: cartSentDeleteRequest | undefined, { rejectWithValue }) => {
    try {
      if (!params) {
        throw new Error("Invalid cart data, failed to delete");
      }

      const result = await fetchDeleteCartData(
        params.pharmacy_id,
        params.product_id
      );

      if (!result) {
        throw new Error(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "unknown error"
      );
    }
  }
);

export const updateCartData = createAsyncThunk<
  messageOnlyResponse,
  cartSentUpdateRequest | undefined,
  { rejectValue: string }
>(
  "cart/update",
  async (params: cartSentUpdateRequest | undefined, { rejectWithValue }) => {
    try {
      if (!params) {
        throw new Error("Invalid cart data, failed to update");
      }

      const result = await fetchUpdateCartData(
        params.pharmacy_id,
        params.product_id,
        params.quantity
      );

      if (!result) {
        throw new Error(result);
      }

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "unknown error"
      );
    }
  }
);

export const fetchUserCartData = createAsyncThunk<
  cartCardType[],
  void,
  { rejectValue: string }
>("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    const result = await fetchUserCart();

    if (
      !result.data ||
      (result.data.length === 0 && result.message[0] === "F")
    ) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "unknown error"
    );
  }
});

const initialState: cartPageState = {
  debouncedSentData: {
    pharmacy_id: 0,
    product_id: 0,
    quantity: 0,
  },
  cartPagePersistedData: [],
  cartPageTrimmedData: [],
  cartPageData: [],
  cartPageDataLoading: false,
  cartPageDataError: null,
};

export const userCartData = createSlice({
  name: "userCartData",
  initialState,
  reducers: {
    setPersistedData: (state, action: PayloadAction<cartCardPersisted[]>) => {
      saveState("cartPagePersistedData", action.payload);

      state.cartPagePersistedData = action.payload;
    },

    loadPersistedData: (state, action: PayloadAction<string>) => {
      state.cartPagePersistedData = loadState(action.payload);
    },

    setTrimmedData: (state, action: PayloadAction<cartTrimmedData>) => {
      state.cartPageTrimmedData = state.cartPageTrimmedData.filter(
        (item) =>
          !(
            item.pharmacy_id === action.payload.pharmacy_id &&
            item.product_id === action.payload.product_id
          )
      );
    },

    invalidateModifiedData: (
      state,
      action: PayloadAction<cartTrimmedData[]>
    ) => {
      state.cartPageTrimmedData = state.cartPageTrimmedData
        .filter((item) => {
          return item.hasModified === false;
        })
        .concat(...action.payload);
    },

    resetCartState: (state) => {
      state.debouncedSentData = {
        pharmacy_id: 0,
        product_id: 0,
        quantity: 0,
      };
      state.cartPageTrimmedData = [];
      state.cartPageData = [];
      state.cartPageDataLoading = false;
      state.cartPageDataError = null;
    },

    setUpdateCart: (state, action: PayloadAction<cartTrimmedData>) => {
      const index = state.cartPageTrimmedData.findIndex(
        (item) =>
          item.pharmacy_id === action.payload.pharmacy_id &&
          item.product_id === action.payload.product_id
      );
      if (index !== -1) {
        state.cartPageTrimmedData[index] = {
          ...action.payload,
          hasModified: true,
        };
      } else {
        state.cartPageTrimmedData.push({
          ...action.payload,
          hasModified: true,
        });
      }
    },

    setDebouncedSentData: (
      state,
      action: PayloadAction<cartSentUpdateRequest>
    ) => {
      state.debouncedSentData = action.payload;
    },

    revertInvalidInput: (state, action: PayloadAction<cartRevertInput>) => {
      const index = state.cartPageTrimmedData.findIndex(
        (item) =>
          item.pharmacy_id === action.payload.pharmacy_id &&
          item.product_id === action.payload.product_id
      );
      if (index !== -1) {
        state.cartPageTrimmedData[index].quantity =
          state.cartPageData
            .flatMap((data) => data.items)
            .find(
              (item) =>
                item.pharmacy_id === action.payload.pharmacy_id &&
                item.product_id === action.payload.product_id
            )?.quantity || 1;
      }
    },

    revertMaxInvalidData: (state, action: PayloadAction<cartRevertInput>) => {
      const index = state.cartPageTrimmedData.findIndex(
        (item) =>
          item.pharmacy_id === action.payload.pharmacy_id &&
          item.product_id === action.payload.product_id
      );
      if (index !== -1) {
        state.cartPageTrimmedData[index].quantity =
          state.cartPageData
            .flatMap((data) => data.items)
            .find(
              (item) =>
                item.pharmacy_id === action.payload.pharmacy_id &&
                item.product_id === action.payload.product_id
            )?.stock || 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserCartData.fulfilled, (state, { payload }) => {
      const persistDataToSave: cartCardPersisted[] = payload.map((data) => {
        const isAllItemUnavailable = data.items.every(
          (item) => item.stock <= 0
        );

        const totalOrderWeight = data.items.reduce((acc, item) => {
          const itemWeight = Number(item.weight) || 0;
          const totalItemWeight = itemWeight * item.quantity;
          return acc + totalItemWeight;
        }, 0);

        return {
          ...data,
          pharmacy_id: data.items[0].pharmacy_id,
          is_selected_all_item: !isAllItemUnavailable,
          order_weight: totalOrderWeight.toString(),
          items: data.items.map((item) => ({
            ...item,
            is_selected_item: item.stock > 0,
          })),
        };
      });

      saveState("cartPagePersistedData", persistDataToSave);
      return {
        ...state,
        cartPageSentData: {
          pharmacy_id: 0,
          product_id: 0,
          quantity: 0,
        },
        cartPageTrimmedData: payload.flatMap((data) =>
          data.items.map((item) => ({
            pharmacy_id: item.pharmacy_id,
            product_id: item.product_id,
            stock: item.stock,
            quantity: item.quantity,
            hasModified: false,
          }))
        ),
        cartPageData: payload,
        cartPageDataLoading: false,
        cartPageDataError: null,
      };
    });
    builder.addCase(fetchUserCartData.pending, (state) => {
      return {
        ...state,
        cartPageSentData: {
          pharmacy_id: 0,
          product_id: 0,
          quantity: 0,
        },
        cartPageDataError: null,
        cartPageDataLoading: true,
      };
    });
    builder.addCase(fetchUserCartData.rejected, (state, { payload }) => {
      return {
        ...state,
        cartPageSentData: {
          pharmacy_id: 0,
          product_id: 0,
          quantity: 0,
        },
        cartPageDataError: payload ?? "unknown error",
        cartPageDataLoading: false,
      };
    });

    builder.addCase(updateCartData.fulfilled, (state) => {
      return {
        ...state,
        cartPageDataError: null,
        cartPageDataLoading: false,
      };
    });
    builder.addCase(updateCartData.pending, (state) => {
      return {
        ...state,
        cartPageDataError: null,
        cartPageDataLoading: true,
      };
    });
    builder.addCase(updateCartData.rejected, (state, { payload }) => {
      return {
        ...state,
        cartPageDataError: (payload || "unknown error") ?? "unknown error",
        cartPageDataLoading: false,
      };
    });

    builder.addCase(deleteCartData.fulfilled, (state) => {
      return {
        ...state,
        cartPageDataError: null,
        cartPageDataLoading: false,
      };
    });
    builder.addCase(deleteCartData.pending, (state) => {
      return {
        ...state,
        cartPageDataError: null,
        cartPageDataLoading: true,
      };
    });
    builder.addCase(deleteCartData.rejected, (state, { payload }) => {
      return {
        ...state,
        cartPageDataError: (payload || "unknown error") ?? "unknown error",
        cartPageDataLoading: false,
      };
    });

    builder.addCase(addCartData.fulfilled, (state) => {
      return {
        ...state,
        cartPageDataError: null,
        cartPageDataLoading: false,
      };
    });
    builder.addCase(addCartData.pending, (state) => {
      return {
        ...state,
        cartPageDataError: null,
        cartPageDataLoading: true,
      };
    });
    builder.addCase(addCartData.rejected, (state, { payload }) => {
      return {
        ...state,
        cartPageDataError: (payload || "unknown error") ?? "unknown error",
        cartPageDataLoading: false,
      };
    });
  },
});

export const {
  resetCartState,
  setUpdateCart,
  setTrimmedData,
  setPersistedData,
  loadPersistedData,
  revertInvalidInput,
  revertMaxInvalidData,
  invalidateModifiedData,
  setDebouncedSentData,
} = userCartData.actions;

export default userCartData.reducer;
