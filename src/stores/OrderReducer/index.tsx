import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  messageOnlyResponse,
  orderState,
  orderRequest,
  userOrderUnpaid,
  userOrderHistory,
} from "../../utils/types";
import {
  fetchAllOrders,
  fetchPostOrder,
  fetchUnpaidOrders,
} from "../../utils/asyncFunctions";
import { errorHandler } from "../../errorHandler/errorHandler";

export const createOrders = createAsyncThunk<
  messageOnlyResponse,
  orderRequest,
  { rejectValue: string }
>("order/post", async (params: orderRequest, { rejectWithValue }) => {
  try {
    if (!params) {
      throw new Error("Invalid order data, failed to create your order");
    }

    const result = await fetchPostOrder(params);

    if (result.message[0] !== "S") {
      throw new Error(result.message);
    }

    return result;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "unknown error"
    );
  }
});

export const getUnpaidOrders = createAsyncThunk<
  userOrderUnpaid[],
  void,
  { rejectValue: string }
>("order/fetch/unpaid", async (_, { rejectWithValue }) => {
  try {
    const result = await fetchUnpaidOrders();

    if (!result || !result.data) {
      throw new Error("Failed to fetch data");
    }
    if (result.message[0] !== "S") {
      throw new Error(result.message || "unknown error");
    }

    return result.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "unknown error"
    );
  }
});

export const getPaidUserOrders = createAsyncThunk<
  userOrderHistory[],
  string,
  { rejectValue: string }
>("order/fetch/paid", async (params: string, { rejectWithValue }) => {
  try {
    const result = await fetchAllOrders(params);

    if (!result || !result.data) {
      throw new Error("Failed to fetch data");
    }
    if (result.message[0] !== "S") {
      throw new Error(result.message || "unknown error");
    }

    return result.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "unknown error"
    );
  }
});

const initialState: orderState = {
  userOrderRequestData: null,
  userOrderHistoryData: [],
  userOrderProccessedData: [], //Filter Shit
  userOrderSentData: [], //Filter Shit
  userOrderConfirmedData: [], // FilterShit
  userOrderCancelledData: [], // FilterShit
  userOrderUnpaidData: [],
  userOrderLoading: false,
  userOrderError: null,
};

export const userOrderData = createSlice({
  name: "userOrderData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUnpaidOrders.fulfilled, (state, { payload }) => {
      return {
        ...state,
        userOrderUnpaidData: payload,
        userOrderLoading: false,
        userOrderError: null,
      };
    });
    builder.addCase(getUnpaidOrders.pending, (state) => {
      return {
        ...state,
        userOrderLoading: true,
        userOrderError: null,
      };
    });
    builder.addCase(getUnpaidOrders.rejected, (state, { payload }) => {
      return {
        ...state,
        userOrderLoading: false,
        userOrderError: payload ?? "unknown error",
      };
    });

    builder.addCase(createOrders.fulfilled, (state) => {
      return {
        ...state,
        orderRequestData: null,
        userOrderLoading: false,
        userOrderError: null,
      };
    });
    builder.addCase(createOrders.pending, (state) => {
      return {
        ...state,
        userOrderLoading: true,
        userOrderError: null,
      };
    });
    builder.addCase(createOrders.rejected, (state, { payload }) => {
      state.userOrderLoading = false;
      state.userOrderError = payload ?? "unknown error";
      errorHandler(new Error(payload ?? "unknown error"));
    });

    builder.addCase(getPaidUserOrders.fulfilled, (state, { payload }) => {
      const proccessedData = payload.filter((order) => {
        return order.status === "Processed";
      });

      const sentData = payload.filter((order) => {
        return order.status === "Sent";
      });

      const confirmedData = payload.filter((order) => {
        return order.status === "Order Confirmed";
      });

      const cancelledData = payload.filter((order) => {
        return order.status === "Canceled";
      });

      return {
        ...state,
        userOrderHistoryData: payload,
        userOrderProccessedData: proccessedData,
        userOrderSentData: sentData,
        userOrderConfirmedData: confirmedData,
        userOrderCancelledData: cancelledData,
        userOrderLoading: false,
        userOrderError: null,
      };
    });
    builder.addCase(getPaidUserOrders.pending, (state) => {
      return {
        ...state,
        userOrderLoading: true,
        userOrderError: null,
      };
    });
    builder.addCase(getPaidUserOrders.rejected, (state, { payload }) => {
      return {
        ...state,
        userOrderLoading: false,
        userOrderError: payload ?? "unknown error",
      };
    });
  },
});

export default userOrderData.reducer;
