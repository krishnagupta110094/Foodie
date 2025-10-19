import React from 'react';

const WhyChooseUS = () => {
  const services = [
    {
      title: 'Quality Food',
      description:
        'We use only the freshest ingredients and expert cooking techniques to deliver food that delights your taste buds every time.',
      image: 'https://res.cloudinary.com/daa5tuoh3/image/upload/v1759379233/FOODIECLOUD/t3mngw4fkfbch2xqjvpm.png',
    },
    {
      title: 'Healthy Food',
      description:
        'Our meals are thoughtfully prepared to offer the perfect balance of taste and nutrition, supporting a healthy lifestyle.',
      image: 'https://res.cloudinary.com/daa5tuoh3/image/upload/v1759539973/FOODIECLOUD/zxi1pw0brc3wnrd1jigl.jpg',
    },
    {
      title: 'Fast Delivery',
      description:
        'Get your food delivered hot and fresh—quickly and reliably—so you can enjoy your meal without the wait.',
      image: 'https://res.cloudinary.com/daa5tuoh3/image/upload/v1759544992/deliveryboy_rlmp3i.webp',
    },
  ];

  return (
    <div className="text-center mt-20 mx-4 md:mx-20">
      <h2 className="text-3xl font-bold mb-12">Why Choose Our Favorite Food</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-10">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-xs text-center hover:shadow-lg transition-shadow duration-300"
          >
            {/* Larger Green Circle with Full-Size Image */}
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUS;
