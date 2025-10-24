// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useSelector } from "react-redux";
// import { toast } from "react-hot-toast";
// import { apiConnector } from "../../services/apiConnector";
// import { dishEndpoints } from "../../services/apis";
// import { getAllCategory } from "../../services/operations/categoryAPI";
// import { useNavigate } from "react-router-dom";

// const { CREATE_DISH } = dishEndpoints;

// const AddNewDish = () => {
//   const { user, token } = useSelector((state) => state.auth);
//   const [categories, setCategories] = useState([]);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const watchImage = watch("image");

//   useEffect(() => {
//     if (watchImage && watchImage[0]) {
//       setPreview(URL.createObjectURL(watchImage[0]));
//     }
//   }, [watchImage]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const res = await getAllCategory();
//       setCategories(res || []);
//     };
//     fetchCategories();
//   }, []);

//   const onSubmit = async (data) => {
//     if (!user?.restaurant) {
//       toast.error("Restaurant ID missing. Please re-login.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("description", data.description);
//       formData.append("price", data.price);
//       formData.append("category", data.category);
//       formData.append("restaurant", user.restaurant);
//       if (data.image && data.image[0]) {
//         formData.append("image", data.image[0]);
//       }
//       const toastId = toast.loading("Adding New Dish...");
//       const response = await apiConnector("POST", CREATE_DISH, formData, {
//         Authorization: `Bearer ${token}`,
//       });

//       if (response?.data?.success) {
//         toast.dismiss(toastId);
//         toast.success("Dish added successfully!");
//         reset();
//         setPreview(null);
//         navigate("/dashboard/my-dishes");
//       } else {
//         toast.dismiss(toastId);
//         toast.error(response?.data?.message || "Failed to add dish ❌");
//       }
//     } catch (error) {
//       console.error("ADD_NEW_DISH ERROR:", error);
//       toast.error(error.message || "Something went wrong ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex gap-x-10  ">
//       {/* Left: Scrollable Form */}
//       <div className="flex-1 px-15  overflow-y-auto scrollbar-hide bg-white shadow-lg rounded-xl py-10 ">
//         <h2 className="text-2xl font-bold mb-6 text-green-700">Add New Dish</h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Dish Name */}
//           <div>
//             <label className="block font-medium mb-1">Dish Name *</label>
//             <input
//               type="text"
//               {...register("name", { required: "Dish name is required" })}
//               className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
//               placeholder="Enter dish name"
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block font-medium mb-1">Description</label>
//             <textarea
//               {...register("description")}
//               rows="3"
//               className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
//               placeholder="Write a short description"
//             />
//           </div>

//           {/* Price */}
//           <div>
//             <label className="block font-medium mb-1">Price (₹) *</label>
//             <input
//               type="number"
//               {...register("price", { required: "Price is required" })}
//               className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
//               placeholder="Enter price"
//             />
//             {errors.price && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.price.message}
//               </p>
//             )}
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block font-medium mb-1">Category *</label>
//             <select
//               {...register("category", { required: "Category is required" })}
//               className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
//             >
//               <option value="">Select category</option>
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat._id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//             {errors.category && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.category.message}
//               </p>
//             )}
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className="block font-medium mb-1">Dish Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               {...register("image")}
//               className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
//             />
//             {preview && (
//               <img
//                 src={preview}
//                 alt="preview"
//                 className="w-32 h-32 object-contain rounded-md mt-3 border border-gray-300"
//               />
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-green-700 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-800 transition-all"
//           >
//             {loading ? "Adding..." : "Add Dish"}
//           </button>
//         </form>
//       </div>

//       {/* Right: Fixed Instructions */}
//       <div className="w-80 mr-15 sticky top-10 h-[65vh] p-6 bg-white shadow-md rounded-xl">
//         <h3 className="text-xl font-semibold mb-4 text-green-700">
//           Instructions
//         </h3>
//         <ul className="list-disc list-inside space-y-2 text-gray-700">
//           <li>Fill in the dish name and description.</li>
//           <li>Set a price in ₹ (numeric values only).</li>
//           <li>Select a proper category for the dish.</li>
//           <li>Upload a high-quality image (optional).</li>
//           <li>Click "Add Dish" to submit.</li>
//           <li>Your restaurant ID is automatically attached.</li>
//           <li>After submission, you will be redirected to "My Dishes".</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default AddNewDish;

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../services/apiConnector";
import { dishEndpoints } from "../../services/apis";
import { getAllCategory } from "../../services/operations/categoryAPI";
import { useNavigate } from "react-router-dom";
import { getAllRestaurant } from "../../services/operations/restaurantAPI";

const { CREATE_DISH } = dishEndpoints;

const AddNewDish = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRestaurant = async () => {
      try {
        setLoading(true);
        // Fetch all restaurants
        const restaurants = await getAllRestaurant();

        // Find restaurant belonging to logged-in user
        const myRestaurant = restaurants.find(
          (resto) => resto?.owner?._id === user?._id
        );

        if (myRestaurant) {
          setRestaurant(myRestaurant);
        } else {
          setRestaurant(null);
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.accountType === "restaurantOwner") fetchMyRestaurant();
  }, [user]);

  

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const watchImage = watch("image");

  useEffect(() => {
    if (watchImage && watchImage[0]) {
      setPreview(URL.createObjectURL(watchImage[0]));
    }
  }, [watchImage]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategory();
      setCategories(res || []);
    };
    fetchCategories();
  }, []);



  const onSubmit = async (data) => {
    if (!user?.restaurant) {
      toast.error("Restaurant ID missing. Please re-login.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("restaurant", user.restaurant);
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }
      const toastId = toast.loading("Adding New Dish...");
      const response = await apiConnector("POST", CREATE_DISH, formData, {
        Authorization: `Bearer ${token}`,
      });

      if (response?.data?.success) {
        toast.dismiss(toastId);
        toast.success("Dish added successfully!");
        navigate("/dashboard/my-dishes");
        reset();
        setPreview(null);
      } else {
        toast.dismiss(toastId);
        toast.error(response?.data?.message || "Failed to add dish ❌");
      }
    } catch (error) {
      console.error("ADD_NEW_DISH ERROR:", error);
      toast.error(error.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading state
  if (loading) {
    return <p className="ml-15 mt-10">Loading your restaurant...</p>;
  }

  // ❌ No restaurant found
  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          🍽️ No Restaurant Found
        </h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          It looks like you haven’t created a restaurant yet. Start your journey
          by creating one now!
        </p>
        <button
          onClick={() => navigate("/dashboard/create-restaurant")}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg shadow-md transition-all"
        >
          + Create Your Restaurant
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row px-4 sm:px-6 lg:px-20 mt-6">
      {/* Left: Scrollable Form */}
      <div className="flex-1 overflow-y-auto scrollbar-hide bg-white rounded-xl py-6 lg:py-10 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-4xl font-bold mb-6 text-green-700">
          Add New Dish
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dish Name */}
          <div>
            <label className="block font-medium mb-1">Dish Name *</label>
            <input
              type="text"
              {...register("name", { required: "Dish name is required" })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
              placeholder="Enter dish name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              {...register("description")}
              rows="3"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
              placeholder="Write a short description"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium mb-1">Price (₹) *</label>
            <input
              type="number"
              {...register("price", { required: "Price is required" })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-1">Category *</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1">Dish Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 object-contain rounded-md mt-3 border border-gray-300"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-800 transition-all w-full sm:w-auto"
          >
            {loading ? "Adding..." : "Add Dish"}
          </button>
        </form>
      </div>

      {/* Right: Instructions */}
      <div className="w-full lg:w-80 lg:mr-0 lg:sticky lg:top-10 h-auto lg:h-[65vh] p-4 sm:p-6 bg-white shadow-md rounded-xl  lg:mt-0">
        <h3 className="text-xl font-semibold mb-4 text-green-700">
          Instructions
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Fill in the dish name and description.</li>
          <li>Set a price in ₹ (numeric values only).</li>
          <li>Select a proper category for the dish.</li>
          <li>Upload a high-quality image (optional).</li>
          <li>Click "Add Dish" to submit.</li>
          <li>Your restaurant ID is automatically attached.</li>
          <li>After submission, you will be redirected to "My Dishes".</li>
        </ul>
      </div>
    </div>
  );
};

export default AddNewDish;
