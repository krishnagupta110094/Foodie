import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getRestaurantById } from "../../../../services/operations/restaurantAPI";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import RestoCategory from "./RestoCategory";
import RestoDishCard from "./RestoDishCard";
import { deleteDish } from "../../../../services/operations/dishAPI";
import { useDispatch, useSelector } from "react-redux";


const RestoDetails = ({ restoId }) => {
  const params = useParams();
  const restaurantId = restoId || params.restaurantId;
  const [categories, setCategories] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // Refs for navigation per category
  const prevRefs = useRef({});
  const nextRefs = useRef({});

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const data = await getRestaurantById(restaurantId);

        if (data) {
          setRestaurantName(data.name);

          setCategories(
            data.categories.map((cat) => ({
              ...cat.category,
              dishes: cat.dishes,
            }))
          );

          setError("");
        } else {
          setError("Restaurant not found ❌");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong ❌");
      }
      setLoading(false);
    };

    fetchRestaurant();
  }, [restaurantId]);

  const handleDeleteDish = async (dishId, categoryId) => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      const result = await dispatch(deleteDish(dishId, token));
      if (result?.success) {
        // ✅ Remove dish locally from categories state
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat._id === categoryId
              ? { ...cat, dishes: cat.dishes.filter((d) => d._id !== dishId) }
              : cat
          )
        );
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="">
      {/* Banner */}
      <div
        className="w-full h-30 md:h-48 flex items-center justify-center rounded-lg shadow-lg"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1400&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-shadow-lg">
          #{restaurantName}
        </h1>
      </div>

      {/* Existing Category Section */}
      <RestoCategory categoriesData={categories} />

      {/* All Dishes Category-wise */}
      <div className="mx-10 lg:ml-30 lg:mr-20 ">
        {categories.map((category) => {
          // Initialize refs for this category
          if (!prevRefs.current[category._id])
            prevRefs.current[category._id] = React.createRef();
          if (!nextRefs.current[category._id])
            nextRefs.current[category._id] = React.createRef();

          return (
            <div key={category._id} className="relative">
              {/* Category Name */}
              <h3 className="text-2xl font-bold my-3 ">{category.name}</h3>

              {/* Swiper Navigation Buttons */}
              <button
                ref={prevRefs.current[category._id]}
                className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-green-600 text-white p-3 rounded-full shadow-md hover:bg-green-700"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                ref={nextRefs.current[category._id]}
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-green-600 text-white p-3 rounded-full shadow-md hover:bg-green-700"
              >
                <FiChevronRight size={24} />
              </button>

              {/* Swiper for dishes */}
              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={3}
                loop={true}
                navigation={{
                  prevEl: prevRefs.current[category._id].current,
                  nextEl: nextRefs.current[category._id].current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl =
                    prevRefs.current[category._id].current;
                  swiper.params.navigation.nextEl =
                    nextRefs.current[category._id].current;
                }}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024:{slidesPerView:4}
                }}
              >
                {category.dishes.map((dish) => (
                  <SwiperSlide key={dish._id}>
                    <RestoDishCard
                      dish={dish}
                      onDelete={() => handleDeleteDish(dish._id, category._id)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RestoDetails;
