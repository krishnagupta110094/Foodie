import React from 'react';

const RestoBanner = () => {
  return (
    <div className="bg-gradient-to-r from-white to-green-50 py-16 px-4 sm:px-6 md:px-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Side - Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug sm:leading-tight mb-6">
            Launch Your <span className="text-green-700">Food Brand</span> <br className="hidden md:block" />
            From Your Own Kitchen
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-full md:max-w-lg mx-auto md:mx-0">
            Start your online restaurant without renting a shop. Cook from home, sell online, and reach thousands of foodies in your city.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button className="bg-green-700 text-white px-6 py-3 rounded-md text-base sm:text-lg font-medium hover:bg-green-800 transition-all">
              🍽️ Create Your Resto
            </button>
            <button className="text-green-700 border border-green-700 px-6 py-3 rounded-md text-base sm:text-lg font-medium hover:bg-green-100 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="flex-1 mt-8 md:mt-0">
          <img 
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
            alt="Food Startup"
            className="w-full h-auto max-w-sm sm:max-w-md mx-auto md:mx-0 rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default RestoBanner;
