import React from 'react';
import Banner from '../Banner/Banner';
import Overview from '../Overview/Overview';
import TourismTravelGuideSection from '../TourismTravelGuideSection/TourismTravelGuideSection/TourismTravelGuideSection';
import Faq from '../Faq/Faq';
import TravelTips from '../TravelTips/TravelTips';

const Home = () => {
    return (
        <div>
            <Banner />
            <Overview />
            <TourismTravelGuideSection />
            <TravelTips />
            <Faq />
        </div>
    );
};

export default Home;