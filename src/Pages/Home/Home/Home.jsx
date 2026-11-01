import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import Banner from "../Banner/Banner";
import Statistics from "../Statistics/Statistics";
import FeaturedPackages from "../FeaturedPackages/FeaturedPackages";
import HowItWorks from "../HowItWorks/HowItWorks";
import FeaturedGuides from "../FeaturedGuides/FeaturedGuides";
import TouristStorySection from "../TouristStorySection/TouristStorySection";
import WhyChooseUs from "../WhyChooseUs/WhyChooseUs";
import TravelTips from "../TravelTips/TravelTips";
import Faq from "../Faq/Faq";
import CallToAction from "../CallToAction/CallToAction";

const Home = () => {
  useDocumentTitle();
  return (
    <>
      <Banner />
      <Statistics />
      <FeaturedPackages />
      <HowItWorks />
      <FeaturedGuides />
      <TouristStorySection />
      <WhyChooseUs />
      <TravelTips />
      <Faq />
      <CallToAction />
    </>
  );
};

export default Home;
