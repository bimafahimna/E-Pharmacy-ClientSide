import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getPaginatedRequest,
  searchPageState,
  shopProduct,
  userSearchParam,
} from "../../utils/types";
import { fetchHomePageData, fetchSearchData } from "../../utils/asyncFunctions";

export const getMoreSearchData = createAsyncThunk<
  getPaginatedRequest<shopProduct>,
  userSearchParam & { signal: AbortSignal },
  { rejectValue: string }
>(
  "search/fetchmore",
  async (
    userSearchParam: userSearchParam & { signal: AbortSignal },
    { rejectWithValue }
  ) => {
    try {
      const result = await fetchSearchData(userSearchParam);

      if (
        !result.data ||
        (result.data.length === 0 && result.message[0] !== "S")
      ) {
        throw new Error(result.message);
      }

      if (
        result.data.length === 0 &&
        (!userSearchParam.latitude || !userSearchParam.longitude)
      ) {
        throw new Error(
          "There is no nearby pharmacies in your location, please consider changing your location"
        );
      }

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "unknown error"
      );
    }
  }
);

export const getSearchData = createAsyncThunk<
  getPaginatedRequest<shopProduct>,
  userSearchParam & { signal: AbortSignal },
  { rejectValue: string }
>(
  "search/fetch",
  async (
    userSearchParam: userSearchParam & { signal: AbortSignal },
    { rejectWithValue }
  ) => {
    try {
      const result = await fetchSearchData(userSearchParam);

      if (
        !result.data ||
        (result.data.length === 0 && result.message[0] !== "S")
      ) {
        throw new Error(result.message);
      }

      if (
        result.data.length === 0 &&
        (!userSearchParam.latitude || !userSearchParam.longitude)
      ) {
        throw new Error(
          "There is no nearby pharmacies in your location, please consider changing your location"
        );
      }

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "unknown error"
      );
    }
  }
);

export const getHomePageData = createAsyncThunk<
  getPaginatedRequest<shopProduct>,
  userSearchParam & { signal: AbortSignal },
  { rejectValue: string }
>(
  "home/fetch",
  async (
    userSearchParam: userSearchParam & { signal: AbortSignal },
    { rejectWithValue }
  ) => {
    try {
      const result = await fetchHomePageData(userSearchParam);

      if (
        !result.data ||
        (result.data.length === 0 && result.message[0] !== "S")
      ) {
        throw new Error(result.message);
      }

      if (
        result.data.length === 0 &&
        (!userSearchParam.latitude || !userSearchParam.longitude)
      ) {
        throw new Error(
          "There is no nearby pharmacies in your location, please consider changing your location"
        );
      }

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "unknown error"
      );
    }
  }
);

const initialState: searchPageState = {
  userSearchParam: {
    query: "",
    limit: 20,
    page: 0,
    latitude: "",
    longitude: "",
  },
  searchPagePagination: null,
  searchPageData: [],
  homePageData: [],
  homePageDataPagination: null,
  homePageDataLoading: false,
  searchPageDataLoading: false,
  searchPageDataError: null,
};

export const searchData = createSlice({
  name: "searchData",
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<userSearchParam>) => {
      state.userSearchParam = action.payload;
    },

    setSearchLatLong: (
      state,
      action: PayloadAction<{ latitude: string; longitude: string }>
    ) => {
      state.userSearchParam = {
        ...state.userSearchParam,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
      };
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.userSearchParam = {
        ...state.userSearchParam,
        query: action.payload,
      };
    },

    setSearchPage: (state, action: PayloadAction<number>) => {
      state.userSearchParam = {
        ...state.userSearchParam,
        page: action.payload,
      };
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getSearchData.fulfilled, (state, { payload }) => {
      return {
        ...state,
        searchPagePagination: payload.pagination,
        searchPageData: payload.data,
        searchPageDataLoading: false,
        searchPageDataError: null,
      };
    });
    builder.addCase(getSearchData.pending, (state) => {
      return {
        ...state,
        searchPageDataLoading: true,
        searchPageDataError: null,
      };
    });
    builder.addCase(getSearchData.rejected, (state, { payload }) => {
      return {
        ...state,
        searchPageDataError: payload ?? "unknown error",
        searchPageDataLoading: false,
      };
    });

    builder.addCase(getMoreSearchData.fulfilled, (state, { payload }) => {
      const newPageData = state.searchPageData.concat(payload.data);

      return {
        ...state,
        searchPagePagination: payload.pagination,
        searchPageData: newPageData,
        searchPageDataLoading: false,
        searchPageDataError: null,
      };
    });
    builder.addCase(getMoreSearchData.pending, (state) => {
      return {
        ...state,
        searchPageDataLoading: true,
        searchPageDataError: null,
      };
    });
    builder.addCase(getMoreSearchData.rejected, (state, { payload }) => {
      return {
        ...state,
        searchPageDataError: payload ?? "unknown error",
        searchPageDataLoading: false,
      };
    });

    builder.addCase(getHomePageData.fulfilled, (state, { payload }) => {
      return {
        ...state,
        homePageDataPagination: payload.pagination,
        homePageData: payload.data,
        homePageDataLoading: false,
        searchPageDataError: null,
      };
    });
    builder.addCase(getHomePageData.pending, (state) => {
      return {
        ...state,
        homePageDataLoading: true,
        searchPageDataError: null,
      };
    });
    builder.addCase(getHomePageData.rejected, (state, { payload }) => {
      return {
        ...state,
        searchPageDataError: payload ?? "unknown error",
        homePageDataLoading: false,
      };
    });
  },
});

export const {
  setSearchParams,
  setSearchLatLong,
  setSearchQuery,
  setSearchPage,
} = searchData.actions;

export default searchData.reducer;
