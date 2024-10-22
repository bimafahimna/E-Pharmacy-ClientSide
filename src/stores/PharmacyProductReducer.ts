import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  crudState,
  generalResponse,
  getPaginatedRequest,
  masterProduct,
  pharmacyProduct,
  createPharmacyProductRequest,
  ResponseError,
  editPharmacyProductRequest,
  pharmacistOrder,
  statusOrderRequest,
} from "../utils/types";
import { del, get, patch, post, put } from "../utils/fetch";
import { invokeToast } from "../utils/invokeToast";
import { errorHandler } from "../errorHandler/errorHandler";
import { RootState } from "./store";

const initialState: {
  pharmacyProduct: crudState<pharmacyProduct>;
  masterProduct: crudState<masterProduct>;
  orders: crudState<pharmacistOrder>;
} = {
  pharmacyProduct: {
    paginated: {
      message: "",
      data: [],
      pagination: {
        current_page: -1,
        total_records: -1,
        total_pages: -1,
        prev_page: false,
        next_page: false,
      },
      query: {
        page: 1,
        limit: 10,
        sortBy: "name",
        sort: "asc",
        filters: {
          pharmacy_id: [false, ""],
          product_id: [false, ""],
          name: [false, ""],
          generic_name: [false, ""],
          manufacturer: [false, ""],
          product_classification: [false, ""],
          product_form: [false, ""],
          price: [false, ""],
          stock: [false, ""],
          is_active: [false, ""],
        },
      },
      isLoading: false,
    },
    post: {
      message: "",
      isLoading: false,
    },
    put: {
      id: -1,
      data: null,
      message: "",
      isLoading: false,
    },
    delete: {
      id: -1,
      message: "",
      isLoading: false,
    },
  },
  masterProduct: {
    paginated: {
      message: "",
      data: [],
      pagination: {
        current_page: -1,
        total_records: -1,
        total_pages: -1,
        prev_page: false,
        next_page: false,
      },
      query: {
        page: 1,
        limit: 10,
        sortBy: "name",
        sort: "asc",
        filters: {
          id: [false, ""],
          name: [false, ""],
          manufacturer: [false, ""],
          product_classification: [false, ""],
          product_form: [false, ""],
          is_active: [false, ""],
        },
      },
      isLoading: false,
    },
    post: {
      message: "",
      isLoading: false,
    },
    put: {
      id: -1,
      data: null,
      message: "",
      isLoading: false,
    },
    delete: {
      id: -1,
      message: "",
      isLoading: false,
    },
  },
  orders: {
    paginated: {
      message: "",
      data: [],
      pagination: {
        current_page: -1,
        total_records: -1,
        total_pages: -1,
        prev_page: false,
        next_page: false,
      },
      query: {
        page: 1,
        limit: 10,
        sortBy: "created_at",
        sort: "asc",
        filters: {
          order_id: [false, ""],
          order_items: [false, ""],
          status: [true, "Waiting for payment"],
          address: [false, ""],
          contact_name: [false, ""],
          contact_phone: [false, ""],
          logistic_name: [false, ""],
          logistic_cost: [false, ""],
          order_amount: [false, ""],
          created_at: [false, ""],
          updated_at: [false, ""],
        },
      },
      isLoading: false,
    },
    post: {
      message: "",
      isLoading: false,
    },
    put: {
      id: -1,
      data: null,
      message: "",
      isLoading: false,
    },
    delete: {
      id: -1,
      message: "",
      isLoading: false,
    },
    patch: {
      id: -1,
      message: "",
      isLoading: false,
    },
  },
};

const pharmacyProductSlice = createSlice({
  name: "pharmacy/product",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(getMasterProductPaginated.pending, (state) => {
      state.masterProduct.paginated.isLoading = true;
    });
    builder.addCase(getMasterProductPaginated.rejected, (state, action) => {
      state.masterProduct.paginated.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(getMasterProductPaginated.fulfilled, (state, action) => {
      state.masterProduct.paginated = {
        ...state.masterProduct.paginated,
        ...action.payload,
        isLoading: false,
      };
    });
    builder.addCase(getPharmacyProductPaginated.pending, (state) => {
      state.pharmacyProduct.paginated.isLoading = true;
    });
    builder.addCase(getPharmacyProductPaginated.rejected, (state, action) => {
      state.pharmacyProduct.paginated.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(getPharmacyProductPaginated.fulfilled, (state, action) => {
      state.pharmacyProduct.paginated = {
        ...state.pharmacyProduct.paginated,
        ...action.payload,
        isLoading: false,
      };
    });
    builder.addCase(getPharmacistOrderPaginated.pending, (state) => {
      state.orders.paginated.isLoading = true;
    });
    builder.addCase(getPharmacistOrderPaginated.rejected, (state, action) => {
      state.orders.paginated.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(getPharmacistOrderPaginated.fulfilled, (state, action) => {
      let pharmacistOrder: pharmacistOrder[];
      if (action.payload.data !== undefined) {
        pharmacistOrder = action.payload.data.map((item) => {
          return {
            ...item,
            status: state.orders.paginated.query.filters.status[1],
            created_at: new Date(item.created_at).toLocaleString(),
            updated_at: new Date(item.updated_at).toLocaleString(),
          };
        });
        action.payload.data = pharmacistOrder;
        state.orders.paginated = {
          ...state.orders.paginated,
          ...action.payload,
          isLoading: false,
        };
      }
    });
    builder.addCase(postPharmacyProduct.pending, (state) => {
      state.pharmacyProduct.post.isLoading = true;
    });
    builder.addCase(postPharmacyProduct.rejected, (state, action) => {
      state.pharmacyProduct.post.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(postPharmacyProduct.fulfilled, (state, action) => {
      invokeToast(action.payload.message, "success");
      state.pharmacyProduct.post.message = action.payload.message;
      state.pharmacyProduct.post.isLoading = false;
    });
    builder.addCase(deletePharmacyProductByID.pending, (state) => {
      state.pharmacyProduct.delete.isLoading = true;
    });
    builder.addCase(deletePharmacyProductByID.rejected, (state, action) => {
      state.pharmacyProduct.delete.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(deletePharmacyProductByID.fulfilled, (state, action) => {
      invokeToast(action.payload.message, "success");
      state.pharmacyProduct.delete.message = action.payload.message;
      state.pharmacyProduct.delete.isLoading = false;
    });
    builder.addCase(sentPharmacistOrder.pending, (state) => {
      state.orders.patch!.isLoading = true;
    });
    builder.addCase(sentPharmacistOrder.rejected, (state, action) => {
      state.orders.patch!.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(sentPharmacistOrder.fulfilled, (state, action) => {
      invokeToast(action.payload.message, "success");
      state.orders.patch!.message = action.payload.message;
      state.orders.patch!.isLoading = false;
    });
    builder.addCase(cancelPharmacistOrder.pending, (state) => {
      state.orders.patch!.isLoading = true;
    });
    builder.addCase(cancelPharmacistOrder.rejected, (state, action) => {
      state.orders.patch!.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(cancelPharmacistOrder.fulfilled, (state, action) => {
      invokeToast(action.payload.message, "success");
      state.orders.patch!.message = action.payload.message;
      state.orders.patch!.isLoading = false;
    });
  },
  reducers: {
    addPharmacyPageNumber: (state) => {
      state.pharmacyProduct.paginated.query.page =
        state.pharmacyProduct.paginated.query.page + 1;
    },
    reducePharmacyPageNumber: (state) => {
      state.pharmacyProduct.paginated.query.page =
        state.pharmacyProduct.paginated.query.page - 1;
    },
    setPharmacyEditedID: (state, action: PayloadAction<number>) => {
      state.pharmacyProduct.put.id = action.payload;
    },
    setPharmacyDeletedID: (state, action: PayloadAction<number>) => {
      state.pharmacyProduct.delete.id = action.payload;
    },
    setPharmacySortBy: (
      state,
      action: PayloadAction<{
        sortBy: keyof pharmacyProduct;
        sort: "asc" | "desc";
      }>
    ) => {
      state.pharmacyProduct.paginated.query.sortBy = action.payload.sortBy;
      state.pharmacyProduct.paginated.query.sort = action.payload.sort;
    },
    togglePharmacySortBy: (
      state,
      action: PayloadAction<keyof pharmacyProduct>
    ) => {
      state.pharmacyProduct.paginated.query.sortBy = action.payload;
      if (state.pharmacyProduct.paginated.query.sortBy !== action.payload) {
        state.pharmacyProduct.paginated.query.sort = "asc";
      } else {
        if (state.pharmacyProduct.paginated.query.sort === "asc")
          state.pharmacyProduct.paginated.query.sort = "desc";
        else state.pharmacyProduct.paginated.query.sort = "asc";
      }
    },
    setPharmacyFilters: (
      state,
      action: PayloadAction<{
        active: boolean;
        field: keyof pharmacyProduct;
        contain: string;
      }>
    ) => {
      state.pharmacyProduct.paginated.query.filters[action.payload.field] = [
        action.payload.active,
        action.payload.contain,
      ];
    },

    addMasterPageNumber: (state) => {
      state.masterProduct.paginated.query.page =
        state.masterProduct.paginated.query.page + 1;
    },
    reduceMasterPageNumber: (state) => {
      state.masterProduct.paginated.query.page =
        state.masterProduct.paginated.query.page - 1;
    },
    setMasterEditedID: (state, action: PayloadAction<number>) => {
      state.masterProduct.put.id = action.payload;
    },
    setMasterDeletedID: (state, action: PayloadAction<number>) => {
      state.masterProduct.delete.id = action.payload;
    },
    setMasterSortBy: (
      state,
      action: PayloadAction<{
        sortBy: keyof masterProduct;
        sort: "asc" | "desc";
      }>
    ) => {
      state.masterProduct.paginated.query.sortBy = action.payload.sortBy;
      state.masterProduct.paginated.query.sort = action.payload.sort;
    },
    toggleMasterSortBy: (state, action: PayloadAction<keyof masterProduct>) => {
      state.masterProduct.paginated.query.sortBy = action.payload;
      if (state.masterProduct.paginated.query.sortBy !== action.payload) {
        state.masterProduct.paginated.query.sort = "asc";
      } else {
        if (state.masterProduct.paginated.query.sort === "asc")
          state.masterProduct.paginated.query.sort = "desc";
        else state.masterProduct.paginated.query.sort = "asc";
      }
    },
    setMasterFilters: (
      state,
      action: PayloadAction<{
        active: boolean;
        field: keyof masterProduct;
        contain: string;
      }>
    ) => {
      state.masterProduct.paginated.query.filters[action.payload.field] = [
        action.payload.active,
        action.payload.contain,
      ];
    },
    addOrdersPageNumber: (state) => {
      state.orders.paginated.query.page = state.orders.paginated.query.page + 1;
    },
    reduceOrdersPageNumber: (state) => {
      state.orders.paginated.query.page = state.orders.paginated.query.page - 1;
    },
    setOrdersEditedID: (state, action: PayloadAction<number>) => {
      state.orders.put.id = action.payload;
    },
    setOrdersDeletedID: (state, action: PayloadAction<number>) => {
      state.orders.delete.id = action.payload;
    },
    setOrdersPatchID: (state, action: PayloadAction<number>) => {
      state.orders.patch!.id = action.payload;
    },
    setOrdersSortBy: (
      state,
      action: PayloadAction<{
        sortBy: keyof pharmacistOrder;
        sort: "asc" | "desc";
      }>
    ) => {
      state.orders.paginated.query.sortBy = action.payload.sortBy;
      state.orders.paginated.query.sort = action.payload.sort;
    },
    toggleOrdersSortBy: (
      state,
      action: PayloadAction<keyof pharmacistOrder>
    ) => {
      state.orders.paginated.query.sortBy = action.payload;
      if (state.orders.paginated.query.sortBy !== action.payload) {
        state.orders.paginated.query.sort = "asc";
      } else {
        if (state.orders.paginated.query.sort === "asc")
          state.orders.paginated.query.sort = "desc";
        else state.orders.paginated.query.sort = "asc";
      }
    },
    setOrdersFilters: (
      state,
      action: PayloadAction<{
        active: boolean;
        field: keyof pharmacistOrder;
        contain: string;
      }>
    ) => {
      state.orders.paginated.query.filters[action.payload.field] = [
        action.payload.active,
        action.payload.contain,
      ];
    },
  },
});

const pharmacyProductURL = "/pharmacist/pharmacy-products";
const masterProductURL = "/pharmacist/master-products";
const orderURL = "/pharmacist/orders";

export const getPharmacyProductPaginated = createAsyncThunk<
  getPaginatedRequest<pharmacyProduct>,
  void,
  { rejectValue: ResponseError }
>("pharmacy/products/get", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const { query } = state.pharmacyProduct.pharmacyProduct.paginated;
  let url = pharmacyProductURL;
  url += "?page=" + query.page.toString();
  url += "&limit=" + query.limit.toString();
  if (query.sortBy[0]) {
    url += "&sort_by=" + query.sortBy;
    url += "&sort=" + query.sort;
  }
  for (const key in query.filters) {
    if (!query.filters[key as keyof pharmacyProduct][0]) continue;
    url += `&${key}=${query.filters[key as keyof pharmacyProduct][1]}`;
  }
  return get<getPaginatedRequest<pharmacyProduct>>(
    import.meta.env.VITE_BASE_URL + url,
    {
      credentials: "include" as RequestCredentials,
    }
  )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return thunkApi.rejectWithValue(err as ResponseError);
    });
});

export const getMasterProductPaginated = createAsyncThunk<
  getPaginatedRequest<masterProduct>,
  void,
  { rejectValue: ResponseError }
>("pharmacy/master-products/get", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const { query } = state.pharmacyProduct.masterProduct.paginated;
  let url = masterProductURL;
  url += "?page=" + query.page.toString();
  url += "&limit=" + query.limit.toString();
  if (query.sortBy[0]) {
    url += "&sort_by=" + query.sortBy;
    url += "&sort=" + query.sort;
  }
  for (const key in query.filters) {
    if (!query.filters[key as keyof masterProduct][0]) continue;
    url += `&${key}=${query.filters[key as keyof masterProduct][1]}`;
  }
  return get<getPaginatedRequest<masterProduct>>(
    import.meta.env.VITE_BASE_URL + url,
    {
      credentials: "include" as RequestCredentials,
    }
  )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return thunkApi.rejectWithValue(err as ResponseError);
    });
});

export const postPharmacyProduct = createAsyncThunk<
  { message: string },
  createPharmacyProductRequest,
  { rejectValue: ResponseError }
>(
  "pharmacy/products/post",
  async (product: createPharmacyProductRequest, thunkApi) => {
    return post<createPharmacyProductRequest, generalResponse<undefined>>(
      import.meta.env.VITE_BASE_URL + pharmacyProductURL,
      product,
      {
        credentials: "include" as RequestCredentials,
      }
    )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return thunkApi.rejectWithValue(err as ResponseError);
      });
  }
);

export const putPharmacyProduct = createAsyncThunk<
  { message: string },
  editPharmacyProductRequest,
  { rejectValue: ResponseError }
>(
  "pharmacy/products/put",
  async (product: editPharmacyProductRequest, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const productID = state.pharmacyProduct.pharmacyProduct.put.id.toString();
    return put<editPharmacyProductRequest, generalResponse<undefined>>(
      import.meta.env.VITE_BASE_URL + pharmacyProductURL + "/" + productID,
      product,
      {
        credentials: "include" as RequestCredentials,
      }
    )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return thunkApi.rejectWithValue(err as ResponseError);
      });
  }
);

export const deletePharmacyProductByID = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: ResponseError }
>("pharmacy/products/put", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const productID = state.pharmacyProduct.pharmacyProduct.delete.id.toString();
  return del<generalResponse<undefined>>(
    import.meta.env.VITE_BASE_URL + pharmacyProductURL + "/" + productID,
    {
      credentials: "include" as RequestCredentials,
    }
  )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return thunkApi.rejectWithValue(err as ResponseError);
    });
});

export const getPharmacistOrderPaginated = createAsyncThunk<
  generalResponse<pharmacistOrder[]>,
  void,
  { rejectValue: ResponseError }
>("pharmacy/orders/get", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const { query } = state.pharmacyProduct.orders.paginated;
  let url = orderURL;
  url += "?page=" + query.page.toString();
  url += "&limit=" + query.limit.toString();
  if (query.sortBy[0]) {
    url += "&sort_by=" + query.sortBy;
    url += "&sort=" + query.sort;
  }
  for (const key in query.filters) {
    if (!query.filters[key as keyof pharmacistOrder][0]) continue;
    url += `&${key}=${query.filters[key as keyof pharmacistOrder][1]}`;
  }
  return get<generalResponse<pharmacistOrder[]>>(
    import.meta.env.VITE_BASE_URL + url,
    {
      credentials: "include" as RequestCredentials,
    }
  )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return thunkApi.rejectWithValue(err as ResponseError);
    });
});

export const sentPharmacistOrder = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: ResponseError }
>("pharmacy/orders/patch/sent", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const productID = state.pharmacyProduct.orders.patch!.id.toString();
  return patch<statusOrderRequest, { message: string }>(
    import.meta.env.VITE_BASE_URL + orderURL + "/" + productID,
    { status: "Sent" },
    {
      credentials: "include" as RequestCredentials,
    }
  )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return thunkApi.rejectWithValue(err as ResponseError);
    });
});

export const cancelPharmacistOrder = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: ResponseError }
>("pharmacy/orders/patch/cancel", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const productID = state.pharmacyProduct.orders.patch!.id.toString();
  return patch<statusOrderRequest, { message: string }>(
    import.meta.env.VITE_BASE_URL + orderURL + "/" + productID,
    { status: "Canceled" },
    {
      credentials: "include" as RequestCredentials,
    }
  )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return thunkApi.rejectWithValue(err as ResponseError);
    });
});

export const {
  addPharmacyPageNumber,
  reducePharmacyPageNumber,
  setPharmacyDeletedID,
  setPharmacyEditedID,
  setPharmacyFilters,
  setPharmacySortBy,
  togglePharmacySortBy,
  addMasterPageNumber,
  reduceMasterPageNumber,
  setMasterDeletedID,
  setMasterEditedID,
  setMasterFilters,
  setMasterSortBy,
  toggleMasterSortBy,
  addOrdersPageNumber,
  reduceOrdersPageNumber,
  setOrdersDeletedID,
  setOrdersEditedID,
  setOrdersPatchID,
  setOrdersFilters,
  setOrdersSortBy,
  toggleOrdersSortBy,
} = pharmacyProductSlice.actions;

export default pharmacyProductSlice.reducer;
