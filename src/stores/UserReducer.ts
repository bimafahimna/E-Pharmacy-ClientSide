import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  crudState,
  ResponseError,
  user,
  generalResponse,
} from "../utils/types";
import { get } from "../utils/fetch";
import { errorHandler } from "../errorHandler/errorHandler";
import { RootState } from "./store";

const initialState: crudState<user> = {
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
      sortBy: "created_at",
      sort: "asc",
      filters: {
        id: [false, ""],
        email: [false, ""],
        role: [false, ""],
        is_verified: [false, ""],
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
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(getUserPaginated.pending, (state) => {
      state.paginated.isLoading = true;
    });
    builder.addCase(getUserPaginated.rejected, (state, action) => {
      state.paginated.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(getUserPaginated.fulfilled, (state, action) => {
      let users: user[];
      if (action.payload.data !== undefined) {
        users = action.payload.data.map((item) => {
          return {
            ...item,
            created_at: new Date(item.created_at).toLocaleString(),
            updated_at: new Date(item.updated_at).toLocaleString(),
          };
        });
        action.payload.data = users;
        state.paginated = {
          ...state.paginated,
          ...action.payload,
          isLoading: false,
        };
      }
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
      action: PayloadAction<{ sortBy: keyof user; sort: "asc" | "desc" }>
    ) => {
      state.paginated.query.sortBy = action.payload.sortBy;
      state.paginated.query.sort = action.payload.sort;
    },
    toggleSortBy: (state, action: PayloadAction<keyof user>) => {
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
        field: keyof user;
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

const pharmacyURL = "/admin/users";

export const getUserPaginated = createAsyncThunk<
  generalResponse<user[]>,
  void,
  { rejectValue: ResponseError }
>("user/get/users", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const { query } = state.user.paginated;
  let url = pharmacyURL;
  url += "?page=" + query.page.toString();
  url += "&limit=" + query.limit.toString();
  if (query.sortBy[0]) {
    url += "&sort_by=" + query.sortBy;
    url += "&sort=" + query.sort;
  }
  for (const key in query.filters) {
    if (!query.filters[key as keyof user][0]) continue;
    url += `&${key}=${query.filters[key as keyof user][1]}`;
  }
  return get<generalResponse<user[]>>(import.meta.env.VITE_BASE_URL + url, {
    credentials: "include" as RequestCredentials,
  })
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
} = userSlice.actions;

export default userSlice.reducer;
