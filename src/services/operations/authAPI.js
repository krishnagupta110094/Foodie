import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../apis";
import { setLoading, setToken, setUser } from "../../slices/authSlice";
import { getUserCart } from "./cartAPI";

const { SENDOTP_API, SIGNUP_API, LOGIN_API,GET_USER_DETAILS_API } = authEndpoints;

export const sendOTP = async (email, navigate) => {
  const toastId = toast.loading("Sending OTP...");
  try {
    const response = await apiConnector("POST", SENDOTP_API, { email });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to send OTP");
    }

    toast.success("OTP sent successfully!");
    navigate("/signup/verify-email");
    return response.data;
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to send OTP");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export async function signUp(
  firstName,
  lastName,
  otp,
  email,
  password,
  confirmPassword,
  accountType,
  navigate
) {
  const toastId = toast.loading("Creating your account...");

  try {
    const response = await apiConnector("POST", SIGNUP_API, {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      otp,
      accountType,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Signup failed");
    }

    toast.success("Account created successfully! 🎉");
    navigate("/login"); // redirect to login page after success

    return response.data;
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    toast.error(error.response?.data?.message || "Signup failed. Try again.");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.token));

      dispatch(setUser(response.data.user));
      dispatch(getUserCart(response.data.token));

      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return async (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    toast.success("Logged Out");
    navigate("/");
  };
}




export function getUserDetails(token) {
  return async (dispatch) => {
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data.success) {
        const user = response.data.user;
        dispatch(setUser(user));
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      console.log("GET_USER_DETAILS_API ERROR:", error);
    }
  };
}

