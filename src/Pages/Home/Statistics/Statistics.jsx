import {
  FaUser,
  FaMapMarkedAlt,
  FaSuitcaseRolling,
  FaStar,
} from "react-icons/fa";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const stats = [
  {
    label: "Happy Tourists",
    value: 500,
    icon: <FaUser className="text-4xl text-blue-500" />,
  },
  {
    label: "Tour Guides",
    value: 50,
    icon: <FaMapMarkedAlt className="text-4xl text-green-500" />,
  },
  {
    label: "Tours Completed",
    value: 120,
    icon: <FaSuitcaseRolling className="text-4xl text-yellow-500" />,
  },
  {
    label: "5-Star Reviews",
    value: 300,
    icon: <FaStar className="text-4xl text-red-500" />,
  },
];

const Statistics = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.h2
          className="text-center text-3xl md:text-4xl font-bold text-primary mb-6"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          Our Achievements
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="rounded-xl border-2 flex flex-col items-center justify-center border-gray-200 hover:border-secondary hover:shadow-lg transition-border transition-shadow duration-300 p-4 bg-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.3, delay: index * 0.2 }}
            >
              <div>{stat.icon}</div>
              <h3 className="text-2xl font-bold mt-4">
                <CountUp end={stat.value} duration={2} separator="," />+
              </h3>

              <p className="text-gray-700 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
