// import React, { useState, useEffect } from "react";

// const About = ({ title = "Page", message }) => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
//         <div
//           className="w-16 h-16 border-4 rounded-full animate-spin"
//           style={{
//             borderTopColor: "#195a00",
//             borderRightColor: "transparent",
//             borderBottomColor: "#195a00",
//             borderLeftColor: "transparent",
//           }}
//         ></div>
//         <p className="text-lg font-medium text-gray-700">
//           Loading {title}...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
//       <h1 className="text-5xl font-extrabold mb-4" style={{ color: "#195a00" }}>
//         ⚡ {title} Coming Soon
//       </h1>
//       <p className="text-gray-600 max-w-md mb-8">
//         {message || "This section is under development. Stay tuned for updates!"}
//       </p>

//       {/* Animated placeholders */}
//       <div className="flex flex-col space-y-4 w-full max-w-md">
//         {[1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className="h-16 rounded-lg shadow-md animate-pulse"
//             style={{ backgroundColor: "#195a0033" }}
//           ></div>
//         ))}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex gap-4 mt-8">
//         <button
//           onClick={() => window.history.back()}
//           className="px-6 py-2 font-semibold rounded-lg shadow-md text-black bg-gray-200 hover:bg-gray-300 transition-all"
//         >
//           🔙 Go Back
//         </button>
//         <button
//           onClick={() => window.location.href = "/"}
//           className="px-6 py-2 font-semibold rounded-lg shadow-md text-white"
//           style={{ backgroundColor: "#195a00" }}
//         >
//           🏠 Home
//         </button>
//       </div>
//     </div>
//   );
// };

// export default About;
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const reviews = [
    {
      name: "Anjali Sharma",
      text: "The quality of ingredients is unmatched. Finally, a place that cares about my health!",
      stars: 5,
    },
    {
      name: "Rohit Verma",
      text: "Fast delivery and the food arrives steaming hot. Best in the city!",
      stars: 5,
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8fafc] min-h-screen overflow-hidden font-sans">
      {/* 1. ANIMATED HERO SECTION */}
      <section className="relative pt-20 pb-32 px-6">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="container mx-auto text-center relative z-10"
        >
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
            Our Philosophy
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mt-6 mb-8 leading-tight">
            We Cook with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">
              Soul & Science.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg md:text-xl">
            Foodie isn't just a delivery app; it's a movement to make "Healthy"
            the most delicious word in your vocabulary.
          </p>
        </motion.div>

        {/* Floating Decorative Elements */}
        <motion.img
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          src="https://pngimg.com/d/spinach_PNG10.png"
          className="absolute top-20 left-10 w-32 opacity-20 hidden lg:block"
          alt=""
        />
      </section>

      {/* 2. THE BENTO GRID (The Unique Part) */}
      <section className="container mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Image Block */}
          <motion.div
            whileHover={{ scale: 0.98 }}
            className="md:col-span-8 h-[600px] rounded-3xl bg-cover bg-center shadow-2xl relative overflow-hidden"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h3 className="text-white text-3xl font-bold">
                Crafted by 50+ Award Winning Chefs
              </h3>
            </div>
          </motion.div>

          {/* Stat Block */}
          <div className="md:col-span-4 bg-green-700 rounded-3xl p-8 flex flex-col justify-center text-white shadow-xl">
            <h2 className="text-5xl font-black mb-2">98%</h2>
            <p className="text-green-100 text-lg">
              Customer satisfaction rate across 12 cities.
            </p>
          </div>

          {/* Text/Mission Block */}
          <div className="md:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">
              Pure Ingredients
            </h4>
            <p className="text-gray-500 mb-6">
              No preservatives, no hidden sugars. Just farm-to-table goodness
              delivered in eco-friendly packaging.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">
                  ✔
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  Zero Artificial Additives
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">
                  ✔
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  Sustainably Sourced Seafood
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">
                  ✔
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  Locally Grown Vegetables
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">
                  ✔
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  Hand-picked Spices & Herbs
                </span>
              </li>
            </ul>
          </div>

          {/* Secondary Image Block */}
          <div className="md:col-span-8 h-[500px] rounded-3xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000"
              className="w-full h-full object-cover"
              alt="Kitchen"
            />
          </div>
        </div>
      </section>

      {/* 3. REVIEWS SLIDER (Simplified for React) */}
      <section className="py-24 bg-white mt-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Loved by Thousands
          </h2>

          <div className="flex flex-wrap justify-center gap-8">
            {reviews.map((rev, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="max-w-md bg-gray-50 p-8 rounded-[2rem] border-b-4 border-green-600 shadow-sm"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(rev.stars)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 text-lg">
                  "{rev.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center font-bold text-green-800">
                    {rev.name[0]}
                  </div>
                  <p className="font-bold text-gray-900">{rev.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-yellow-400 rounded-[3rem] py-16 px-8 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
                Ready to eat better?
              </h2>
              <button
                onClick={() => navigate("/dashboard/cart")}
                className="bg-gray-900 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-black transition-transform active:scale-95 shadow-xl"
              >
                Place an Order Now
              </button>
            </div>
            {/* Background Circle Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full -mr-20 -mt-20"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
