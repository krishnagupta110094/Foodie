// import React, { useState } from "react";
// import { NavLink, useNavigate, useLocation } from "react-router-dom";
// import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
// import { HomeImages } from "../../data/Images";
// import { useDispatch, useSelector } from "react-redux";
// import { IoArrowBackCircle } from "react-icons/io5";
// import { logout } from "../../services/operations/authAPI";
// import ConfirmationModal from "./ConfirmationModal";

// const Navbar = () => {
//   const { user, token } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const location = useLocation(); // 👈 to check current path
//   const [profileOpen, setProfileOpen] = useState(false);
//   const dispatch = useDispatch();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { totalItems } = useSelector((state) => state.cart);

//   const modalData = {
//     heading: "Logout",
//     paragraph: "Are you sure you want to logout?",
//     btn1Name: "Cancel",
//     btn2Name: "Logout",
//   };

//   const navLinkClass = ({ isActive }) =>
//     `hover:text-yellow-300 transition ${
//       isActive ? "underline underline-offset-4 font-semibold" : ""
//     }`;

//   const handleLogout = () => {
//     return dispatch(logout());
//   };

//   return (
//     <nav className="bg-[#195A00] text-white shadow-md relative">
//       <div className="ml-30 mr-20 py-4 flex items-center justify-between relative">
//         {/* Back Button - show only if not home */}
//         {location.pathname !== "/" && (
//           <button
//             onClick={() => navigate(-1)}
//             className="absolute -left-24 top-1 text-white font-bold text-5xl  p-2  transition "
//           >
//             <IoArrowBackCircle />
//           </button>
//         )}

//         {/* Left - Logo */}
//         <NavLink to="/" className="text-2xl font-bold flex items-center gap-2">
//           <img src={HomeImages.logo} alt="Logo" className="h-7" />
//         </NavLink>

//         {/* Center - Nav Links */}
//         <div className="hidden md:flex gap-8 text-lg font-medium">
//           <NavLink to="/" className={navLinkClass}>
//             Home
//           </NavLink>
//           <NavLink to="/menu" className={navLinkClass}>
//             Menu
//           </NavLink>
//           <NavLink to="/restaurant" className={navLinkClass}>
//             Restaurants
//           </NavLink>
//           <NavLink to="/about" className={navLinkClass}>
//             About
//           </NavLink>
//           <NavLink to="/contact" className={navLinkClass}>
//             Contact Us
//           </NavLink>
//         </div>

//         {/* Right - Cart / Auth */}
//         <div className="flex items-center gap-6">
//           {user?.accountType == "customer" && (
//             <NavLink
//               to="/dashboard/cart"
//               className="relative hover:text-yellow-300 text-lg flex items-center gap-2"
//             >
//               {/* Icon Wrapper */}
//               <div className="relative">
//                 <FaShoppingCart className="text-2xl" />

//                 {/* ✅ Badge directly above icon */}
//                 {totalItems > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
//                     {totalItems}
//                   </span>
//                 )}
//               </div>

//               <span>Cart</span>
//             </NavLink>
//           )}

//           {!token ? (
//             <>
//               <NavLink
//                 to="/login"
//                 className="bg-white text-[#195A00] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
//               >
//                 Login
//               </NavLink>
//               <NavLink
//                 to="/signup"
//                 className="bg-yellow-400 text-[#195A00] px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition"
//               >
//                 Signup
//               </NavLink>
//             </>
//           ) : (
//             <div
//               className="relative"
//               onMouseEnter={() => setProfileOpen(true)}
//               onMouseLeave={() => setProfileOpen(false)}
//             >
//               <button className="flex items-center gap-2 bg-white text-[#195A00] px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition">
//                 <FaUserCircle className="text-xl" />
//                 Profile
//               </button>

//               {/* Dropdown */}
//               {profileOpen && (
//                 <div className="absolute right-0 mt-2 w-40 flex flex-col z-50">
//                   {/* Arrow */}
//                   <div className="absolute -top-2 right-10 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>

//                   {/* Content with rounded corners */}
//                   <div className="bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
//                     <button
//                       className="px-4 py-2 text-left text-[#195A00] hover:bg-gray-100 transition"
//                       onClick={() => navigate("/dashboard/my-profile")}
//                     >
//                       Dashboard
//                     </button>
//                     <button
//                       className="px-4 py-2 text-left text-[#195A00] hover:bg-gray-100 transition"
//                       onClick={() => setIsModalOpen(true)}
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//       <ConfirmationModal
//         isOpen={isModalOpen}
//         modalData={modalData}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={handleLogout}
//       />
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { HomeImages } from "../../data/Images";
import { useDispatch, useSelector } from "react-redux";
import { IoArrowBackCircle } from "react-icons/io5";
import { logout } from "../../services/operations/authAPI";
import ConfirmationModal from "./ConfirmationModal";

const Navbar = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [profileOpen, setProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const modalData = {
    heading: "Logout",
    paragraph: "Are you sure you want to logout?",
    btn1Name: "Cancel",
    btn2Name: "Logout",
  };

  const navLinkClass = ({ isActive }) =>
    `hover:text-yellow-300 transition ${
      isActive ? "underline underline-offset-4 font-semibold" : ""
    }`;

  const handleLogout = () => dispatch(logout());

  return (
    <nav className="bg-[#195A00] text-white shadow-md relative">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-20 py-4 relative">
        {/* Back Button */}
        {location.pathname !== "/" && (
          <button
            onClick={() => navigate(-1)}
            className="hidden md:block absolute left-4 top-2 text-white text-3xl sm:text-4xl p-1 sm:p-2"
          >
            <IoArrowBackCircle />
          </button>
        )}

        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold flex items-center gap-2">
          <img src={HomeImages.logo} alt="Logo" className="h-7" />
        </NavLink>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex gap-8 text-lg font-medium">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/menu" className={navLinkClass}>Menu</NavLink>
          <NavLink to="/restaurant" className={navLinkClass}>Restaurants</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact-us" className={navLinkClass}>Contact Us</NavLink>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {user?.accountType === "customer" && (
            <NavLink
              to="/dashboard/cart"
              className="relative hover:text-yellow-300 text-lg flex items-center gap-1"
            >
              <FaShoppingCart className="text-2xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </NavLink>
          )}

          {!token ? (
            <>
              <NavLink
                to="/login"
                className="bg-white text-[#195A00] px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-medium hover:bg-gray-100 transition text-sm sm:text-base"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-yellow-400 text-[#195A00] px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-medium hover:bg-yellow-500 transition text-sm sm:text-base"
              >
                Signup
              </NavLink>
            </>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button className="flex items-center gap-1 sm:gap-2 bg-white text-[#195A00] px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium hover:bg-gray-100 transition text-sm sm:text-base">
                <FaUserCircle className="text-xl" />
                Profile
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 flex flex-col z-50">
                  <div className="absolute -top-2 right-10 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                  <div className="bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
                    <button
                      className="px-4 py-2 text-left text-[#195A00] hover:bg-gray-100 transition"
                      onClick={() => navigate("/dashboard/my-profile")}
                    >
                      Dashboard
                    </button>
                    <button
                      className="px-4 py-2 text-left text-[#195A00] hover:bg-gray-100 transition"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white text-2xl ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#195A00] px-4 pb-4 flex flex-col gap-3">
          <NavLink to="/" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/menu" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Menu</NavLink>
          <NavLink to="/restaurant" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Restaurants</NavLink>
          <NavLink to="/about" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Contact Us</NavLink>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        modalData={modalData}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default Navbar;

