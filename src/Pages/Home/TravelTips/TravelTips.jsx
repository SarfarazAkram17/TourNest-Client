import {
  LuBackpack,
  LuBandage,
  LuBanknote,
  LuClock,
  LuCloudRain,
  LuFootprints,
  LuHeartHandshake,
  LuMap,
} from "react-icons/lu";
import SectionHeading from "../../../Components/UI/SectionHeading";

const travelTips = [
  {
    icon: LuBackpack,
    title: "Pack light but smart",
    text: "Bring lightweight clothing, sunscreen and a power bank, especially for hilly or coastal trips like Sajek or Cox's Bazar.",
  },
  {
    icon: LuMap,
    title: "Download offline maps",
    text: "Mobile networks can drop in remote areas such as Bandarban or the Sundarbans.",
  },
  {
    icon: LuBandage,
    title: "Carry a first aid kit",
    text: "Plasters, antiseptic, painkillers and any personal medicine. Clinics can be far from tourist spots.",
  },
  {
    icon: LuClock,
    title: "Start early",
    text: "Long drives are common. An early start keeps you from rushing key spots or travelling after dark.",
  },
  {
    icon: LuBanknote,
    title: "Keep some cash",
    text: "Many remote places don't take digital payments and ATMs are rare in areas like Rangamati.",
  },
  {
    icon: LuFootprints,
    title: "Wear comfortable shoes",
    text: "Hill tracks and waterfalls mean a lot of walking. Good footwear prevents injury and fatigue.",
  },
  {
    icon: LuCloudRain,
    title: "Check the weather",
    text: "Monsoon weather changes quickly. Watch for flooding and landslide warnings before you leave.",
  },
  {
    icon: LuHeartHandshake,
    title: "Respect local customs",
    text: "Dress modestly, ask before photographing people and follow local traditions.",
  },
];

const TravelTips = () => (
  <section className="section">
    <div className="container-page">
      <SectionHeading
        title="Travel smart in Bangladesh"
        description="Short, practical advice from guides on our platform."
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {travelTips.map(({ icon: Icon, title, text }) => (
          <li key={title} className="surface-flat p-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={20} aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-bold leading-snug">{title}</h3>
            <p className="mt-1.5 text-sm text-muted">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default TravelTips;
