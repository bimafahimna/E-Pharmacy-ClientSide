import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  crudState,
  editPartnerRequest,
  generalResponse,
  getPartnerRequest,
  partner,
  ResponseError,
} from "../utils/types";
import { get, postForm, put } from "../utils/fetch";
import { invokeToast } from "../utils/invokeToast";
import { errorHandler } from "../errorHandler/errorHandler";
import { RootState } from "./store";
import * as constants from "../constants/partner";

const initialState: crudState<partner> = {
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
      sortBy: constants.PartnerKeys[1],
      sort: "asc",
      filters: {
        id: [false, ""],
        name: [false, ""],
        logo_url: [false, ""],
        year_founded: [false, ""],
        active_days: [false, ""],
        operational_start: [false, ""],
        operational_stop: [false, ""],
        is_active: [false, ""],
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

const partnerSlice = createSlice({
  name: "partner",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(getPartnersPaginated.pending, (state) => {
      state.paginated.isLoading = true;
    });
    builder.addCase(getPartnersPaginated.rejected, (state, action) => {
      state.paginated.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(getPartnersPaginated.fulfilled, (state, action) => {
      state.paginated = {
        ...state.paginated,
        ...action.payload,
        isLoading: false,
      };
    });
    builder.addCase(postPartner.pending, (state) => {
      state.post.isLoading = true;
    });
    builder.addCase(postPartner.rejected, (state, action) => {
      state.post.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(postPartner.fulfilled, (state, action) => {
      invokeToast(action.payload.message, "success");
      state.post.message = action.payload.message;
      state.post.isLoading = false;
    });
    builder.addCase(getPartnerByID.pending, (state) => {
      state.put.isLoading = true;
    });
    builder.addCase(getPartnerByID.rejected, (state, action) => {
      state.put.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(getPartnerByID.fulfilled, (state, action) => {
      state.put.isLoading = false;
      state.put = { ...state.put, ...action.payload };
    });

    builder.addCase(putPartner.pending, (state) => {
      state.put.isLoading = true;
    });
    builder.addCase(putPartner.rejected, (state, action) => {
      state.put.isLoading = false;
      if (action.payload instanceof ResponseError) {
        errorHandler(new Error(action.payload.message));
      }
    });
    builder.addCase(putPartner.fulfilled, (state, action) => {
      invokeToast(action.payload.message, "success");
      state.put.message = action.payload.message;
      state.put.isLoading = false;
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
      action: PayloadAction<{ sortBy: keyof partner; sort: "asc" | "desc" }>
    ) => {
      state.paginated.query.sortBy = action.payload.sortBy;
      state.paginated.query.sort = action.payload.sort;
    },
    toggleSortBy: (state, action: PayloadAction<keyof partner>) => {
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
        field: keyof partner;
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

const partnerURL = "/admin/partners";

export const getPartnersPaginated = createAsyncThunk<
  getPartnerRequest,
  void,
  { rejectValue: ResponseError }
>("partner/get/partners", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const { query } = state.partner.paginated;
  let url = partnerURL;
  url += "?page=" + query.page.toString();
  url += "&limit=" + query.limit.toString();
  if (query.sortBy[0]) {
    url += "&sort_by=" + query.sortBy;
    url += "&sort=" + query.sort;
  }
  for (const key in query.filters) {
    if (!query.filters[key as keyof partner][0]) continue;
    url += `&${key}=${query.filters[key as keyof partner][1]}`;
  }
  return get<getPartnerRequest>(import.meta.env.VITE_BASE_URL + url, {
    credentials: "include" as RequestCredentials,
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return thunkApi.rejectWithValue(err as ResponseError);
    });
});

export const postPartner = createAsyncThunk<
  generalResponse<undefined>,
  FormData,
  { rejectValue: ResponseError }
>("partner/post/partners", async (partner: FormData, thunkApi) => {
  return postForm<generalResponse<undefined>>(
    import.meta.env.VITE_BASE_URL + partnerURL,
    partner,
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

export const putPartner = createAsyncThunk(
  "partner/put/partners",
  async (partner: editPartnerRequest, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const partnerID = state.partner.put.id.toString();
    return await put<editPartnerRequest, { message: string }>(
      import.meta.env.VITE_BASE_URL + partnerURL + "/" + partnerID,
      partner,
      { credentials: "include" as RequestCredentials }
    );
  }
);

export const getPartnerByID = createAsyncThunk<
  generalResponse<partner>,
  void,
  { rejectValue: ResponseError }
>("partner/get/partnerById", async (_, thunkApi) => {
  const state = thunkApi.getState() as RootState;
  const partnerID = state.partner.put.id.toString();
  return get<generalResponse<partner>>(
    import.meta.env.VITE_BASE_URL + partnerURL + "/" + partnerID,
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
} = partnerSlice.actions;

export default partnerSlice.reducer;
