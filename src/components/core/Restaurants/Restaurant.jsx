import React, { useEffect, useState } from "react";
import { getAllRestaurant } from "../../../services/operations/restaurantAPI";
import { HomeImages } from "../../../data/Images";
import { useNavigate } from "react-router-dom";
import RestoBanner from "../Home/RestoBanner";
import HappyClient from "../Home/HappyClient";

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await getAllRestaurant();
        console.log("Fetched Restaurants:", response);

        // ✅ Calculate average rating for each restaurant (from dishes)
        const updatedRestaurants = response.map((resto) => {
          let avgRating = 0;
          if (resto.dishes && resto.dishes.length > 0) {
            const totalRatings = resto.dishes.reduce((sum, dish) => {
              return sum + (dish.rating || 0);
            }, 0);
            avgRating = (totalRatings / resto.dishes.length).toFixed(1);
          }
          return { ...resto, avgRating };
        });

        setRestaurants(updatedRestaurants || []);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="w-full bg-white min-h-screen">
      {/* ✅ Banner Section */}
      <div className="w-full h-30 md:h-45 lg:h-60 relative overflow-hidden">
        <img
          src={
            HomeImages.resto ||
            "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1500&q=80"
          }
          alt="Restaurants Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold drop-shadow-lg">
            #Restaurants
          </h1>
        </div>
      </div>

      {/* ✅ Restaurants Section */}
      <div className=" mx-10 mt-4 py-5 lg:ml-30 lg:mr-20 lg:py-10">
        <h2 className="text-3xl font-bold mb-6 text-green-800 text-center">
          Explore All Restaurants
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading restaurants...</p>
        ) : restaurants.length === 0 ? (
          <p className="text-center text-gray-600">No restaurants found ❌</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-8">
            {restaurants.map((resto) => (
              <div
                key={resto._id}
                onClick={()=> navigate(`/restaurant/${resto._id}`)}
                className="bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                {/* ✅ Restaurant Image */}
                <img
                  src={
                    resto?.images?.[0] ||
                    "https://images.unsplash.com/photo-1600891963938-a3f2b4a52b4c?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={resto?.name}
                  className="w-full h-72 object-cover"
                />

                {/* ✅ Content Section */}
                <div className="p-4">
                  {/* Restaurant Name */}
                  <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                    {resto.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {resto.description || "No description available."}
                  </p>

                  {/* Owner Details */}
                  {resto.owner && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-700 font-medium">
                        👨‍🍳 Owner:{" "}
                        <span className="font-semibold">
                          {resto.owner.firstName} {resto.owner.lastName}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        ✉️ {resto.owner.email}
                      </p>
                    </div>
                  )}

                  {/* Rating & Button */}
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-semibold">
                      ⭐ {resto.avgRating || "0.0"}
                    </span>
                    <button className="bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:opacity-85 transition">
                      View Menu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <HappyClient/>
    </div>
  );
};

export default Restaurant;
