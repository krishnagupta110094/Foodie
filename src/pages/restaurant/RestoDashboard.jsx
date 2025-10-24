// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCompletedRestaurantOrdersAPI } from "../../services/operations/OrderAPI";

// const RestoDashboard = () => {
//   const dispatch = useDispatch();
//   const { token } = useSelector((state) => state?.auth || {});
//   const [completedOrders, setCompletedOrders] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!token) return;
//       setLoading(true);
//       const orders = await dispatch(fetchCompletedRestaurantOrdersAPI(token));
//       setCompletedOrders(orders);
//       console.log(orders);
//       setLoading(false);
//     };

//     fetchOrders();
//   }, [dispatch, token]);

//   // Calculate grand total of restaurant earnings
//   const grandTotal = completedOrders.reduce(
//     (acc, order) => acc + (order.restaurantEarning || 0),
//     0
//   );

//   return (
//     <div className="mx-6 mt-6 md:mx-15 md:mt-10 min-h-screen">
//       <h2 className="text-3xl font-bold mb-6 text-[#195A00]">
//         Completed Orders
//       </h2>

//       {loading ? (
//         <p>Loading orders...</p>
//       ) : completedOrders.length === 0 ? (
//         <p className="text-gray-600">No completed orders</p>
//       ) : (
//         <div className="flex flex-col gap-4">
//           {completedOrders.map((order) => (
//             <div
//               key={order?._id}
//               className="p-4 border rounded-xl shadow-md hover:shadow-lg transition bg-white"
//             >
//               <p className="font-semibold text-gray-700 mb-1">
//                 Order ID: {order?._id || "N/A"}
//               </p>
//               <p className="text-gray-600 mb-1">
//                 Customer: {order?.customer?.firstName || "N/A"}{" "}
//                 {order?.customer?.lastName || ""}
//               </p>
//               <p className="text-gray-600 mb-1">
//                 Order Total: ₹{order?.totalPrice?.toFixed(2) || "0.00"}
//               </p>
//               <p className="text-gray-600 mb-1 font-bold text-[#195A00]">
//                 Restaurant Earning: ₹{order?.restaurantEarning?.toFixed(2) || "0.00"}
//               </p>
//               <p className="text-gray-600 mb-2">
//                 Delivered At: {new Date(order?.updatedAt).toLocaleString() || "N/A"}
//               </p>
//             </div>
//           ))}

//           <div className="mt-6 p-4 border rounded-xl shadow-md bg-[#195A00] text-white font-bold text-lg">
//             Grand Total Earnings: ₹{grandTotal.toFixed(2)}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RestoDashboard;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCompletedRestaurantOrdersAPI } from "../../services/operations/OrderAPI";
import { getAllRestaurant } from "../../services/operations/restaurantAPI";

const RestoDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state?.auth || {});

  const [resto, setResto] = useState(null);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loadingResto, setLoadingResto] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // 1️⃣ Fetch Restaurant owned by the logged-in user
  useEffect(() => {
    const fetchMyRestaurant = async () => {
      if (!user?._id) return;
      setLoadingResto(true);
      try {
        const restaurants = await getAllRestaurant();
        const myRestaurant = restaurants.find(
          (r) => r?.owner?._id === user._id
        );
        setResto(myRestaurant || null);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoadingResto(false);
      }
    };

    fetchMyRestaurant();
  }, [user]);

  // 2️⃣ Fetch Completed Orders if Restaurant Exists
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token || !resto) return;
      setLoadingOrders(true);
      try {
        const orders = await dispatch(fetchCompletedRestaurantOrdersAPI(token));
        setCompletedOrders(orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [dispatch, token, resto]);

  // 3️⃣ Calculate Total Earnings
  const grandTotal = completedOrders.reduce(
    (acc, order) => acc + (order?.restaurantEarning || 0),
    0
  );

  // 4️⃣ UI Rendering
  if (loadingResto)
    return <p className="ml-15 mt-10">Loading your restaurant...</p>;

  if (!resto)
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

  // ✅ Show Completed Orders if restaurant exists
  return (
    <div className="mx-6 mt-6 md:mx-15 md:mt-10 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[#195A00]">
        Completed Orders
      </h2>

      {loadingOrders ? (
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
                Restaurant Earning: ₹
                {order?.restaurantEarning?.toFixed(2) || "0.00"}
              </p>
              <p className="text-gray-600 mb-2">
                Delivered At:{" "}
                {new Date(order?.updatedAt).toLocaleString() || "N/A"}
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
