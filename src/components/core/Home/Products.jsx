import React, { useEffect, useState } from "react";
import { getAllDishes } from "../../../services/operations/dishAPI";
import DishCard from "../../common/DishCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      try {
        const allDishes = await getAllDishes();

        // Sort dishes by rating descending and take top 8
        const topDishes = allDishes
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);

        setProducts(topDishes);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading dishes...</p>;
  }

  if (!products.length) {
    return <p className="text-center mt-10 text-lg">No dishes found.</p>;
  }

  return (
    <div className="mt-10 px-4 sm:px-6 md:px-20">
      {/* Title */}
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-[#195A00]">
        Most Popular Items
      </h2>

      {/* Products Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {products.map((product) => (
          <DishCard key={product._id || product.id} dish={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
