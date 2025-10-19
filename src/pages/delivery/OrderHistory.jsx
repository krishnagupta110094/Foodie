import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompletedDeliveryOrdersAPI } from "../../services/operations/OrderAPI";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state?.auth || {});
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      setLoading(true);
      const orders = await dispatch(fetchCompletedDeliveryOrdersAPI(token));
      // Filter only orders assigned to this delivery boy
      const filteredOrders = orders.filter(
        (order) => order?.assignedDeliveryBoy === user?._id
      );
      setCompletedOrders(filteredOrders);
      setLoading(false);
    };
    fetchOrders();
  }, [dispatch, token, user]);

  return (
    <div className="mx-6 md:mx-10 lg:mx-15 mt-10 min-h-screen">
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
                Total: ₹{order?.totalPrice?.toFixed(2) || "0.00"}
              </p>
              <p className="text-gray-600 mb-2">
                Delivered At: {new Date(order?.updatedAt).toLocaleString() || "N/A"}
              </p>

              <div>
                <h4 className="font-semibold mb-1">Items:</h4>
                <ul className="list-disc list-inside">
                  {order?.items?.map((item, i) => (
                    <li key={item?.dish?._id || i}>
                      {item?.dish?.name || "Unnamed Dish"} x {item?.quantity || 0} – ₹
                      {(item?.dish?.price * item?.quantity || 0).toFixed(2)}
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

export default OrderHistory;
