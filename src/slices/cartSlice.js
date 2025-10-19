import { createSlice } from "@reduxjs/toolkit";

// Try to load cart from localStorage
const savedCart = JSON.parse(localStorage.getItem("cart") || "{}");

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: savedCart.items || [],
    totalItems: savedCart.totalItems || 0,
    subTotal: savedCart.subTotal || 0,
    totalDeliveryFee: savedCart.totalDeliveryFee || 0,
    totalPrice: savedCart.totalPrice || 0,
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.totalItems = action.payload.totalItems || 0;
      state.subTotal = action.payload.subTotal || 0;
      state.totalDeliveryFee = action.payload.totalDeliveryFee || 0;
      state.totalPrice = action.payload.totalPrice || 0;

      // Save updated cart to localStorage
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: state.items,
          totalItems: state.totalItems,
          subTotal: state.subTotal,
          totalDeliveryFee: state.totalDeliveryFee,
          totalPrice: state.totalPrice,
        })
      );
    },
    resetCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subTotal = 0;
      state.totalDeliveryFee = 0;
      state.totalPrice = 0;

      localStorage.removeItem("cart");
    },
  },
});

export const { setCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
