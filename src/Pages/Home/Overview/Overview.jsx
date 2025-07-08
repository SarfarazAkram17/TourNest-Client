import React from "react";

const Overview = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Text Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            Experience Bangladesh Like Never Before
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            TourNest is your gateway to discovering the real Bangladesh — from its timeless heritage to its vibrant local life. Partnering with trusted local guides, we bring you personalized adventures that go beyond tourist spots.
          </p>
          <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
            <li>Explore culturally rich destinations with local insights</li>
            <li>Connect with verified tour guides across all regions</li>
            <li>Enjoy seamless planning, booking, and communication</li>
          </ul>
        </div>

        {/* Video Content */}
        <div className="aspect-w-16 aspect-h-9 w-full rounded-2xl overflow-hidden shadow-lg">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Cn4G2lZ_g2I?si=J99GwMrzNLHTyqUT"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Overview;
