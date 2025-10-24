import React from 'react'
import { HomeImages } from '../../../data/Images'
import GWButton from '../../common/GWButton'
import { useNavigate } from 'react-router-dom'

const HomeBanner2 = () => {
  const navigate = useNavigate();
  return (
    <div className='mt-20 flex flex-col lg:flex-row items-center justify-between gap-10 px-6 md:pr-20 md:py-10 '>
      {/* Left Image Grid */}
      <div className='grid grid-cols-2 grid-rows-2 gap-4 w-full lg:w-1/2 md:h-[600px] md:pl-24'>
        <div className='row-span-2 h-full'>
          <img src={HomeImages.b21} alt="Tacos" className='rounded-lg object-cover w-full h-full' />
        </div>
        <div className='h-full'>
          <img src={HomeImages.b22} alt="Fried food" className='rounded-lg object-cover w-full h-full' />
        </div>
        <div className='h-full'>
          <img src={HomeImages.b23} alt="Salad" className='rounded-lg object-cover w-full h-full' />
        </div>
      </div>

      {/* Right Content Section */}
      <div className='w-full lg:w-1/2 max-w-xl'>
        <p className='text-green-800 font-semibold italic mb-2'>About us</p>
        <h2 className='text-3xl md:text-4xl font-bold mb-4 leading-tight'>
          Food is an important <br /> part Of a balanced Diet
        </h2>
        <p className='text-gray-600 mb-6 text-sm'>
          balanced diet provides the nutrients your body needs to function effectively. It includes a variety of foods from all major food groups in the right proportions—fruits, vegetables, proteins, grains, and healthy fats. Eating a balanced diet helps improve energy levels, boost immunity, maintain a healthy weight, and reduce the risk of chronic diseases. Good nutrition is not just about eating less or more, but about eating right to support a healthy body and mind.
        </p>

        {/* Buttons */}
        <div className='flex items-center gap-4'>
          <div onClick={()=>navigate("/menu")}>
            <GWButton  text="Show More" bgColor="#195A00" />
          </div>
          <div onClick={()=>navigate("/dashboard/cart")}>
          <GWButton text="Place an Order" bgColor="#f5f5f5" />

          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeBanner2



