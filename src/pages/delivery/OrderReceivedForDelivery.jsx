import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDeliveryOrdersAPI,
  acceptOrderAPI,
  completeOrderAPI,
} from "../../services/operations/OrderAPI";
import toast from "react-hot-toast";

const OrderReceivedForDelivery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state?.orders || {});
  const { token, user } = useSelector((state) => state?.auth || {});

  // ✅ only 2 tabs now
  const tabs = ["ready-to-dispatch", "out-for-delivery"];
  const [activeTab, setActiveTab] = useState("ready-to-dispatch");

  useEffect(() => {
    if (token) {
      dispatch(fetchDeliveryOrdersAPI(token));
    }
  }, [dispatch, token]);

  // ✅ filter orders by tab
  const displayedOrders =
    orders?.filter((order) => {
      switch (activeTab) {
        case "ready-to-dispatch":
          return order?.status === "dispatching";
        case "out-for-delivery":
          return (
            order?.status === "out-for-delivery" &&
            order?.assignedDeliveryBoy?._id === user?._id
          );
        default:
          return false;
      }
    }) || [];

  // ✅ Accept order (move to out-for-delivery)
  const handleAcceptOrder = async (orderId) => {
    try {
      await dispatch(acceptOrderAPI(orderId, token));
      await dispatch(fetchDeliveryOrdersAPI(token));
    } catch (err) {
      toast.error("Failed to accept order.");
      console.error("ACCEPT_ORDER ERROR:", err);
    }
  };

  // ✅ Complete order with OTP verification and redirect to /history
  const handleCompleteOrder = async (orderId) => {
    try {
      const otp = prompt("Enter OTP to complete delivery:");
      if (!otp) {
        toast.error("OTP is required!");
        return;
      }

      const result = await dispatch(completeOrderAPI(orderId, token, otp));

      if (result) {
        await dispatch(fetchDeliveryOrdersAPI(token));

        // ✅ redirect to completed orders page
        navigate("/dashboard/history");
      }
    } catch (err) {
      toast.error("Failed to complete order.");
      console.error("COMPLETE_ORDER ERROR:", err);
    }
  };

  return (
    <div className=" mx-6 md:mx-10 lg:mx-15 mt-10 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[#195A00]">
        Delivery Orders
      </h2>

      {/* ✅ Tabs */}
      <div className="flex gap-4 mb-6">
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
            {tab.replaceAll("-", " ")}
          </button>
        ))}
      </div>

      {/* ✅ Display Orders */}
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
                Order ID: {order?._id || "N/A"}
              </p>
              <p className="text-gray-600 mb-1">
                Customer: {order?.customer?.firstName || "N/A"}{" "}
                {order?.customer?.lastName || ""}
              </p>
              <p className="text-gray-600 mb-1">
                Status:{" "}
                <span className="font-bold text-[#195A00]">
                  {order?.status || "N/A"}
                </span>
              </p>
              <p className="text-gray-600 mb-2">
                Total: ₹{order?.totalPrice?.toFixed(2) || "0.00"}
              </p>

              <div>
                <h4 className="font-semibold mb-1">Items:</h4>
                <ul className="list-disc list-inside">
                  {order?.items?.map((item, i) => (
                    <li key={item?.dish?._id || i}>
                      {item?.dish?.name || "Unnamed Dish"} ×{" "}
                      {item?.quantity || 0} – ₹
                      {(item?.dish?.price * item?.quantity || 0)?.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ✅ Buttons */}
              {activeTab === "ready-to-dispatch" && (
                <button
                  onClick={() => handleAcceptOrder(order?._id)}
                  className="mt-3 px-3 py-1 bg-[#195A00] text-white rounded hover:bg-green-800 transition"
                >
                  Accept Order
                </button>
              )}

              {activeTab === "out-for-delivery" && (
                <button
                  onClick={() => handleCompleteOrder(order?._id)}
                  className="mt-3 px-3 py-1 bg-[#195A00] text-white rounded hover:bg-green-800 transition"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderReceivedForDelivery;
