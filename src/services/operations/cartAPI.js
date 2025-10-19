import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { cartEndpoints } from "../apis";
import { setCart, resetCart } from "../../slices/cartSlice";

const { GET_USER_CART, ADD_TO_CART, REMOVE_FROM_CART, RESET_CART } =
  cartEndpoints;

export function getUserCart(token, navigate) {
  return async (dispatch) => {
    // const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("GET", GET_USER_CART, null, {
        Authorization: `Bearer ${token}`,
      });

      console.log("GETUSERCART API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // ✅ Update Redux store
      const { cart, totalItems,subTotal,totalDeliveryFee, totalPrice } = response.data;
      dispatch(setCart({ items: cart.items, totalItems, totalPrice }));
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: cart.items,
          totalItems,
          subTotal,
          totalDeliveryFee,
          totalPrice,
        })
      );
    } catch (error) {
      console.log("GETUSERCART API ERROR............", error);
      // toast.error("GETUSERCART Failed");
    } finally {
      // toast.dismiss(toastId);
    }
  };
}

export function addToCart(dishId, quantity, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Adding to cart...");
    try {
      // ✅ use POST, not GET, when sending body data
      const response = await apiConnector(
        "POST",
        ADD_TO_CART,
        { dishId, quantity },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("ADD_TO_CART API RESPONSE:", response);
      // ✅ Check for "alreadyInCart" first
      // if (response?.data?.message == "alreadyInCart") {
      //   toast.warn("This item is already in your cart!");
      //   return; // exit early
      // }

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // ✅ optionally update Redux immediately
      const { cart, totalItems, subTotal,totalDeliveryFee, totalPrice } = response.data;
      dispatch(setCart({ items: cart.items, totalItems, subTotal,totalDeliveryFee, totalPrice }));

      // ✅ success toast
      toast.success(
        `"${response.data.addedDish?.name || "Dish"}" added to your cart!`
      );
    } catch (error) {
      if (error?.response?.data?.message === "alreadyInCart") {
        toast("This item is already in your cart!", {
          style: { background: "#FDE68A", color: "#92400E" },
        });
      } else {
        console.error("ADD_TO_CART API ERROR:", error);

        toast.error(error?.response?.data?.message);
      }
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export function removeDishFromCart(dishId, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Removing from cart...");
    try {
      const response = await apiConnector(
        "POST",
        REMOVE_FROM_CART(dishId),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("REMOVE_FROM_CART API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // ✅ Update Redux state after removal
      const { cart, totalItems,subTotal,totalDeliveryFee, totalPrice } = response.data;
      dispatch(setCart({ items: cart.items, totalItems, subTotal,totalDeliveryFee, totalPrice }));

      // ✅ success toast
      toast.success(
        `"${response.data.removedDish?.name || "Dish"}" removed from your cart.`
      );
    } catch (error) {
      console.error("REMOVE_FROM_CART API ERROR:", error);
      toast.error("Failed to remove dish. Please try again!");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export function resetUserCart(token) {
  return async (dispatch) => {
    const toastId = toast.loading("Clearing cart...");
    try {
      const response = await apiConnector(
        "POST", // or DELETE depending on backend
        RESET_CART,
        null, // no body needed
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("RESET_CART API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // ✅ Clear Redux cart state
      dispatch(resetCart());

      toast.success("Cart has been cleared successfully!");
    } catch (error) {
      console.error("RESET_CART API ERROR:", error);
      toast.error("Failed to clear cart. Please try again!");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export function IncDecItem(dishId, quantity, token) {
  return async () => {
    try {
      // Send API request to update quantity
      if(quantity==1){
        return;
      }
      const response = await apiConnector(
        "POST",
        ADD_TO_CART, // or your increment API
        { dishId, quantity },
        { Authorization: `Bearer ${token}` }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // ✅ Do NOT update Redux here! Optimistic update already handled.
      // Only handle errors if needed
    } catch (error) {
      console.error("UPDATE CART API ERROR:", error);
      // toast.error("Failed to update quantity. Please try again!");
    }
  };
}
