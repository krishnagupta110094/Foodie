import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDishById } from "../../../services/operations/dishAPI";
import { getDishByCategory } from "../../../services/operations/categoryAPI";
import { addToCart } from "../../../services/operations/cartAPI";
import DishCard from "../../common/DishCard";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// React-icons
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa";

const DishDetail = () => {
  const { dishId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [dish, setDish] = useState(null);
  const [relatedDishes, setRelatedDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  // Fetch dish details
  useEffect(() => {
    const fetchDishData = async () => {
      try {
        setLoading(true);
        const dishData = await getDishById(dishId);
        setDish(dishData);

        if (dishData?.category) {
          const related = await getDishByCategory(dishData?.category?.name);
          const filtered = related.filter((d) => d._id !== dishId);
          setRelatedDishes(filtered || []);
        } else {
          setRelatedDishes([]);
        }
      } catch (err) {
        console.error("Error fetching dish details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDishData();
    setQuantity(1);
  }, [dishId]);

  // Swiper navigation binding
  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [relatedDishes]);

  // ✅ Handle Add to Cart
  const handleAddToCart = () => {
    if (!token) return toast.error("Please login to add items to your cart.");
    dispatch(addToCart(dish._id, quantity, token));
  };

  // ✅ Handle quantity change
  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/dashboard/cart");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!dish)
    return <p className="text-center mt-10 text-red-500">Dish not found.</p>;

  return (
    <div className="px-6 md:px-20 mt-10">
      {/* Dish Main Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left - Dish Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={dish?.image}
            alt={dish?.name}
            className="w-full h-[250px] lg:h-[400px] object-contain rounded-2xl shadow-lg"
          />
        </div>

        {/* Right - Dish Details */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-gray-900">{dish?.name}</h2>

          {/* Restaurant & Category badges */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full text-sm shadow-sm">
              {dish?.restaurant?.name || "Unknown Restaurant"}
            </span>
            <span className="bg-yellow-100 text-yellow-800 font-semibold px-3 py-1 rounded-full text-sm shadow-sm">
              {dish?.category?.name || "Unknown Category"}
            </span>
          </div>

          <p className="text-gray-700 mt-2">{dish?.description}</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-green-600 font-semibold text-lg">
              ⭐ {dish?.rating || "0"}
            </span>
            <span
              className={`font-medium ${
                dish?.status ? "text-green-600" : "text-red-500"
              }`}
            >
              {dish?.status ? "Available" : "Out Of Stock"}
            </span>
          </div>

          <p className="text-3xl font-bold text-[#195A00] mt-2">
            ₹{dish?.price?.toFixed(2) || "0.00"}
          </p>

          {/* ✅ Quantity Control */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleDecrement}
              className="p-2 border rounded-full hover:bg-[#195A00] hover:text-white transition"
              title="Decrease Quantity"
            >
              <FaMinus size={12} />
            </button>

            <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium">
              {quantity}
            </span>

            <button
              onClick={handleIncrement}
              className="p-2 border rounded-full hover:bg-[#195A00] hover:text-white transition"
              title="Increase Quantity"
            >
              <FaPlus size={12} />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-x-4 mt-5">
            <button
              onClick={handleAddToCart}
              className="bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition-all transform hover:-translate-y-1 hover:scale-105"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-yellow-400 text-[#195A00] px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-500 transition-all transform hover:-translate-y-1 hover:scale-105"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Dishes */}
      <div className="mt-12 relative">
        <h3 className="text-2xl font-bold mb-4">Related Dishes</h3>

        {relatedDishes?.length === 0 && (
          <p className="text-gray-500">No related dishes available.</p>
        )}

        {relatedDishes?.length > 0 && (
          <>
            <button
              ref={prevRef}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-green-600 text-white p-3 rounded-full shadow-md hover:bg-green-700"
            >
              <FiChevronLeft size={24} />
            </button>

            <button
              ref={nextRef}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-green-600 text-white p-3 rounded-full shadow-md hover:bg-green-700"
            >
              <FiChevronRight size={24} />
            </button>

            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={4}
              loop={relatedDishes}
              breakpoints={{
                320: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
            >
              {relatedDishes?.map((d) => (
                <SwiperSlide key={d._id || d.id}>
                  <DishCard dish={d} />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
      </div>
    </div>
  );
};

export default DishDetail;
