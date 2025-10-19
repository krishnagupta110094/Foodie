import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { HomeImages } from "../../data/Images";

const Footer = () => {
  return (
    <footer className="bg-[#195A00] text-gray-100 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-10">
        {/* Logo + About */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            <img src={HomeImages.logo} alt="" className="h-7 " />
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-200">
            Foodie connects customers, restaurants, and delivery partners for a
            seamless food ordering experience. Order, cook, and deliver with
            ease.
          </p>
        </div>

        {/* Customer Links */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Customers</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/menu" className="hover:text-yellow-300">
                Browse Menu
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-yellow-300">
                My Cart
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-yellow-300">
                Track Orders
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-yellow-300">
                My Account
              </Link>
            </li>
            <li>
              <Link to="/offers" className="hover:text-yellow-300">
                Offers & Coupons
              </Link>
            </li>
          </ul>
        </div>

        {/* Restaurant Links */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Restaurants</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/restaurant/register" className="hover:text-yellow-300">
                Register Restaurant
              </Link>
            </li>
            <li>
              <Link
                to="/restaurant/dashboard"
                className="hover:text-yellow-300"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/restaurant/dishes" className="hover:text-yellow-300">
                Manage Dishes
              </Link>
            </li>
            <li>
              <Link to="/restaurant/orders" className="hover:text-yellow-300">
                Incoming Orders
              </Link>
            </li>
            <li>
              <Link to="/restaurant/earnings" className="hover:text-yellow-300">
                Earnings
              </Link>
            </li>
          </ul>
        </div>

        {/* Delivery Boy Links */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Delivery</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/delivery/login" className="hover:text-yellow-300">
                Delivery Boy Login
              </Link>
            </li>
            <li>
              <Link to="/delivery/orders" className="hover:text-yellow-300">
                Assigned Deliveries
              </Link>
            </li>
            <li>
              <Link to="/delivery/history" className="hover:text-yellow-300">
                Delivery History
              </Link>
            </li>
            <li>
              <Link to="/delivery/earnings" className="hover:text-yellow-300">
                Earnings
              </Link>
            </li>
          </ul>
        </div>

        {/* Admin Links */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Admin</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/admin/dashboard" className="hover:text-yellow-300">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="hover:text-yellow-300">
                Manage Users
              </Link>
            </li>
            <li>
              <Link to="/admin/restaurants" className="hover:text-yellow-300">
                Manage Restaurants
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="hover:text-yellow-300">
                All Orders
              </Link>
            </li>
            <li>
              <Link to="/admin/settings" className="hover:text-yellow-300">
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-green-800 mt-10 pt-5 text-center">
        {/* Extra Links */}
        <div className="flex mx-8 justify-center space-x-6 mb-4 text-sm">
          <Link to="/help" className="hover:text-yellow-300">
            Help
          </Link>
          <Link to="/privacy" className="hover:text-yellow-300">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-yellow-300">
            Terms & Conditions
          </Link>
          <Link to="/about" className="hover:text-yellow-300">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-yellow-300">
            Contact
          </Link>
        </div>

        {/* Social Media */}
        <div className="flex justify-center space-x-5 mb-3">
          <a href="#" className="hover:text-yellow-300 text-xl">
            <FaFacebook />
          </a>
          <a href="#" className="hover:text-yellow-300 text-xl">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-yellow-300 text-xl">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-yellow-300 text-xl">
            <FaLinkedin />
          </a>
        </div>
        <p className="text-sm text-gray-200">
          © {new Date().getFullYear()} Foodie. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
