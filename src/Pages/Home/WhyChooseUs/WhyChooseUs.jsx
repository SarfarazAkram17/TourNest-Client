import { FaHandshake, FaStar, FaShieldAlt, FaClock } from "react-icons/fa";

const reasons = [
  {
    icon: <FaHandshake className="text-4xl text-primary" />,
    title: "Trusted by Thousands",
    description:
      "We have served thousands of happy travelers who trust us for reliable and memorable experiences across Bangladesh.",
  },
  {
    icon: <FaStar className="text-4xl text-primary" />,
    title: "Top Rated Guides",
    description:
      "Our tour guides are experienced professionals who know every corner and story of the destinations to enrich your journey.",
  },
  {
    icon: <FaShieldAlt className="text-4xl text-primary" />,
    title: "Safe & Secure",
    description:
      "Your safety is our priority. We ensure secure bookings, verified guides, and continuous support throughout your trip.",
  },
  {
    icon: <FaClock className="text-4xl text-primary" />,
    title: "24/7 Customer Support",
    description:
      "Our friendly support team is available around the clock to help you with any questions or concerns before, during, and after your trip.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-primary mb-6">
        Why Choose Us
      </h2>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-sm">
        Choosing the right travel partner can make all the difference in your
        journey. We are committed to providing unmatched services, trusted
        guides, and continuous support to ensure your travel experience is safe,
        enjoyable, and unforgettable.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center hover:border-secondary hover:shadow-lg transition duration-300"
          >
            <div className="mb-4 flex justify-center">{reason.icon}</div>
            <h3 className="text-lg xl:text-xl font-semibold text-[#03373D] mb-2">
              {reason.title}
            </h3>
            <p className="text-xs xl:text-sm leading-relaxed text-[#606060]">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
