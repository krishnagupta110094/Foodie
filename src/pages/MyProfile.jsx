import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiEditBoxLine } from "react-icons/ri";

export default function MyProfile() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "Add Date of Birth";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:mx-15">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#195A00]/40 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#195A00] mb-2 sm:mb-0">
          My Profile
        </h1>
        <button
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-[#195A00] hover:bg-[#217000] transition-all"
        >
          <RiEditBoxLine className="text-lg" />
          Edit Profile
        </button>
      </div>

      {/* Profile Summary */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-4 sm:p-6 border rounded-xl border-[#195A00]/40 shadow-sm mb-6">
        <img
          src={user?.image}
          alt={`${user?.firstName} ${user?.lastName}`}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#195A00]"
        />
        <div className="flex flex-col items-center sm:items-start space-y-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a]">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-[#555] truncate">{user?.email}</p>
          <span className="text-xs px-3 py-1 mt-2 rounded-full border border-[#195A00] text-[#195A00] font-medium">
            {user?.accountType?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* About Section */}
      <div className="p-4 sm:p-6 border rounded-xl border-[#195A00]/40 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg sm:text-xl font-medium text-[#1a1a1a]">About</h3>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="text-sm text-[#195A00] hover:text-[#0f4500] transition-colors"
          >
            Edit
          </button>
        </div>
        <p className="text-sm sm:text-base text-[#333]">
          {user?.additionDetails?.bio ?? "Write something about yourself..."}
        </p>
      </div>

      {/* Personal Details */}
      <div className="p-4 sm:p-6 border rounded-xl border-[#195A00]/40 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg sm:text-xl font-medium text-[#1a1a1a]">Personal Details</h3>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="text-sm text-[#195A00] hover:text-[#0f4500] transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
          <div>
            <p className="text-gray-500">First Name</p>
            <p className="text-[#1a1a1a]">{user?.firstName ?? "—"}</p>
          </div>
          <div>
            <p className="text-gray-500">Last Name</p>
            <p className="text-[#1a1a1a]">{user?.lastName ?? "—"}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="text-[#1a1a1a]">{user?.email ?? "—"}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="text-[#1a1a1a]">
              {user?.additionDetails?.contactNumber ?? "Add Contact Number"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Gender</p>
            <p className="text-[#1a1a1a]">{user?.additionDetails?.gender ?? "Add Gender"}</p>
          </div>
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="text-[#1a1a1a]">{formatDate(user?.additionDetails?.dateOfBirth)}</p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="p-4 sm:p-6 border rounded-xl border-[#195A00]/40 mb-6">
        <h3 className="text-lg sm:text-xl font-medium text-[#1a1a1a] mb-2">Account Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
          <div>
            <p className="text-gray-500">Account Status</p>
            <p className={`font-medium ${user?.status === "active" ? "text-green-600" : "text-yellow-600"}`}>
              {user?.status ?? "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Member Since</p>
            <p className="text-[#1a1a1a]">{formatDate(user?.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
