import { Link } from "react-router";
import { motion } from "framer-motion";

const Overview = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
              Experience Bangladesh Like Never Before
            </h2>
            <p className="text-gray-700 text-sm mb-6">
              TourNest is your gateway to discovering the real Bangladesh — from
              its timeless heritage to its vibrant local life. Partnering with
              trusted local guides, we bring you personalized adventures that go
              beyond tourist spots.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li>Explore culturally rich destinations with local insights</li>
              <li>Connect with verified tour guides across all regions</li>
              <li>Enjoy seamless planning, booking, and communication</li>
            </ul>
            <Link to="/allTrips">
              <button className="mt-6 btn btn-primary text-white">
                Explore Tour Packages
              </button>
            </Link>
          </motion.div>

          {/* Video Content */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/Cn4G2lZ_g2I?si=J99GwMrzNLHTyqUT"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
