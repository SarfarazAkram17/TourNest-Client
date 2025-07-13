import React from "react";
import {
  FaUmbrellaBeach,
  FaMapMarkedAlt,
  FaFirstAid,
  FaRegClock,
  FaMoneyBillWave,
  FaWalking,
  FaCloudSunRain,
  FaHandshake,
} from "react-icons/fa";

const travelTips = [
  {
    icon: <FaUmbrellaBeach className="text-2xl text-primary" />,
    title: "Pack Light but Smart",
    description:
      "Bring lightweight clothing, sunscreen, and power banks. Avoid overpacking to stay mobile during your trips in hilly or coastal areas like Sajek or Cox’s Bazar.",
  },
  {
    icon: <FaMapMarkedAlt className="text-2xl text-primary" />,
    title: "Always Keep Offline Maps",
    description:
      "Mobile networks may not work in remote areas. Download maps offline before heading to places like Bandarban or Sundarbans.",
  },
  {
    icon: <FaFirstAid className="text-2xl text-primary" />,
    title: "Carry a Basic First Aid Kit",
    description:
      "Include band-aids, antiseptic, painkillers, and any personal medicine. Clinics may be far from tourist spots.",
  },
  {
    icon: <FaRegClock className="text-2xl text-primary" />,
    title: "Start Early, Avoid Delays",
    description:
      "Tours to natural destinations often involve long travel. Start early to avoid missing key spots or facing safety issues after dark.",
  },
  {
    icon: <FaMoneyBillWave className="text-2xl text-primary" />,
    title: "Keep Cash in Hand",
    description:
      "Many remote destinations don’t support digital payments. ATMs may not be available in places like Sajek or Rangamati.",
  },
  {
    icon: <FaWalking className="text-2xl text-primary" />,
    title: "Wear Comfortable Shoes",
    description:
      "Touring hill tracks or waterfalls requires a lot of walking. Proper footwear will save you from injury or fatigue.",
  },
  {
    icon: <FaCloudSunRain className="text-4xl text-primary" />,
    title: "Check Weather Before You Travel",
    description:
      "The weather in Bangladesh can be unpredictable. Especially in the monsoon season, be aware of flooding or landslides.",
  },
  {
    icon: <FaHandshake className="text-2xl text-primary" />,
    title: "Respect Local Customs",
    description:
      "Dress modestly, ask before photographing people, and follow local traditions. Respect earns you kindness in return.",
  },
];

const TravelTips = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-primary mb-6">
        Travel Tips & Safety Advice
      </h2>
      <p className="text-center text-sm max-w-3xl mx-auto text-gray-600 mb-10">
        Planning a trip? Stay prepared with essential tips to ensure a safe,
        enjoyable, and hassle-free journey through Bangladesh's stunning
        landscapes and vibrant cultures. From packing smartly to respecting
        local customs, these expert tips will help you make the most of your
        adventure.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {travelTips.map((tip, index) => (
          <div
            key={index}
            className="rounded-xl border-2 border-gray-200 hover:border-secondary hover:shadow-lg transition duration-500 p-4 bg-white"
          >
            <div className="flex items-center gap-2 mb-3">
              {tip.icon}
              <h3 className="font-semibold text-[#03373D]">{tip.title}</h3>
            </div>
            <p className="text-xs xl:text-sm leading-relaxed text-[#606060]">
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelTips;
