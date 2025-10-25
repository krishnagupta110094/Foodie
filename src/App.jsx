import React from "react";
import Home from "./pages/Home";
import { Route, Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Error from "./components/common/Error";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import CategoryDetail from "./components/core/Category/CategoryDetail";
import DishDetail from "./components/core/Dish/DishDetail";
import Menu from "./components/core/Menu/Menu";
import Restaurant from "./components/core/Restaurants/Restaurant";
import RestaurantDetail from "./components/core/Restaurants/RestaurantDetail";
import Login from "./components/core/Auth/Login";
import Signup from "./components/core/Auth/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Cart from "./pages/customer/Cart";
import Dashboard from "./components/core/Dashboard/Dashboard";
import MyProfile from "./pages/MyProfile";
import MyOrder from "./pages/customer/MyOrder";
import MySetting from "./pages/MySetting";
import RestoDashboard from "./pages/restaurant/RestoDashboard";
import MyDishes from "./pages/restaurant/MyDishes";
import AddNewDish from "./pages/restaurant/AddNewDish";
import OrderReceived from "./pages/restaurant/OrderReceived";
import RestoDetails from "./pages/restaurant/RestoDetails";
import EditDish from "./pages/restaurant/EditDish";
import EditRestaurant from "./pages/restaurant/EditRestaurant";
import OrderReceivedForDelivery from "./pages/delivery/OrderReceivedForDelivery";
import Earning from "./pages/delivery/Earning";
import VehicalInfo from "./pages/delivery/VehicalInfo";
import OrderHistory from "./pages/delivery/OrderHistory";
import CreateRestaurant from "./pages/restaurant/CreateRestaurant";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import CreateCategory from "./pages/admin/CreateCategory";
import ManageCategory from "./pages/admin/ManageCategory";
import EditCategory from "./pages/admin/EditCategory";
import ComingSoon from "./pages/admin/ComingSoon";

const App = () => {
  return (
    <div className="">
      <Navbar />
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<ContactUs />} />

        <Route
          path="/menu/category/:categoryName/dishes"
          element={<CategoryDetail />}
        />
        <Route
          path="menu/category/:categoryName/dishes/:dishId"
          element={<DishDetail />}
        />
        <Route path="/menu" element={<Menu />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route
          path="/restaurant/:restaurantId"
          element={<RestaurantDetail />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/verify-email" element={<VerifyEmail />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* CUSTOMER------------------------------------------------------ */}
          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/cart" element={<Cart />} />
          <Route path="/dashboard/my-orders" element={<MyOrder />} />
          <Route path="/dashboard/settings" element={<MySetting />} />

          {/* RESTAURANT---------------------------------------------------- */}
          <Route path="/dashboard/restaurant" element={<RestoDashboard />} />
          <Route path="/dashboard/create-restaurant" element={<CreateRestaurant />} />

          <Route path="/dashboard/my-dishes" element={<MyDishes />} />
          <Route path="/dashboard/add-dish" element={<AddNewDish />} />
          <Route path="/dashboard/edit-dish/:dishId" element={<EditDish />} />
          <Route
            path="/dashboard/edit-restaurant/:restaurantId"
            element={<EditRestaurant />}
          />

          <Route
            path="/dashboard/orders-received"
            element={<OrderReceived />}
          />
          <Route
            path="/dashboard/restaurant-details"
            element={<RestoDetails />}
          />
          {/* DELIVERY------------------------------------------------------ */}
          <Route
            path="/dashboard/orders"
            element={<OrderReceivedForDelivery />}
          />
          <Route path="/dashboard/history" element={<OrderHistory />} />
          <Route path="/dashboard/vehical-info" element={<VehicalInfo />} />
          <Route path="/dashboard/earnings" element={<Earning />} />

          {/* ADMIN--------------------------------------------------------- */}
          <Route path="/dashboard/admin/create-category" element={<CreateCategory/>} />
          <Route path="/dashboard/admin/manage-category" element={<ManageCategory/>} />
          <Route path="/dashboard/admin/edit-category/:categoryId" element={<EditCategory/>} />
          <Route path="/dashboard/admin/stats" element={<ComingSoon/>} />
          <Route path="/dashboard/admin/manage-restaurants" element={<ComingSoon/>} />
          <Route path="/dashboard/admin/manage-customers" element={<ComingSoon/>} />
          <Route path="/dashboard/admin/manage-delivery-boys" element={<ComingSoon/>} />
          <Route path="/dashboard/admin/manage-dishes" element={<ComingSoon/>} />

          
       
        </Route>

        {/* Error Page */}
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
