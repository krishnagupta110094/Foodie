// import React from "react";
// import GWButton from "../../common/GWButton";
// import { HomeImages } from "../../../data/Images";

// const HomeBanner = () => {
//   return (
//     <div className="flex flex-row items-center justify-between gap-12">
//       {/* Left Section */}
//       {/* Left Section */}
//       <div className="w-[45%] pl-30 pt-20 pr-10">
//         {/* Tagline */}
//         <p className="flex items-center gap-3 text-lg italic font-semibold text-[#195A00]">
//           Healthy & Tasty Food
//           <span className="bg-[#195A00] h-[2px] w-12 rounded-full block"></span>
//         </p>

//         {/* Title with star */}
//         <div className="relative flex items-center gap-3">
//           <p className="text-4xl md:text-5xl font-extrabold leading-snug text-gray-900">
//             Enjoy <span className="text-[#195A00]">Healthy Life</span> <br /> & Tasty Food.
//           </p>
//           <img
//             src={HomeImages.shiningStar}
//             alt="Shining Star"
//             className="absolute right-24 top-15 w-15 h-17 animate-pulse"
//           />
//         </div>

//         {/* Description */}
//         <p className="text-gray-600 text-sm">
//           Healthy living doesn't mean giving up on flavor. With the right balance of nutritious ingredients and delicious recipes, you can enjoy meals that support your well-being while satisfying your taste buds.
//         </p>

//         {/* CTA Buttons */}
//         <div className="flex flex-wrap gap-4 pt-4">
//           <GWButton text="Show More" bgColor="#195A00" />
//           <GWButton text="Place an Order" bgColor="#f5f5f5" />
//         </div>
//       </div>

//       {/* Right Section (Layered Images) */}
//       <div className="relative w-[55%] flex justify-center items-center">
//         {/* Background green blob/shape */}
//         <img
//           src={HomeImages.largeleaf}
//           alt="Large leaf"
//           className="absolute top-0 right-0 w-[95%] z-0"
//         />

//         {/* Upleaf */}
//         <img
//           src={HomeImages.upleaf}
//           alt="upleaf"
//           className="absolute top-[70px] left-0 w-[35%] z-10"
//         />

//         {/* Downleaf */}
//         <img
//           src={HomeImages.downleaf}
//           alt="downleaf"
//           className="absolute bottom-[-100px] left-[90px] w-[40%] z-10"
//         />

//         {/* Cabbage (side leaf) */}
//         <img
//           src={HomeImages.cabbage}
//           alt="cabbage"
//           className="absolute bottom-[26px] left-[20px] w-[35%] z-20"
//         />

//         {/* Main Salad Bowl */}
//         <img
//           src={HomeImages.main}
//           alt="Main Bowl"
//           className="relative w-[65%] top-8 z-30 drop-shadow-2xl"
//         />
//       </div>
//     </div>
//   );
// };

// export default HomeBanner;

import React from "react";
import GWButton from "../../common/GWButton";
import { HomeImages } from "../../../data/Images";
import { useNavigate } from "react-router-dom";

const HomeBanner = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 px-4 lg:px-0">
      {/* Left Section */}
      <div className="w-full lg:w-[45%] pt-10 lg:pt-20 pr-0 lg:pr-10 pl-0 lg:pl-30 text-center lg:text-left">
        {/* Tagline */}
        <p className="flex items-center justify-center lg:justify-start gap-3 text-lg italic font-semibold text-[#195A00] mb-2">
          Healthy & Tasty Food
          <span className="bg-[#195A00] h-[2px] w-12 rounded-full block"></span>
        </p>

        {/* Title with star */}
        <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-3">
          <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-snug text-gray-900">
            Enjoy <span className="text-[#195A00]">Healthy Life</span> <br /> &
            Tasty Food.
          </p>
          <img
            src={HomeImages.shiningStar}
            alt="Shining Star"
            className="hidden lg:block lg:absolute lg:right-24 lg:top-15 w-10 h-10 md:w-12 md:h-14 animate-pulse top-0 right-1/2 transform translate-x-1/2 lg:translate-x-0 lg:top-15"
          />
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mt-4">
          Healthy living doesn't mean giving up on flavor. With the right
          balance of nutritious ingredients and delicious recipes, you can enjoy
          meals that support your well-being while satisfying your taste buds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
          <div onClick={()=>navigate("/menu")}>
            <GWButton  text="Show More" bgColor="#195A00" />
          </div>
          <div onClick={()=>navigate("/dashboard/cart")}>
          <GWButton text="Place an Order" bgColor="#f5f5f5" />

          </div>
        </div>
      </div>

      {/* Right Section (Layered Images) */}
      <div className="hidden lg:block relative w-[55%] flex justify-center items-center">
        {/* Background green blob/shape */}
        <img
          src={HomeImages.largeleaf}
          alt="Large leaf"
          className="absolute top-0 right-0 w-[95%] z-0"
        />

        {/* Upleaf */}
        <img
          src={HomeImages.upleaf}
          alt="upleaf"
          className="absolute top-[70px] left-0 w-[35%] z-10"
        />

        {/* Downleaf */}
        <img
          src={HomeImages.downleaf}
          alt="downleaf"
          className="absolute bottom-[-100px] left-[90px] w-[40%] z-10"
        />

        {/* Cabbage (side leaf) */}
        <img
          src={HomeImages.cabbage}
          alt="cabbage"
          className="absolute bottom-[26px] left-[20px] w-[35%] z-20"
        />

        {/* Main Salad Bowl */}
        <img
          src={HomeImages.main}
          alt="Main Bowl"
          className="relative w-[65%] top-8 left-35 z-30 drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default HomeBanner;
