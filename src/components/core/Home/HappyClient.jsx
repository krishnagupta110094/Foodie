import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { HomeImages } from "../../../data/Images";

const testimonials = [
  {
    name: "Willians Jhone",
    title: "CEO & Co-Founder",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet nisl tincidunt adipiscing dictumst blandit hac. Lectus cras velit sed dignissim ac, aliquet.",
  },
  {
    name: "Sarah Parker",
    title: "Marketing Head",
    image:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
    text:
      "Dolor sit amet, consectetur adipiscing elit. Egestas habitant feugiat neque ultrices nunc, dolor egestas mus.",
  },
  {
    name: "Michael Chen",
    title: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
    text: "Aliquet. Metus egestas habitant feugiat neque ultrices nunc, dolor egestas mus.",
  },
];

const HappyClient = () => {
  return (
    <div className="w-full mt-10 bg-white mb-10 px-4 sm:px-6">
      <h2 className="text-center text-green-600 text-sm font-semibold uppercase tracking-wide">
        Testimonials
      </h2>
      <h1 className="text-center text-3xl sm:text-4xl md:text-4xl font-bold text-gray-800 mb-10 sm:mb-14">
        What Our Happy Clients Say
      </h1>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
        {/* Left: Swiper Testimonial Card */}
        <div className="w-full lg:w-1/2">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="testimonial-swiper"
          >
            {testimonials.map((test, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-gray-50 h-auto sm:h-[320px] shadow-xl rounded-2xl p-6 sm:p-8 text-center">
                  <div className="flex flex-col items-center mb-4 sm:mb-5">
                    <img
                      src={test.image}
                      alt={test.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-2 sm:mb-3 object-cover border-4 border-green-100 shadow-md"
                    />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {test.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">{test.title}</p>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 italic leading-relaxed">
                    “{test.text}”
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right: Static Image */}
        <div className="hidden lg:block w-full lg:w-1/2 mt-6 lg:mt-0">
          <img
            src={HomeImages.HappyClient}
            alt="Happy Client"
            className="rounded-2xl object-cover w-full max-h-[350px] sm:max-h-[400px] lg:max-h-[450px] mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default HappyClient;
