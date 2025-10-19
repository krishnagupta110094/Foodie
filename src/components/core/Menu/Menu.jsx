import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import DishCard from "../../common/DishCard";
import { getAllCategory } from "../../../services/operations/categoryAPI";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Category from "../Home/Category";
import { HomeImages } from "../../../data/Images";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getAllCategory();
        setCategories(data || []);
        // console.log(data,"menuuu");
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-xl font-semibold">
        Loading Menu...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="w-full h-30 md:h-48 lg:h-60 relative">
        {/* Background Image */}
        <img
          src={HomeImages.menu}
          alt="Menu Banner"
          className="w-full h-full  object-cover"
        />

        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold drop-shadow-lg">
            #Our Menu
          </h1>
        </div>
      </div>

      <div>
        <Category />
      </div>

      {/* Dishes for each category */}
      <div className="mx-10 lg:ml-30 lg:mr-20 lg:mt-8">
        {categories.map((cat) => {
          if (!cat.dishes || cat.dishes.length === 0) return null;

          return (
            <div key={cat._id || cat.id} className="mb-10 relative">
              <h3 className="text-2xl font-semibold mb-4">{cat.name}</h3>

              {/* Custom Arrows */}
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
                spaceBetween={20}
                slidesPerView={4}
                loop={true}
                modules={[Navigation]}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 10 },
                  640: { slidesPerView: 2, spaceBetween: 15 },
                  1024: { slidesPerView: 4, spaceBetween: 20 },
                }}
              >
                {cat.dishes.map((dish) => (
                  <SwiperSlide key={dish._id || dish.id}>
                    <DishCard dish={dish} />
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

export default Menu;
