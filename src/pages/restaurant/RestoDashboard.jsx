import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompletedRestaurantOrdersAPI } from "../../services/operations/OrderAPI";

const RestoDashboard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state?.auth || {});
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      setLoading(true);
      const orders = await dispatch(fetchCompletedRestaurantOrdersAPI(token));
      setCompletedOrders(orders);
      console.log(orders);
      setLoading(false);
    };

    fetchOrders();
  }, [dispatch, token]);

  // Calculate grand total of restaurant earnings
  const grandTotal = completedOrders.reduce(
    (acc, order) => acc + (order.restaurantEarning || 0),
    0
  );

  return (
    <div className="mx-6 mt-6 md:mx-15 md:mt-10 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[#195A00]">
        Completed Orders
      </h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : completedOrders.length === 0 ? (
        <p className="text-gray-600">No completed orders</p>
      ) : (
        <div className="flex flex-col gap-4">
          {completedOrders.map((order) => (
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
                Order Total: ₹{order?.totalPrice?.toFixed(2) || "0.00"}
              </p>
              <p className="text-gray-600 mb-1 font-bold text-[#195A00]">
                Restaurant Earning: ₹{order?.restaurantEarning?.toFixed(2) || "0.00"}
              </p>
              <p className="text-gray-600 mb-2">
                Delivered At: {new Date(order?.updatedAt).toLocaleString() || "N/A"}
              </p>
            </div>
          ))}

          <div className="mt-6 p-4 border rounded-xl shadow-md bg-[#195A00] text-white font-bold text-lg">
            Grand Total Earnings: ₹{grandTotal.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestoDashboard;
