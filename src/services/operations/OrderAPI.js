import { orderEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { resetCart } from "../../slices/cartSlice";
import { setOrders, setLoading, setError } from "../../slices/orderSlice";
import toast from "react-hot-toast";

const {
  PLACE_ORDER,
  UPDATE_STATUS,
  GET_CUSTOMER_ORDERS,
  GET_RESTAURANT_ORDERS,
  GET_DELIVERY_ORDERS,
  ACCEPT_ORDER,
  COMPLETE_ORDER,
  GET_COMPLETED_DELIVERY_ORDERS,
  GET_COMPLETED_RESTAURANT_ORDERS
} = orderEndpoints;

// ✅ Place Order (Customer)
export const placeOrderAPI = (orderData, token) => {
  return async (dispatch) => {
    const toastId = toast.loading("Placing your order...");
    try {
      const response = await apiConnector("POST", PLACE_ORDER, orderData, {
        Authorization: `Bearer ${token}`,
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to place order");
      }

      // ✅ Clear Redux Cart & localStorage
      dispatch(resetCart());

      toast.success("Order placed successfully!");
      return response.data;
    } catch (error) {
      console.error("PLACE_ORDER ERROR:", error);
      toast.error(error?.response?.data?.message || "Order failed");
      return null;
    } finally {
      toast.dismiss(toastId);
    }
  };
};

// ✅ Update Order Status (Restaurant Owner)
export const updateOrderStatusAPI = (orderId, status, token) => {
  return async () => {
    const toastId = toast.loading("Updating order status...");
    try {
      const response = await apiConnector(
        "POST",
        UPDATE_STATUS(orderId),
        { status },
        { Authorization: `Bearer ${token}` }
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to update status");
      }

      toast.success("Status updated successfully!");
      return response.data.order;
    } catch (error) {
      console.error("UPDATE_STATUS ERROR:", error);
      toast.error(error?.response?.data?.message || "Status update failed");
      return null;
    } finally {
      toast.dismiss(toastId);
    }
  };
};

// ✅ Fetch Customer Orders
export const fetchCustomerOrders = (token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_CUSTOMER_ORDERS, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response?.data?.success) throw new Error("Failed to fetch orders");

      dispatch(setOrders(response.data.orders));
      return response.data.orders;
    } catch (err) {
      console.error("FETCH_CUSTOMER_ORDERS ERROR:", err);
      dispatch(setError(err?.message || "Failed to fetch orders"));
      toast.error(err?.message || "Could not fetch orders");
      return [];
    }
  };
};

// ✅ Fetch Restaurant Orders
export const fetchRestaurantOrders = (token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_RESTAURANT_ORDERS, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response?.data?.success) throw new Error("Failed to fetch orders");

      dispatch(setOrders(response.data.orders));
      return response.data.orders;
    } catch (err) {
      console.error(err);
      dispatch(setError(err?.message || "Failed to fetch orders"));
      toast.error(err?.message || "Could not fetch orders");
      return [];
    }
  };
};

/* ================== Delivery Boy APIs ================== */

// ✅ Fetch orders for delivery boy (ready-to-dispatch or assigned)
export const fetchDeliveryOrdersAPI = (token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_DELIVERY_ORDERS, null, {
        Authorization: `Bearer ${token}`,
      });
      // console.log(response,"akjds")
      if (!response?.data?.success)
        throw new Error("Failed to fetch delivery orders");

      dispatch(setOrders(response?.data?.orders));
      return response?.data?.orders;
    } catch (err) {
      console.error("FETCH_DELIVERY_ORDERS ERROR:", err);
      dispatch(setError(err?.message || "Failed to fetch orders"));
      toast.error(err?.message || "Could not fetch orders");
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// ✅ Accept order (delivery boy)
export const acceptOrderAPI = (orderId, token) => {
  return async (dispatch) => {
    const toastId = toast.loading("Accepting order...");
    try {
      const response = await apiConnector(
        "POST",
        ACCEPT_ORDER,
        { orderId },
        { Authorization: `Bearer ${token}` }
      );

      if (!response?.data?.success) throw new Error("Failed to accept order");
      toast.success("Order accepted! You are out for delivery now.");
      return response?.data?.order;
    } catch (err) {
      console.error("ACCEPT_ORDER ERROR:", err);
      toast.error(err?.message || "Could not accept order");
      return null;
    } finally {
      toast.dismiss(toastId);
    }
  };
};

// ✅ Complete order (delivery boy) with OTP verification
export const completeOrderAPI = (orderId, token, otp) => {
  return async (dispatch) => {
    const toastId = toast.loading("Completing order...");
    try {
      const response = await apiConnector(
        "POST",
        COMPLETE_ORDER,
        { orderId, otp },
        { Authorization: `Bearer ${token}` }
      );

      if (!response?.data?.success) throw new Error("Failed to complete order");
      toast.success("Order marked as delivered!");
      return response.data.order;
    } catch (err) {
      console.error("COMPLETE_ORDER ERROR:", err);
      toast.error(err?.message || "Could not complete order");
      return null;
    } finally {
      toast.dismiss(toastId);
    }
  };
};

export const fetchCompletedDeliveryOrdersAPI = (token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "GET",
        GET_COMPLETED_DELIVERY_ORDERS,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      return response?.data?.orders || [];
    } catch (err) {
      console.error("FETCH_COMPLETED_DELIVERY_ORDERS ERROR:", err);
      return [];
    }
  };
};

//GET_COMPLETED_RESTAURANT_ORDERS

export const fetchCompletedRestaurantOrdersAPI = (token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "GET",
        GET_COMPLETED_RESTAURANT_ORDERS,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      return response?.data?.orders || [];
    } catch (err) {
      console.error("FETCH_COMPLETED_RESTAURANT_ORDERS ERROR:", err);
      return [];
    }
  };
};
