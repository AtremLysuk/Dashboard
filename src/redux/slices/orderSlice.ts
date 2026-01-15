import type { Order } from ".prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) {
        const errorText = await res.text();

        throw new Error(`HTTP ${res.status}: ${errorText || "Unknown error"}`);
      }
      const data: Order[] = await res.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  },
);

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      });
  },
});
