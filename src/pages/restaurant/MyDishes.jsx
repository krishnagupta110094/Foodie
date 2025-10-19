import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllRestaurant } from "../../services/operations/restaurantAPI";
import RestoDetails from "../../components/core/Dashboard/MyResto/RestoDetails";

const MyDishes = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRestaurant = async () => {
      try {
        // Fetch all restaurants
        const restaurants = await getAllRestaurant();

        // Find restaurant belonging to logged-in user
        const myRestaurant = restaurants.find(
          (resto) => resto.owner.email === user.email
        );

        if (myRestaurant) {
          setRestaurant(myRestaurant);
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.accountType === "restaurantOwner") fetchMyRestaurant();
  }, [user]);

  if (loading) return <p className="ml-15">Loading your restaurant...</p>;
  if (!restaurant) return <p className="ml-15">No restaurant found for this account.</p>;

  return <RestoDetails restoId={restaurant._id} />;
};

export default MyDishes;
