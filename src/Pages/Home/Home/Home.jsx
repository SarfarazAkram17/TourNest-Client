import Banner from '../Banner/Banner';
import Overview from '../Overview/Overview';
import TourismTravelGuideSection from '../TourismTravelGuideSection/TourismTravelGuideSection/TourismTravelGuideSection';
import Faq from '../Faq/Faq';
import TravelTips from '../TravelTips/TravelTips';
import WhyChooseUs from '../WhyChooseUs/WhyChooseUs';
import TouristStorySection from '../TouristStorySection/TouristStorySection';
import Statistics from '../Statistics/Statistics';

const Home = () => {
    return (
        <div>
            <Banner />
            <Overview />
            <TourismTravelGuideSection />
            <TouristStorySection />
            <WhyChooseUs />
            <TravelTips />
            <Statistics></Statistics>
            <Faq />
        </div>
    );
};

export default Home;