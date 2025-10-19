import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DishCard from "../../../components/common/DishCard"; // 👈 Import DishCard
import {
  getAllCategory,
  getDishByCategory,
} from "../../../services/operations/categoryAPI"; // 👈 Your existing API

const CategoryDetail = () => {
  const { categoryName } = useParams();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get category details (banner + description)
        const allCategories = await getAllCategory();
        const selected = allCategories.find(
          (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        // 2️⃣ Get dishes for this category
        const dishes = await getDishByCategory(categoryName);

        // 3️⃣ Prepare data
        setCategoryData({
          name: selected?.name || categoryName,
          banner:
            selected?.image ||
            "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200",
          description:
            selected?.description ||
            `Delicious ${categoryName} dishes made fresh for you.`,
          dishes: dishes || [],
          popular: dishes.slice(0, 4),
        });
      } catch (err) {
        console.error("Error fetching category details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  if (!categoryData)
    return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div>
      {/* Banner */}
      <div
        className="h-30 md:h-48 lg:h-64 bg-cover bg-no-repeat bg-center flex items-center justify-center text-white text-4xl font-bold"
        style={{ backgroundImage: `url(${categoryData?.banner})` }}
      >
        #{categoryData?.name?.toUpperCase()}
      </div>

      {/* Category Info */}
      <div className="text-center my-6">
        <h2 className="text-3xl font-semibold">{categoryData?.name}</h2>
        <p className="text-gray-600 mt-2">{categoryData?.description}</p>
      </div>

      {/* Popular Dishes */}
      <div className="px-10 my-10">
        <h3 className="text-2xl font-bold mb-4">
          Popular in {categoryData?.name}
        </h3>
        {categoryData?.popular?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryData?.popular?.map((dish) => (
              <DishCard key={dish._id || dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No popular dishes available.</p>
        )}
      </div>

      {/* All Dishes */}
      <div className="px-10">
        <h3 className="text-2xl font-bold mb-4">All Dishes</h3>
        {categoryData?.dishes?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryData?.dishes?.map((dish) => (
              <DishCard key={dish._id || dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No dishes available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
