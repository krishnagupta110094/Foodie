import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompletedDeliveryOrdersAPI } from "../../services/operations/orderAPI";

const Earning = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state?.auth || {});
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      setLoading(true);
      const orders = await dispatch(fetchCompletedDeliveryOrdersAPI(token));

      // Filter only orders assigned to this delivery boy
      const deliveryBoyOrders = orders.filter(
        (order) => order?.assignedDeliveryBoy === user?._id
      );

      setCompletedOrders(deliveryBoyOrders);

      // Calculate grand total of delivery fees
      const total = deliveryBoyOrders.reduce(
        (sum, order) => sum + (order?.paymentSplit?.deliveryFeeAmount || 0),
        0
      );
      setGrandTotal(total);

      setLoading(false);
    };

    fetchOrders();
  }, [dispatch, token, user]);

  return (
    <div className="mx-6 md:mx-10 lg:mx-15 mt-10 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[#195A00]">Earnings</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : completedOrders.length === 0 ? (
        <p className="text-gray-600">No completed orders yet</p>
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
                Earned: ₹{order?.paymentSplit?.deliveryFeeAmount?.toFixed(2) || "0.00"}
              </p>
              <p className="text-gray-600 mb-2">
                Delivered At: {new Date(order?.updatedAt).toLocaleString() || "N/A"}
              </p>
            </div>
          ))}

          {/* Grand total */}
          <div className="mt-6 p-4 border rounded-xl shadow-md bg-[#195A00] text-white font-bold text-lg">
            Grand Total Earnings: ₹{grandTotal.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Earning;
