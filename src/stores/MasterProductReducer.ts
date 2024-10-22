import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  crudState,
  generalResponse,
  getPaginatedRequest,
  masterProduct,
  ResponseError,
} from "../utils/types";
import { get, postForm } from "../utils/fetch";
import { invokeToast } from "../utils/invokeToast";
import { errorHandler } from "../errorHandler/errorHandler";
import { RootState } from "./store";

const initialState: crudState<masterProduct> = {
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
};

const masterProductSlice = createSlice({
  name: "admin/product",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(getMasterProductPaginated.pending, (state) => {
      state.paginated.isLoading = true;
    });
    builder.addCase(getMasterProductPaginated.rejected, (state, action) => {
      state.paginated.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(getMasterProductPaginated.fulfilled, (state, action) => {
      state.paginated = {
        ...state.paginated,
        ...action.payload,
        isLoading: false,
      };
    });
    builder.addCase(postMasterProduct.pending, (state) => {
      state.post.isLoading = true;
    });
    builder.addCase(postMasterProduct.rejected, (state, action) => {
      state.post.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(postMasterProduct.fulfilled, (state, action) => {
      invokeToast(action.payload.message, "success");
      state.post.message = action.payload.message;
      state.post.isLoading = false;
    });
  },
  reducers: {
    addPageNumber: (state) => {
      state.paginated.query.page = state.paginated.query.page + 1;
    },
    reducePageNumber: (state) => {
      state.paginated.query.page = state.paginated.query.page - 1;
    },
    setEditedID: (state, action: PayloadAction<number>) => {
      state.put.id = action.payload;
    },
    setDeletedID: (state, action: PayloadAction<number>) => {
      state.delete.id = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<{
        sortBy: keyof masterProduct;
        sort: "asc" | "desc";
      }>
    ) => {
      state.paginated.query.sortBy = action.payload.sortBy;
      state.paginated.query.sort = action.payload.sort;
    },
    toggleSortBy: (state, action: PayloadAction<keyof masterProduct>) => {
      state.paginated.query.sortBy = action.payload;
      if (state.paginated.query.sortBy !== action.payload) {
        state.paginated.query.sort = "asc";
      } else {
        if (state.paginated.query.sort === "asc")
          state.paginated.query.sort = "desc";
        else state.paginated.query.sort = "asc";
      }
    },
    setFilters: (
      state,
      action: PayloadAction<{
        active: boolean;
        field: keyof masterProduct;
        contain: string;
      }>
    ) => {
      state.paginated.query.filters[action.payload.field] = [
        action.payload.active,
        action.payload.contain,
      ];
    },
  },
});

const adminProductURL = "/admin/products";

export const getMasterProductPaginated = createAsyncThunk<
  getPaginatedRequest<masterProduct>,
  void,
  { rejectValue: ResponseError }
>("admin/products/get", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const { query } = state.masterProduct.paginated;
  let url = adminProductURL;
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

export const postMasterProduct = createAsyncThunk<
  { message: string },
  FormData,
  { rejectValue: ResponseError }
>("admin/products/post", async (product: FormData, thunkApi) => {
  return postForm<generalResponse<undefined>>(
    import.meta.env.VITE_BASE_URL + adminProductURL,
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
});

export const {
  addPageNumber,
  reducePageNumber,
  setDeletedID,
  setEditedID,
  setFilters,
  setSortBy,
  toggleSortBy,
} = masterProductSlice.actions;

export default masterProductSlice.reducer;
