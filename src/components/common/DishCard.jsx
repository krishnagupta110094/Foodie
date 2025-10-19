// src/components/common/DishCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../services/operations/cartAPI";
import { useDispatch, useSelector } from "react-redux";

const DishCard = ({ dish }) => {
  // console.log(dish,"detail");
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // ✅ Make this function async
  const handleAddToCart = (dishId, quantity = 1) => {
    try {
      dispatch(addToCart(dishId,quantity,token));
      console.log("Dish added to cart successfully!");
    } catch (error) {
      console.error("Error adding dish to cart:", error);
    }
  };
  return (
    <div
      key={dish?._id || dish.id}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
    >
      {/* Image */}
      <img
        src={dish?.image}
        alt={dish?.name}
        onClick={() =>
          navigate(
            `/menu/category/${dish?.category?.name || "category"}/dishes/${dish._id || dish.id}`
          )
        }
        className="w-full h-60 object-contain rounded-t-2xl"
      />

      {/* Content */}
      <div className="p-4  flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">{dish.name}</h3>
          <span className="flex items-center text-sm text-green-600 font-semibold">
            ⭐ {dish.rating || "0"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => handleAddToCart(dish._id || dish.id)}
            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:opacity-80"
          >
            Add To Cart
          </button>
          <p className="font-semibold">₹{dish.price?.toFixed(2) || "0.00"}</p>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
