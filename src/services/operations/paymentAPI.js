import { apiConnector } from "../apiConnector";
import { paymentEndpoints } from "../apis";
const {CREATE_PAYMENT_ORDER,VERIFY_PAYMENT} = paymentEndpoints;
export const createRazorpayOrderAPI = async (token, amount) => {
  try {
    const response = await apiConnector(
      "POST",
        CREATE_PAYMENT_ORDER,
      { amount },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response?.data;
  } catch (err) {
    console.error("Create Razorpay Order Error:", err);
    return null;
  }
};

export const verifyPaymentAPI = async (token, data) => {
  try {
    const response = await apiConnector(
      "POST",
      VERIFY_PAYMENT,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response?.data;
  } catch (err) {
    console.error("Verify Payment Error:", err);
    return { success: false };
  }
};
