import React from 'react';
import Banner from '../Banner/Banner';
import Overview from '../Overview/Overview';
import TourismTravelGuideSection from '../TourismTravelGuideSection/TourismTravelGuideSection/TourismTravelGuideSection';

const Home = () => {
    return (
        <div>
            <Banner />
            <Overview />
            <TourismTravelGuideSection />
        </div>
    );
};

export default Home;