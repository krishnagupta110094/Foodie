export const sidebarLinks = [
  // ----------------- COMMON (visible to everyone) -----------------
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  

  // ----------------- CUSTOMER -----------------
  {
    id: 3,
    name: "Browse Dishes",
    path: "/menu",
    type: "customer",
    icon: "VscCompass",
  },
  {
    id: 4,
    name: "Your Cart",
    path: "/dashboard/cart",
    type: "customer",
    icon: "VscHistory",
  },
  {
    id: 5,
    name: "My Orders",
    path: "/dashboard/my-orders",
    type: "customer",
    icon: "VscChecklist",
  },
  

  // ----------------- RESTAURANT OWNER -----------------
  {
    id: 7,
    name: "Dashboard",
    path: "/dashboard/restaurant",
    type: "restaurantOwner",
    icon: "VscDashboard",
  },
  {
    id: 8,
    name: "My Dishes",
    path: "/dashboard/my-dishes",
    type: "restaurantOwner",
    icon: "VscVm",
  },
  {
    id: 9,
    name: "Add New Dish",
    path: "/dashboard/add-dish",
    type: "restaurantOwner",
    icon: "VscAdd",
  },
  
  {
    id: 10,
    name: "Orders Received",
    path: "/dashboard/orders-received",
    type: "restaurantOwner",
    icon: "VscInbox",
  },
  {
    id: 11,
    name: "Restaurant Details",
    path: "/dashboard/restaurant-details",
    type: "restaurantOwner",
    icon: "VscHome",
  },

  // ----------------- DELIVERY BOY -----------------
  {
    id: 12,
    name: "Orders Received",
    path: "/dashboard/orders",
    type: "deliveryBoy",
    icon: "VscRocket",
  },
  {
    id: 13,
    name: "History",
    path: "/dashboard/history",
    type: "deliveryBoy",
    icon: "VscHistory",
  },
  
  {
    id: 14,
    name: "Earnings",
    path: "/dashboard/earnings",
    type: "deliveryBoy",
    icon: "VscGraph",
  },
  

  // ----------------- ADMIN -----------------
  {
    id: 16,
    name: "Admin Stats",
    path: "/dashboard/admin-stats",
    type: "admin",
    icon: "RiAdminLine",
  },
  {
    id: 17,
    name: "Manage Restaurants",
    path: "/dashboard/manage-restaurants",
    type: "admin",
    icon: "FaUtensils",
  },
  {
    id: 18,
    name: "Manage Customers",
    path: "/dashboard/manage-customers",
    type: "admin",
    icon: "FaUserGraduate",
  },
  {
    id: 19,
    name: "Manage Delivery Boys",
    path: "/dashboard/manage-delivery-boys",
    type: "admin",
    icon: "FaBiking",
  },
  {
    id: 20,
    name: "Manage Dishes",
    path: "/dashboard/manage-dishes",
    type: "admin",
    icon: "FaBookOpen",
  },
  {
    id: 21,
    name: "Create Category",
    path: "/dashboard/create-category",
    type: "admin",
    icon: "VscAdd",
  },
  {
    id: 2,
    name: "Settings",
    path: "/dashboard/settings",
    icon: "VscSettingsGear",
  },

  // ----------------- LOGOUT -----------------
  
];
