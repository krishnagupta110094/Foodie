import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSingleRestaurantDetails } from "../../services/operations/restaurantAPI";
import { AiFillStar, AiOutlineEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const RestoDetails = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.restaurant) {
      setRestaurantId(user?.restaurant);
    } 
  }, [user]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantId || !token) return;
      setLoading(true);
      const data = await getSingleRestaurantDetails(restaurantId, token);
      setRestaurant(data);
      // console.log(data,"debug1");
      setLoading(false);
    };
    fetchRestaurant();
  }, [restaurantId, token]);

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-20 text-lg">
        Loading restaurant details...
      </p>
    );

  if (!restaurant)
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

  return (
    <div className="mx-4 md:mx-10 mt-10 flex flex-col lg:flex-row gap-6">
      {/* Left: Banner */}
      <div className="relative w-full lg:w-2/3 h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
        {restaurant.images?.length > 1 ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            className="h-full w-full"
          >
            {restaurant.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={`slide-${idx}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img
            src={
              restaurant.images?.[0] || "https://via.placeholder.com/800x400"
            }
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        )}

        {/* Top-right Buttons */}
        <div className="absolute top-4 right-4 flex space-x-3 z-50">
          <button
            onClick={() =>
              navigate(`/dashboard/edit-restaurant/${restaurant._id}`)
            }
            className="flex items-center bg-white border border-[#195A00] text-[#195A00] font-semibold px-4 py-2 rounded-full shadow hover:bg-[#195A00] hover:text-white transition duration-300"
          >
            <AiOutlineEdit className="mr-1" /> Edit
          </button>

          <button
            onClick={() => navigate(`/dashboard/my-dishes`)}
            className="bg-gradient-to-r from-[#195A00] to-[#4CAF50] text-white font-bold px-4 py-2 rounded-full shadow hover:scale-105 transition transform duration-300"
          >
            Menu
          </button>
        </div>

        {/* Banner Overlay */}
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-[#195A00]/90 via-transparent w-full p-6 rounded-b-2xl">
          <h1 className="text-4xl md:text-5xl text-white font-extrabold drop-shadow-lg">
            {restaurant.name}
          </h1>
          <div className="flex items-center mt-2 space-x-4">
            <span className="flex items-center text-yellow-400 font-semibold">
              <AiFillStar className="mr-1" /> {restaurant.rating}
            </span>
            <span className="bg-[#195A00] text-white px-3 py-1 rounded-full text-sm font-medium drop-shadow-md">
              {restaurant.status?.toUpperCase() || "ACTIVE"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Info Card */}
      <div className="w-full lg:w-1/3 bg-gradient-to-b from-white to-gray-50 shadow-2xl rounded-3xl p-8 border-l-8 border-[#195A00] hover:shadow-3xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-[#195A00] mb-4">
          {restaurant.name || "N/A"}
        </h2>

        <div className="mb-3">
          <span className="font-semibold text-gray-700">Address:</span>
          <p className="text-gray-600 mt-1">{restaurant.address || "N/A"}</p>
        </div>

        <div className="mb-3">
          <span className="font-semibold text-gray-700">Cuisine:</span>
          <p className="text-gray-600 mt-1">
            {restaurant.cuisineType || "Multi-Cuisine"}
          </p>
        </div>

        <div className="mb-4">
          <span className="font-semibold text-gray-700">Description:</span>
          <p className="text-gray-600 mt-1">{restaurant.description}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-800 font-semibold text-lg">
            {restaurant.dishes?.length || 0}{" "}
            {restaurant.dishes?.length === 1 ? "dish" : "dishes"}
          </span>
          <span className="bg-[#195A00] text-white px-4 py-2 rounded-full font-bold shadow-md">
            Available
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestoDetails;
