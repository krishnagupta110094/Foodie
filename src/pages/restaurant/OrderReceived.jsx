import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRestaurantOrders,
  updateOrderStatusAPI,
} from "../../services/operations/OrderAPI";
import toast from "react-hot-toast";
import { getAllRestaurant } from "../../services/operations/restaurantAPI";

const OrderReceived = () => {
  const dispatch = useDispatch();
  const { orders = [] } = useSelector((state) => state.orders) || {};
  const { token,user } = useSelector((state) => state.auth) || {};
    const [restaurant, setRestaurant] = useState(null);
    const [loading,setLoading] = useState(false);
  

  // Tabs based on status
  const tabs = [
    "pending",
    "preparing",
    "dispatching",
    "out-for-delivery",
    "completed",
  ];
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const fetchMyRestaurant = async () => {
      try {
        setLoading(true);
        // Fetch all restaurants
        const restaurants = await getAllRestaurant();

        // Find restaurant belonging to logged-in user
        const myRestaurant = restaurants.find(
          (resto) => resto?.owner?._id === user?._id
        );

        if (myRestaurant) {
          setRestaurant(myRestaurant);
        } else {
          setRestaurant(null);
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.accountType === "restaurantOwner") fetchMyRestaurant();
  }, [user]);

  // Fetch orders on mount
  useEffect(() => {
    if (token && restaurant) dispatch(fetchRestaurantOrders(token));
  }, [dispatch, token,restaurant]);

  // Filter orders by active tab
  const displayedOrders =
    orders?.filter((order) => {
      if (activeTab === "completed") return order?.status === "delivered";
      return order?.status === activeTab;
    }) || [];

  // Handle status transitions for RestaurantOwner
  const handleStatusUpdate = (orderId, currentStatus) => {
    let nextStatus;

    switch (currentStatus) {
      case "pending":
        nextStatus = "preparing";
        break;
      case "preparing":
        nextStatus = "dispatching"; // After this, delivery boys take over
        break;
      default:
        return;
    }

    dispatch(updateOrderStatusAPI(orderId, nextStatus, token))?.then(() => {
      // toast.success(`Order moved to ${nextStatus?.replace("-", " ")}`);
      dispatch(fetchRestaurantOrders(token)); // Refresh orders
    });
  };

  // ✅ Loading state
  if (loading) {
    return <p className="ml-15 mt-10">Loading your restaurant...</p>;
  }

  // ❌ No restaurant found
  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          🍽️ No Restaurant Found
        </h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          It looks like you haven’t created a restaurant yet. Start your journey
          by creating one now!
        </p>
        <button
          onClick={() => navigate("/dashboard/create-restaurant")}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg shadow-md transition-all"
        >
          + Create Your Restaurant
        </button>
      </div>
    );
  }

  return (
    <div className="mx-6 mt-6 md:mx-15 md:mt-10 min-h-screen ">
      <h2 className="text-3xl font-bold mb-6 text-[#195A00]">
        Orders Received
      </h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {tabs?.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded font-medium capitalize ${
              activeTab === tab
                ? "bg-[#195A00] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab?.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <p>Loading orders...</p>
      ) : displayedOrders?.length === 0 ? (
        <p className="text-gray-600">No orders found for this status.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {displayedOrders?.map((order) => (
            <div
              key={order?._id}
              className="p-4 border rounded-xl shadow-md hover:shadow-lg transition bg-white"
            >
              <p className="font-semibold text-gray-700 mb-1">
                Order ID: {order?._id}
              </p>
              <p className="text-gray-600 mb-1">
                Customer: {order?.customer?.firstName}{" "}
                {order?.customer?.lastName}
              </p>
              <p className="text-gray-600 mb-1">
                Contact Info: {order?.customer?.email}
              </p>
              <p className="text-gray-600 mb-1">
                Status:{" "}
                <span className="font-bold text-[#195A00]">
                  {order?.status}
                </span>
              </p>
              <p className="text-gray-600 mb-2">
                Total: ₹{order?.totalPrice?.toFixed(2)}
              </p>

              <div>
                <h4 className="font-semibold mb-1">Items:</h4>
                <ul className="list-disc list-inside">
                  {order?.items?.map((item) => (
                    <li key={item?.dish?._id}>
                      {item?.name} x {item?.quantity} - ₹
                      {(item?.price * item?.quantity)?.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status update buttons for RestaurantOwner */}
              {["pending", "preparing"]?.includes(order?.status) && (
                <button
                  onClick={() => handleStatusUpdate(order?._id, order?.status)}
                  className="mt-3 px-3 py-1 bg-[#195A00] text-white rounded hover:bg-green-800 transition"
                >
                  {order?.status === "pending"
                    ? "Move to Preparing"
                    : "Dispatch to Delivery"}
                </button>
              )}

              {/* Assigned delivery boy */}
              {order?.status === "out-for-delivery" && (
                <p className="mt-3 text-gray-700 italic">
                  Assigned to: {order?.assignedDeliveryBoy?.firstName}{" "}
                  {order?.assignedDeliveryBoy?.lastName}
                </p>
              )}

              {/* Optional: dispatching orders note */}
              {order?.status === "dispatching" && (
                <p className="mt-3 text-gray-700 italic">
                  Ready for delivery boys to pick up
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderReceived;
