import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCustomerOrders } from "../../services/operations/OrderAPI";
const MyOrder = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.orders);
  const [tab, setTab] = useState("active");

  useEffect(() => {
    dispatch(fetchCustomerOrders(token));
  }, [dispatch]);

  const activeStatuses = [
    "pending",
    "preparing",
    "dispatching",
    "out-for-delivery",
  ];
  const completedStatuses = ["delivered", "cancelled"];

  const displayedOrders = orders
    .filter((order) =>
      tab === "active"
        ? activeStatuses.includes(order.status)
        : completedStatuses.includes(order.status)
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // descending by date

  return (
    <div className=" mt-10 min-h-screen mx-6 md:mx-15">
      <h2 className="text-3xl font-bold mb-6 text-[#195A00]">My Orders</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-medium ${
            tab === "active"
              ? "bg-[#195A00] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setTab("active")}
        >
          Active Orders
        </button>
        <button
          className={`px-4 py-2 rounded font-medium ${
            tab === "completed"
              ? "bg-[#195A00] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setTab("completed")}
        >
          Completed Orders
        </button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : displayedOrders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {displayedOrders.map((order) => (
            <div
              key={order._id}
              className="p-4 border rounded-xl shadow-md hover:shadow-lg transition bg-white"
            >
              <p className="font-semibold text-gray-700 mb-1">
                Order ID: {order._id}
              </p>
              <p className="text-gray-600 mb-1">
                Restaurant: {order.restaurant?.name || "N/A"}
              </p>
              <p className="text-gray-600 mb-1">
                Status:{" "}
                <span className="font-bold text-[#195A00]">{order.status}</span>
              </p>
              <p className="text-gray-600 mb-2">
                Total: ₹{order.totalPrice?.toFixed(2)}
              </p>

              <div>
                <h4 className="font-semibold mb-1">Items:</h4>
                <ul className="list-disc list-inside">
                  {order.items.map((item) => (
                    <li key={item.dish?._id}>
                      {item.name} x {item.quantity} - ₹
                      {(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrder;
