import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import {
  removeDishFromCart,
  IncDecItem,
} from "../../services/operations/cartAPI";
import { setCart } from "../../slices/cartSlice";
import toast from "react-hot-toast";
import { placeOrderAPI } from "../../services/operations/OrderAPI";
import { useNavigate } from "react-router-dom";
import {
  createRazorpayOrderAPI,
  verifyPaymentAPI,
} from "../../services/operations/paymentAPI";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, subTotal, totalDeliveryFee, totalPrice } =
    useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [updatingDishId, setUpdatingDishId] = useState(null);

  // ✅ Optimistic quantity update
  const updateQuantityOptimistic = (dishId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = items.map((item) =>
      item.dish._id === dishId ? { ...item, quantity: newQuantity } : item
    );

    const totalItemsUpdated = updatedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const subTotalUpdated = updatedItems.reduce(
      (sum, item) => sum + item.quantity * item.dish.price,
      0
    );

    // ✅ 10% delivery fee per dish (rounded to 2 decimals)
    const totalDeliveryFeeUpdated = updatedItems.reduce((sum, item) => {
      const feePerDish = Number((0.1 * item.dish.price).toFixed(2));
      return Number((sum + item.quantity * feePerDish).toFixed(2));
    }, 0);

    const totalPriceUpdated = Number(
      (subTotalUpdated + totalDeliveryFeeUpdated).toFixed(2)
    );

    // ✅ Update Redux immediately for smoother UI
    dispatch(
      setCart({
        items: updatedItems,
        totalItems: totalItemsUpdated,
        subTotal: subTotalUpdated,
        totalDeliveryFee: totalDeliveryFeeUpdated,
        totalPrice: totalPriceUpdated,
      })
    );

    // ✅ API call in background
    setUpdatingDishId(dishId);
    dispatch(IncDecItem(dishId, newQuantity, token)).finally(() =>
      setUpdatingDishId(null)
    );
  };

  const handleRemoveDish = (dishId) => {
    dispatch(removeDishFromCart(dishId, token));
  };

  // ✅ Check if all dishes belong to same restaurant
  const isSingleRestaurant = () => {
    if (!items || items.length === 0) return false;
    const firstRestoId = items[0]?.dish?.restaurant?._id;
    return items.every((item) => item?.dish?.restaurant?._id === firstRestoId);
  };

  // const handleOrderNow = () => {
  //   if (!isSingleRestaurant()) {
  //     toast.error("You can order from only one restaurant at a time!");
  //     return;
  //   }

  //   // Proceed with order placement (you can navigate or trigger API here)
  //   toast.success("Order placed successfully!");
  // };
  // const handleOrderNow = () => {
  //   if (!isSingleRestaurant()) {
  //     toast.error("You can order from only one restaurant at a time!");
  //     return;
  //   }

  //   const restaurantId = items[0].dish.restaurant._id;

  //   const orderData = {
  //     customerId: user._id,
  //     restaurantId,
  //     items: items.map((item) => ({
  //       dish: item.dish._id,
  //       name: item.dish.name,
  //       price: item.dish.price,
  //       quantity: item.quantity,
  //     })),
  //     subTotal,
  //     deliveryFee: totalDeliveryFee,
  //     totalPrice,
  //   };

  //   dispatch(placeOrderAPI(orderData, token)).then((res) => {
  //     if (res?.success) navigate("/dashboard/my-orders");
  //   });
  // };
  const handleOrderNow = async () => {
    try {
      if (!isSingleRestaurant()) {
        toast.error("You can order from only one restaurant at a time!");
        return;
      }

      if (!token) {
        toast.error("Please login to place order!");
        return;
      }

      const restaurantId = items[0].dish.restaurant._id;

      // ✅ Prepare order data (same as before)
      const orderData = {
        customerId: user._id,
        restaurantId,
        items: items.map((item) => ({
          dish: item.dish._id,
          name: item.dish.name,
          price: item.dish.price,
          quantity: item.quantity,
        })),
        subTotal,
        deliveryFee: totalDeliveryFee,
        totalPrice,
      };

      // ✅ Step 1: Create Razorpay order
      const paymentOrder = await createRazorpayOrderAPI(token, totalPrice);
      if (!paymentOrder?.success) {
        toast.error("Failed to initiate payment!");
        return;
      }

      // ✅ Step 2: Configure Razorpay options
      const options = {
        key: "rzp_test_RJftnFxGuWStKT", // add in .env frontend
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "Food Delivery App",
        description: "Order Payment",
        order_id: paymentOrder.orderId,
        theme: { color: "#195A00" },
        prefill: {
          name: user?.fullName || "Customer",
          email: user?.email || "test@example.com",
        },

        handler: async function (response) {
          // ✅ Step 3: Verify payment
          const verifyRes = await verifyPaymentAPI(token, response);
          if (!verifyRes?.success) {
            toast.error("Payment verification failed!");
            return;
          }

          // ✅ Step 4: Only after payment success — place order
          const res = await dispatch(placeOrderAPI(orderData, token));
          if (res?.success) {
            navigate("/dashboard/my-orders");
          } else {
            toast.error("Order failed after payment!");
          }
        },

        modal: {
          ondismiss: function () {
            toast("Payment cancelled by user.");
          },
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong during payment.");
    }
  };

  if (!items || items.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-10 text-lg">
        Your cart is empty.
      </p>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 mx-4 sm:mx-6 mt-6 font-sans min-h-screen lg:mx-20">
      {/* Left Column */}
      <div className=" w-full lg:flex-[2]">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 tracking-wide text-[#195A00]">
          My Cart
        </h2>

        {items.map((item) => (
          <div
            key={item._id}
            className="relative flex flex-col sm:flex-row gap-4 mb-4 sm:mb-5 p-4 sm:p-5 border rounded-2xl items-start sm:items-center shadow-md bg-white hover:shadow-lg transition-all duration-300"
          >
            <span
              className={`absolute top-2 sm:top-5 right-2 sm:right-4 px-2 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                item?.dish?.status === "available"
                  ? "bg-green-100 text-green-700"
                  : item?.dish?.status === "unavailable"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item?.dish?.status || "N/A"}
            </span>

            <img
              src={item.dish?.image}
              alt={item.dish?.name}
              className="w-full sm:w-40 h-40 sm:h-40 object-cover rounded-xl"
            />

            <div className="flex flex-col flex-grow w-full">
              <h3 className="text-lg sm:text-xl font-semibold text-[#195A00]">
                {item.dish?.name}
              </h3>
              <p className="text-gray-600 text-sm">
                Category: {item.dish?.category?.name}
              </p>
              <p className="text-gray-600 text-sm">
                Restaurant:{" "}
                <span className="font-medium text-[#195A00]">
                  {item.dish?.restaurant?.name || "N/A"}
                </span>
              </p>
              <p className="text-gray-600 text-sm">
                Price:{" "}
                <span className="text-[#195A00] font-semibold">{`₹${item.dish?.price}`}</span>
              </p>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <button
                  onClick={() =>
                    updateQuantityOptimistic(item.dish._id, item.quantity - 1)
                  }
                  className="p-2 border rounded-full hover:bg-[#195A00] hover:text-white transition"
                  disabled={updatingDishId === item?.dish?._id}
                >
                  <FaMinus size={12} />
                </button>

                <span className="px-2 py-1 bg-gray-100 rounded-md text-sm font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantityOptimistic(item.dish._id, item.quantity + 1)
                  }
                  className="p-2 border rounded-full hover:bg-[#195A00] hover:text-white transition"
                  disabled={updatingDishId === item?.dish?._id}
                >
                  <FaPlus size={12} />
                </button>

                <button
                  onClick={() => handleRemoveDish(item.dish._id)}
                  className="ml-auto sm:ml-auto p-2 sm:p-3 text-lg sm:text-2xl text-red-600 hover:bg-red-100 rounded-full transition"
                >
                  <FaTrash />
                </button>
              </div>

              <p className="font-semibold text-gray-700 text-sm mt-2">
                Subtotal:{" "}
                <span className="text-[#195A00] font-semibold">{`₹${(
                  item.dish?.price * item.quantity
                ).toFixed(2)}`}</span>
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Delivery Fee (10%):{" "}
                <span className="text-[#195A00] font-semibold">{`₹${(
                  0.1 *
                  item.dish?.price *
                  item.quantity
                ).toFixed(2)}`}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="w-full lg:flex-1 border rounded-2xl p-4 sm:p-6 mt-6 lg:mt-14 lg:h-fit shadow-md bg-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#195A00]">
          Summary
        </h2>
        <p className="text-gray-700 mb-2 font-medium">
          Total Items: {totalItems}
        </p>
        <p className="text-gray-700 mb-2 font-medium">
          Subtotal: ₹{subTotal || 0}
        </p>
        <p className="text-gray-700 mb-2 font-medium">
          Delivery Fee (10%): ₹{totalDeliveryFee || 0}
        </p>
        <hr className="my-3" />
        <p className="text-lg font-bold text-[#195A00] mb-4">
          Grand Total: ₹{totalPrice || 0}
        </p>

        <button
          className="w-full py-3 px-4 bg-[#195A00] text-white font-semibold rounded-lg hover:bg-green-900 transition-all duration-300 shadow-md"
          onClick={handleOrderNow}
          disabled={updatingDishId !== null}
        >
          {updatingDishId ? "Updating..." : "Order Now"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
