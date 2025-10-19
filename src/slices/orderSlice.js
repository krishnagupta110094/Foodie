import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],    // all orders for current user (role-specific)
    loading: false,
    error: null,
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
    updateOrderStatusRedux: (state, action) => {
      const { orderId, status } = action.payload;
      const index = state.orders.findIndex((o) => o._id === orderId);
      if (index !== -1) state.orders[index].status = status;
    },
  },
});

export const { setOrders, setLoading, setError, clearOrders, updateOrderStatusRedux } = orderSlice.actions;
export default orderSlice.reducer;
