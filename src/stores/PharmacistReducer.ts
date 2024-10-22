import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createPharmacistRequest,
  deletePharmcistByIDRequest,
  editPharmacistRequest,
  getPharmacistByIDRequest,
  getPharmacistRequest,
  pharmacist,
  crudState,
  ResponseError,
} from "../utils/types";
import { del, get, post, put } from "../utils/fetch";
import { invokeToast } from "../utils/invokeToast";
import { errorHandler } from "../errorHandler/errorHandler";
import { RootState } from "./store";

const initialState: crudState<pharmacist> = {
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
        email: [false, ""],
        sipa_number: [false, ""],
        whatsapp_number: [false, ""],
        years_of_experience: [false, ""],
        is_assigned: [false, ""],
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

const pharmacistSlice = createSlice({
  name: "pharmacist",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(getPharmacistsPaginated.pending, (state) => {
      state.paginated.isLoading = true;
    });
    builder.addCase(getPharmacistsPaginated.rejected, (state, action) => {
      state.paginated.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(getPharmacistsPaginated.fulfilled, (state, action) => {
      state.paginated = {
        ...state.paginated,
        ...action.payload,
        isLoading: false,
      };
    });
    builder.addCase(getPharmacistByID.pending, (state) => {
      state.put.isLoading = true;
    });
    builder.addCase(getPharmacistByID.rejected, (state, action) => {
      state.put.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(getPharmacistByID.fulfilled, (state, action) => {
      state.put.isLoading = false;
      state.put = { ...state.put, ...action.payload };
    });
    builder.addCase(postPharmacist.pending, (state) => {
      state.post.isLoading = true;
    });
    builder.addCase(postPharmacist.rejected, (state, action) => {
      state.post.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(postPharmacist.fulfilled, (state, action) => {
      invokeToast(action.payload.message, "success");
      state.post.message = action.payload.message;
      state.post.isLoading = false;
    });

    builder.addCase(putPharmacist.pending, (state) => {
      state.put.isLoading = true;
    });
    builder.addCase(putPharmacist.rejected, (state, action) => {
      state.put.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(putPharmacist.fulfilled, (state, action) => {
      invokeToast(action.payload.message, "success");
      state.put.message = action.payload.message;
      state.put.isLoading = false;
    });
    builder.addCase(deletePharmacistByID.pending, (state) => {
      state.delete.isLoading = true;
    });
    builder.addCase(deletePharmacistByID.rejected, (state, action) => {
      state.delete.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(deletePharmacistByID.fulfilled, (state, action) => {
      invokeToast(action.payload.message, "success");
      state.delete.message = action.payload.message;
      state.delete.isLoading = false;
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
      action: PayloadAction<{ sortBy: keyof pharmacist; sort: "asc" | "desc" }>
    ) => {
      state.paginated.query.sortBy = action.payload.sortBy;
      state.paginated.query.sort = action.payload.sort;
    },
    toggleSortBy: (state, action: PayloadAction<keyof pharmacist>) => {
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
        field: keyof pharmacist;
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

const pharmacistURL = "/admin/pharmacists";

export const getPharmacistsPaginated = createAsyncThunk<
  getPharmacistRequest,
  void,
  { rejectValue: ResponseError }
>("pharmacist/get/pharmacists", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const { query } = state.pharmacist.paginated;
  let url = pharmacistURL;
  url += "?page=" + query.page.toString();
  url += "&limit=" + query.limit.toString();
  if (query.sortBy[0]) {
    url += "&sort_by=" + query.sortBy;
    url += "&sort=" + query.sort;
  }
  for (const key in query.filters) {
    if (!query.filters[key as keyof pharmacist][0]) continue;
    url += `&${key}=${query.filters[key as keyof pharmacist][1]}`;
  }
  return get<getPharmacistRequest>(import.meta.env.VITE_BASE_URL + url, {
    credentials: "include" as RequestCredentials,
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return thunkApi.rejectWithValue(err as ResponseError);
    });
});

export const postPharmacist = createAsyncThunk(
  "pharmacist/post/pharmacists",
  async (pharmacist: createPharmacistRequest): Promise<{ message: string }> => {
    return await post<createPharmacistRequest, { message: string }>(
      import.meta.env.VITE_BASE_URL + "/admin/pharmacists",
      pharmacist,
      {
        credentials: "include" as RequestCredentials,
      }
    );
  }
);

export const putPharmacist = createAsyncThunk<
  { message: string },
  editPharmacistRequest,
  { rejectValue: ResponseError }
>(
  "pharmacist/put/pharmacists",
  async (editPharmacistRequest: editPharmacistRequest, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const pharmacistID = state.pharmacist.put.id.toString();
    return put<editPharmacistRequest, { message: string }>(
      import.meta.env.VITE_BASE_URL + "/admin/pharmacists/" + pharmacistID,
      editPharmacistRequest,
      { credentials: "include" as RequestCredentials }
    )
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return thunkApi.rejectWithValue(err as ResponseError);
      });
  }
);

export const getPharmacistByID = createAsyncThunk<
  getPharmacistByIDRequest,
  void,
  { rejectValue: ResponseError }
>("pharmacist/get/pharmacistById", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const pharmacistID = state.pharmacist.put.id.toString();
  return get<getPharmacistByIDRequest>(
    import.meta.env.VITE_BASE_URL + pharmacistURL + "/" + pharmacistID,
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

export const deletePharmacistByID = createAsyncThunk<
  deletePharmcistByIDRequest,
  void,
  { rejectValue: ResponseError }
>("pharmacist/delete/pharmacistById", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const pharmacistID = state.pharmacist.delete.id.toString();
  return del<deletePharmcistByIDRequest>(
    import.meta.env.VITE_BASE_URL + pharmacistURL + "/" + pharmacistID,
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
} = pharmacistSlice.actions;

export default pharmacistSlice.reducer;
