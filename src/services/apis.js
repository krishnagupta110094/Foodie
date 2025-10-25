const BASE_URL = "https://foodieserver-n2f9.onrender.com/api/v1";
// const BASE_URL = "http://localhost:4000/api/v1";

// ================= AUTH ENDPOINTS =================
export const authEndpoints = {
  SENDOTP_API: `${BASE_URL}/auth/send-otp`,
  SIGNUP_API: `${BASE_URL}/auth/signup`,
  LOGIN_API: `${BASE_URL}/auth/login`,
  CHANGEPASSWORD_API: `${BASE_URL}/auth/change-password`,
  RESETPASSTOKEN_API: `${BASE_URL}/auth/reset-password-token`,
  RESETPASSWORD_API: `${BASE_URL}/auth/reset-password`,
  GET_USER_DETAILS_API: `${BASE_URL}/auth/get-user-details`,
  EDIT_PROFILE_API: `${BASE_URL}/auth/edit-profile`,
};

// ================= CATEGORY ENDPOINTS =================
export const categoryEndpoints = {
  CREATE_CATEGORY_API: `${BASE_URL}/admin/categories/createCategory`,
  UPDATE_CATEGORY_API: (categoryId) =>
    `${BASE_URL}/admin/categories/${categoryId}/updateCategory`,
  DELETE_CATEGORY_API: (categoryId) =>
    `${BASE_URL}/admin/categories/${categoryId}/deleteCategory`,
  GET_CATEGORY_API: `${BASE_URL}/categories`,
  GET_SINGLE_CATEGORY_API: (categoryId) =>
    `${BASE_URL}/categories/${categoryId}`,
};

// ================= CART ENDPOINTS =================
export const cartEndpoints = {
  GET_USER_CART: `${BASE_URL}/cart`,
  ADD_TO_CART: `${BASE_URL}/cart/addToCart`,
  REMOVE_FROM_CART: (dishId) => `${BASE_URL}/cart/${dishId}/removeFromCart`,
  RESET_CART: `${BASE_URL}/cart/reset`,
};

// ================= DISH ENDPOINTS =================
export const dishEndpoints = {
  CREATE_DISH: `${BASE_URL}/restaurants/dishes/createDish`,
  UPDATE_DISH: (dishId) =>
    `${BASE_URL}/restaurants/dishes/${dishId}/updateDish`,
  DELETE_DISH: (dishId) =>
    `${BASE_URL}/restaurants/dishes/${dishId}/deleteDish`,
  GET_ALL_DISHES: `${BASE_URL}/dishes`,
  GET_DISH_BY_DISHID: (dishId) => `${BASE_URL}/dishes/${dishId}`,
  GET_DISH_BY_CATEGORY: (categoryName) =>
    `${BASE_URL}/categories/${categoryName}/dishes`,
  GET_DISH_BY_CATEGORYID: (categoryId) =>
    `${BASE_URL}/categories/${categoryId}/dishes`,
  GET_DISH_BY_RESTAURANTID: (restaurantId) =>
    `${BASE_URL}/restaurants/${restaurantId}/dishes`,
};

// ================= RESTAURANT ENDPOINTS =================
export const restaurantEndpoints = {
  CREATE_RESTAURANT: `${BASE_URL}/restaurants/createRestaurant`,
  UPDATE_RESTAURANT: (restaurantId) =>
    `${BASE_URL}/restaurants/${restaurantId}/updateRestaurant`,
  DELETE_RESTAURANT: (restaurantId) =>
    `${BASE_URL}/restaurants/${restaurantId}/deleteRestaurant`,
  GET_ALL_RESTAURANT: `${BASE_URL}/restaurants`,
  GET_RESTAURANT_BY_RESTAURANTID: (restaurantId) =>
    `${BASE_URL}/restaurant/${restaurantId}`,
  GET_SIGNLE_RESTAURANT_DETAILS: (restaurantId) =>
    `${BASE_URL}/restaurants/${restaurantId}`,
};

//=========================ORDER ENDPOINTS==========================
export const orderEndpoints = {
  PLACE_ORDER: `${BASE_URL}/place-order`,
  UPDATE_STATUS: (orderId) => `${BASE_URL}/update-status/${orderId}`,
  GET_CUSTOMER_ORDERS: `${BASE_URL}/get-customer-orders`,
  GET_RESTAURANT_ORDERS: `${BASE_URL}/get-restaurant-orders`,
  GET_DELIVERY_ORDERS: `${BASE_URL}/get-delivery-orders`,
  ACCEPT_ORDER: `${BASE_URL}/accept-order`,
  COMPLETE_ORDER: `${BASE_URL}/complete-order`,
  GET_COMPLETED_DELIVERY_ORDERS: `${BASE_URL}/completed-delivery-orders`,
  GET_COMPLETED_RESTAURANT_ORDERS: `${BASE_URL}/completed-restaurant-orders`,
};

export const paymentEndpoints = {
  CREATE_PAYMENT_ORDER: `${BASE_URL}/create-order`,
  VERIFY_PAYMENT: `${BASE_URL}/verify-payment`,
};
