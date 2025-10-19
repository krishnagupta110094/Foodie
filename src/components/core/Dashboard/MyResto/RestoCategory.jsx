import React, { useEffect, useState, useRef } from "react";
import { getAllCategory } from "../../../../services/operations/categoryAPI";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// React-icons
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const RestoCategory = ({ categoriesData = null }) => {
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
          setCategories(categoriesData);
        } else {
          const data = await getAllCategory();
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
        <h2 className="text-3xl font-bold mb-8">Your Category</h2>
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="py-10 relative px-4 mx-6 sm:px-6 lg:px-20">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Category</h2>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center">No categories available ❌</p>
      ) : (
        <>
          {/* Custom buttons */}
          <button
            ref={prevRef}
            className="absolute -left-2 sm:-left-2 top-45 md:top-50 -translate-y-1/2 z-10 bg-green-600 text-white p-2 sm:p-3 rounded-full shadow-md hover:bg-green-700"
          >
            <FiChevronLeft size={20} className="sm:text-[24px]" />
          </button>

          <button
            ref={nextRef}
            className="absolute -right-2 sm:-right-2 top-45 md:top-50 -translate-y-1/2 z-10 bg-green-600 text-white p-2 sm:p-3 rounded-full shadow-md hover:bg-green-700"
          >
            <FiChevronRight size={20} className="sm:text-[24px]" />
          </button>

          <Swiper
            modules={[Navigation]}
            spaceBetween={12} // smaller gap on mobile
            slidesPerView={2} // default mobile
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
              320: { slidesPerView: 2, spaceBetween: 12 }, // mobile
              480: { slidesPerView: 3, spaceBetween: 14 }, // small tablets
              640: { slidesPerView: 4, spaceBetween: 16 }, // tablets
              1024: { slidesPerView: 6, spaceBetween: 20 }, // large screens
            }}
          >
            {categories.map((category) => (
              <SwiperSlide key={category._id}>
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-3xl shadow-lg p-4 sm:p-6 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex flex-col items-center text-center">
                  <div className="bg-white rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-3 sm:mb-4 overflow-hidden shadow-inner">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {category.dishes?.length || 0} items
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default RestoCategory;
