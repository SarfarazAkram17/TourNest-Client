import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const faqs = [
    {
      question: "How can I book a tour package?",
      answer:
        "You need to log in, go to the package details page, and fill out the booking form. Once submitted, your booking will be marked as 'Pending'.",
    },
    {
      question: "Do I need to log in to book a tour?",
      answer:
        "Yes, booking is a protected action. You must log in first to access the booking form and proceed with the reservation.",
    },
    {
      question: "How can I become a tour guide?",
      answer:
        "Visit the 'Join as Tour Guide' page in your dashboard. Submit your application with your CV and reasons. Admin will review it shortly.",
    },
    {
      question: "What happens after I book a package?",
      answer:
        "After booking, you redirected to the payment page. You can view and manage all your bookings in the 'My Bookings' dashboard section.",
    },
    {
      question: "How does the payment process work?",
      answer:
        "After booking, you’ll see a 'Pay' button for pending bookings in My Bookings page on dashboard. Clicking it takes you to the Stripe payment page.",
    },
    {
      question: "Can I cancel a tour I booked?",
      answer:
        "Yes, if your booking status is 'Pending', you can cancel it directly from the 'My Bookings' page.",
    },
    {
      question: "How can I share my travel story?",
      answer:
        "Go to your dashboard and click 'Add Stories'. You can write a story, add images, and publish it.",
    },
    {
      question: "How do I track the status of my booking?",
      answer:
        "Go to 'My Bookings'. You'll see the status as 'Pending', 'In Review', 'Accepted', or 'Rejected' depending on tour guide and your action.",
    },
    {
      question: "How can I update my profile?",
      answer:
        "In your dashboard, go to 'Manage Profile' and click the 'Edit' button. You can update your name and photo.",
    },
    {
      question: "Are the stories public?",
      answer:
        "Yes, stories are visible on the homepage and Community page. Other users can read and share them on Facebook after login.",
    },
    {
      question: "Can I choose my tour guide?",
      answer:
        "Yes, while booking, you'll see a dropdown to select a tour guide for that package.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Absolutely. All secure routes are protected using JWT, and sensitive keys are hidden using environment variables.",
    },
    {
      question: "How many stories can I add?",
      answer:
        "There's no limit. You can add, edit, or delete as many stories as you want from your dashboard.",
    },
  ];

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 5);

  return (
    <div className="py-12 bg-gray-50 mb-7">
      <div className="px-4 max-w-7xl mx-auto">
        <motion.h1
          className="mb-10 text-center text-primary text-3xl md:text-4xl font-bold"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Frequently Asked Questions
        </motion.h1>

        <div className="space-y-4">
          {visibleFaqs.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActiveIndex(isActive ? -1 : index)}
                className={`cursor-pointer rounded-xl border-2 p-4 shadow-sm ${
                  isActive
                    ? "bg-[#E6F2F3] border-secondary shadow-md"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-sm md:text-base font-bold text-[#03373D]">
                    {faq.question}
                  </h3>
                  <motion.span
                    className="text-primary"
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaArrowDown />
                  </motion.span>
                </div>

                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-[#606060] text-sm leading-relaxed"
                  >
                    <hr className="mb-3 border-t-2 border-[#C3DFE2]" />
                    {faq.answer}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn btn-secondary rounded-lg"
          >
            {showAll ? (
              <span className="flex gap-2 items-center">
                Show Less <FaArrowUp size={15} />
              </span>
            ) : (
              <span className="flex gap-2 items-center">
                Show All <FaArrowDown size={15} />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Faq;
