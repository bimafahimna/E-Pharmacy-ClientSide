import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createPharmacyRequest,
  crudState,
  editPharmacistRequest,
  getPharmacyRequest,
  pharmacy,
  ResponseError,
} from "../utils/types";
import { get, post, put } from "../utils/fetch";
import { invokeToast } from "../utils/invokeToast";
import { errorHandler } from "../errorHandler/errorHandler";
import { RootState } from "./store";

const initialState: crudState<pharmacy> = {
  paginated: {
    message: "",
    data: [],
    pagination: {
      current_page: 1,
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
        pharmacist: [false, ""],
        partner: [false, ""],
        address: [false, ""],
        city: [false, ""],
        latitude: [false, ""],
        longitude: [false, ""],
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

const pharmacySlice = createSlice({
  name: "pharmacy",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(getPharmacyPaginated.pending, (state) => {
      state.paginated.isLoading = true;
    });
    builder.addCase(getPharmacyPaginated.rejected, (state, action) => {
      state.paginated.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(getPharmacyPaginated.fulfilled, (state, action) => {
      state.paginated = {
        ...state.paginated,
        ...action.payload,
        isLoading: false,
      };
    });
    builder.addCase(postPharmacy.pending, (state) => {
      state.post.isLoading = true;
    });
    builder.addCase(postPharmacy.rejected, (state, action) => {
      state.post.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(postPharmacy.fulfilled, (state, action) => {
      invokeToast(action.payload.message, "success");
      state.post.message = action.payload.message;
      state.post.isLoading = false;
    });

    builder.addCase(putPharmacy.pending, (state) => {
      state.post.isLoading = true;
    });
    builder.addCase(putPharmacy.rejected, (state, action) => {
      state.post.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(putPharmacy.fulfilled, (state, action) => {
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
      action: PayloadAction<{ sortBy: keyof pharmacy; sort: "asc" | "desc" }>
    ) => {
      state.paginated.query.sortBy = action.payload.sortBy;
      state.paginated.query.sort = action.payload.sort;
    },
    toggleSortBy: (state, action: PayloadAction<keyof pharmacy>) => {
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
        field: keyof pharmacy;
        contain: string;
      }>
    ) => {
      state.paginated.query.filters[action.payload.field] = [
        action.payload.active,
        action.payload.contain,
      ];
      state.paginated.query.page = 1;
    },
  },
});

const pharmacyURL = "/admin/pharmacies";

export const getPharmacyPaginated = createAsyncThunk<
  getPharmacyRequest,
  void,
  { rejectValue: ResponseError }
>("pharmacy/get/pharmacies", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const { query } = state.pharmacy.paginated;
  let url = pharmacyURL;
  url += "?page=" + query.page.toString();
  url += "&limit=" + query.limit.toString();
  if (query.sortBy[0]) {
    url += "&sort_by=" + query.sortBy;
    url += "&sort=" + query.sort;
  }
  for (const key in query.filters) {
    if (!query.filters[key as keyof pharmacy][0]) continue;
    url += `&${key}=${query.filters[key as keyof pharmacy][1]}`;
  }
  return get<getPharmacyRequest>(import.meta.env.VITE_BASE_URL + url, {
    credentials: "include" as RequestCredentials,
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return thunkApi.rejectWithValue(err as ResponseError);
    });
});

export const postPharmacy = createAsyncThunk<
  { message: string },
  createPharmacyRequest,
  { rejectValue: ResponseError }
>(
  "pharmacy/post/pharmacies",
  async (pharmacist: createPharmacyRequest, thunkApi) => {
    return post<createPharmacyRequest, { message: string }>(
      import.meta.env.VITE_BASE_URL + pharmacyURL,
      pharmacist,
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

export const putPharmacy = createAsyncThunk(
  "pharmacy/put/pharmacies",
  async ({
    pharmacist,
    id,
  }: {
    pharmacist: editPharmacistRequest;
    id: number;
  }): Promise<{ message: string }> => {
    return await put<editPharmacistRequest, { message: string }>(
      import.meta.env.VITE_BASE_URL + pharmacyURL + "/" + id,
      pharmacist,
      { credentials: "include" as RequestCredentials }
    );
  }
);

export const {
  addPageNumber,
  reducePageNumber,
  setDeletedID,
  setEditedID,
  setFilters,
  setSortBy,
  toggleSortBy,
} = pharmacySlice.actions;

export default pharmacySlice.reducer;
