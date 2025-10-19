// src/components/restaurant/RestoDishCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiEditBoxLine, RiDeleteBinLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

const RestoDishCard = ({ dish ,onDelete }) => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();



  return (
    <div
      key={dish._id || dish.id}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 "
    >
      {/* Image */}
      <img
        src={dish.image}
        alt={dish.name}
        className="w-full h-60 object-contain rounded-t-2xl"
      />

      {/* Content */}
      <div className="p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">{dish.name}</h3>
          <span className="flex items-center text-sm text-green-600 font-semibold">
            ⭐ {dish.rating || "0"}
          </span>
        </div>
        <p className="font-semibold mb-3">
          Price: ₹{dish.price?.toFixed(2) || "0.00"}
        </p>

        <div className="flex gap-3 items-center">
          {/* Edit Button */}
          <button
            onClick={() =>
              navigate(`/dashboard/edit-dish/${dish._id || dish.id}`)
            }
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:opacity-80 flex items-center gap-1"
          >
            <RiEditBoxLine /> Edit
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:opacity-80 flex items-center gap-1"
          >
            <RiDeleteBinLine /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoDishCard;
