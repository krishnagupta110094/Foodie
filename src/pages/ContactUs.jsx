import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { apiConnector } from "../services/apiConnector"; // Adjust path as per your folder structure
import { contactUsEndpoint } from "../services/apis"; // Adjust path or use direct URL string

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  // Handle Input Changes
  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Form Submission
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Sending your message...");
    setLoading(true);

    try {
      // replace "/contact-us" with your actual endpoint variable if needed
      const response = await apiConnector("POST",contactUsEndpoint, formData);

      if (response.data.success) {
        toast.success("Message sent successfully! We'll get back to you.");
        // Reset Form
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("CONTACT_API_ERROR:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      {/* 1. HERO SECTION */}
      <section className="pt-20 pb-16 px-6 text-center">
        <motion.div initial="initial" animate="animate" variants={fadeIn}>
          <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mt-6 mb-4">
            Let’s Start a <br />
            <span className="text-green-700 underline decoration-yellow-400">
              Conversation.
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Got a question about our menu, delivery, or want to launch your own
            brand? We're just a message away.
          </p>
        </motion.div>
      </section>

      {/* 2. CONTACT BENTO GRID */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Contact Form Block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Send us a Message
            </h3>

            <form
              onSubmit={handleOnSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleOnChange}
                  placeholder="Krishna Gupta"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleOnChange}
                  placeholder="hello@example.com"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Your Message
                </label>
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleOnChange}
                  rows="4"
                  placeholder="How can we help you today?"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <motion.button
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                type="submit"
                className={`md:col-span-2 bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-colors ${
                  loading
                    ? "bg-green-500 cursor-not-allowed"
                    : "hover:bg-green-800"
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* Quick Info Sidebar */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-700 p-8 rounded-[2.5rem] text-white"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6 text-2xl">
                💬
              </div>
              <h4 className="text-2xl font-bold mb-2">Live Support</h4>
              <p className="text-green-100 mb-6">
                Average response time:{" "}
                <span className="font-bold text-white">3 mins</span>
              </p>
              <button className="w-full py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-yellow-400 hover:text-gray-900 transition-colors">
                Chat Now
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex-grow"
            >
              <h4 className="text-xl font-bold text-gray-900 mb-6">
                Join the Community
              </h4>
              <div className="flex flex-col gap-4">
                <a
                  href="#"
                  className="flex items-center gap-4 text-gray-600 hover:text-green-700 font-medium group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-green-50 transition-colors">
                    📸
                  </div>
                  Instagram
                </a>
                <a
                  href="#"
                  className="flex items-center gap-4 text-gray-600 hover:text-green-700 font-medium group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-green-50 transition-colors">
                    🐦
                  </div>
                  Twitter (X)
                </a>
                <a
                  href="#"
                  className="flex items-center gap-4 text-gray-600 hover:text-green-700 font-medium group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-green-50 transition-colors">
                    💼
                  </div>
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </div>

          {/* Bottom Map Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-12 h-80 rounded-[2.5rem] overflow-hidden relative shadow-inner"
          >
            <div className="absolute inset-0 bg-green-200 flex items-center justify-center bg-cover bg-center">
              <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-ping"></div>
                <p className="font-bold text-gray-800">
                  Visit our HQ: Karol Bagh, New Delhi
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
