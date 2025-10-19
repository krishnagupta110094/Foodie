import React, { useEffect, useState, useRef } from "react";
import { getAllCategory } from "../../../services/operations/categoryAPI";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// React-icons
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Category = ({ categoriesData = null }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        if (categoriesData) {
          // Use categories passed as prop
          setCategories(categoriesData);
          console.log("Used prop data:", categoriesData);
        } else {
          // Fetch from API
          const data = await getAllCategory();
          console.log("Fetched data:", data);
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categoriesData]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="py-10 mx-10 lg:ml-30 lg:mr-20 relative">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Popular Categories
      </h2>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center">No categories available ❌</p>
      ) : (
        <>
          {/* Custom buttons */}
          <button
            ref={prevRef}
            className="absolute -left-6 top-52 -translate-y-1/2 z-10 bg-green-600 text-white p-3 rounded-full shadow-md hover:bg-green-700"
          >
            <FiChevronLeft size={24} />
          </button>

          <button
            ref={nextRef}
            className="absolute -right-6 top-52 -translate-y-1/2 z-10 bg-green-600 text-white p-3 rounded-full shadow-md hover:bg-green-700"
          >
            <FiChevronRight size={24} />
          </button>

          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={6}
            loop={true}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 4 },
              1024: { slidesPerView: 7 },
            }}
          >
            {categories.map((category) => (
              <SwiperSlide key={category._id}>
                <div
                  onClick={() =>
                    navigate(`/menu/category/${category.name}/dishes`)
                  }
                  className="bg-gradient-to-br from-green-100 to-green-200 rounded-3xl shadow-lg p-6 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
                >
                  {/* Image fully fills white circle */}
                  <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mb-4 overflow-hidden shadow-inner">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {category.name}
                  </h3>

                  {/* Number of items */}
                  <p className="text-sm text-gray-600">
                    {category.dishes?.length || 0} items
                  </p>

                  {/* Optional: subtle underline or indicator */}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default Category;
