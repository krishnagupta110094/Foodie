import React from "react";
import GWButton from "../components/common/GWButton";
import HomeBanner from "../components/core/Home/HomeBanner";
import HomeBanner2 from "../components/core/Home/HomeBanner2";
import Category from "../components/core/Home/Category";
import Products from "../components/core/Home/Products";
import WhyChooseUS from "../components/core/Home/WhyChooseUS";
import RestoBanner from "../components/core/Home/RestoBanner";
import HappyClient from "../components/core/Home/HappyClient";

const Home = () => {
  return (
    <div className="bg-white">
     
      {/* Home Banner */}
      <HomeBanner />
      {/* Home Banner2  */}
      <HomeBanner2 />
      {/* Category */}
      <Category />
      {/* Popular Products */}
      <Products />
      {/* Why Choose our favourite food */}
      <WhyChooseUS />
      <RestoBanner />
      <HappyClient />
    </div>
  );
};

export default Home;
