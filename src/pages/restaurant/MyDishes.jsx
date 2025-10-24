// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { getAllRestaurant } from "../../services/operations/restaurantAPI";
// import RestoDetails from "../../components/core/Dashboard/MyResto/RestoDetails";

// const MyDishes = () => {
//   const { user, token } = useSelector((state) => state.auth);
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMyRestaurant = async () => {
//       try {
//         // Fetch all restaurants
//         const restaurants = await getAllRestaurant();

//         // Find restaurant belonging to logged-in user
//         const myRestaurant = restaurants.find(
//           (resto) => resto.owner._id === user._id
//         );

//         if (myRestaurant) {
//           setRestaurant(myRestaurant);
//         }
//       } catch (error) {
//         console.error("Error fetching restaurant:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.accountType === "restaurantOwner") fetchMyRestaurant();
//   }, [user]);

//   if (loading) return <p className="ml-15">Loading your restaurant...</p>;
//   if (!restaurant) return <p className="ml-15">No restaurant found for this account.</p>;

//   return <RestoDetails restoId={restaurant._id} />;
// };

// export default MyDishes;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllRestaurant } from "../../services/operations/restaurantAPI";
import RestoDetails from "../../components/core/Dashboard/MyResto/RestoDetails";
import { useNavigate } from "react-router-dom";

const MyDishes = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // ✅ Restaurant found → Show details
  return <RestoDetails restoId={restaurant?._id} />;
};

export default MyDishes;
