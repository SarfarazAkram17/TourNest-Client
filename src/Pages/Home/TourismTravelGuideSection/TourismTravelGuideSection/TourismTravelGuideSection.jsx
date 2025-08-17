import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import OurPackagesTab from "../OurPackagesTab/OurPackagesTab";
import MeetOurTourGuidesTab from "../MeetOurTourGuidesTab/MeetOurTourGuidesTab";
import "./TourismTab.css";

const TourismTravelGuideSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold mb-10 text-center text-primary">
        Tourism & Travel Guide
      </h2>

      <Tabs>
        <TabList className='custom-list'>
          <Tab>Our Package</Tab>
          <Tab>Meet Our Tour Guides</Tab>
        </TabList>

        <TabPanel>
          <OurPackagesTab />
        </TabPanel>
        <TabPanel>
          <MeetOurTourGuidesTab />
        </TabPanel>
      </Tabs>
    </section>
  );
};

export default TourismTravelGuideSection;
