import { useId, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import SectionHeading from "../../../Components/UI/SectionHeading";

const faqs = [
  {
    question: "How do I book a trip?",
    answer:
      "Open a trip, choose your date and guide, then press Reserve. You'll be taken straight to a secure payment page. Your booking is created as soon as you reserve, and you can finish paying from My Bookings any time.",
  },
  {
    question: "What happens after I pay?",
    answer:
      "Your booking moves to Guide reviewing and your guide is notified. Once they confirm, the status changes to Confirmed. You can follow every step from My Bookings.",
  },
  {
    question: "Can I cancel or get a refund?",
    answer:
      "You can cancel while a booking is awaiting payment or being reviewed by the guide. If you have already paid, the full amount is refunded to your card automatically. A guide declining your booking triggers the same refund.",
  },
  {
    question: "Do I need an account to book?",
    answer:
      "Yes, and it must be a tourist account (guides and admins can't book). An account lets you manage bookings, pay securely and track every step of your trip. Browsing trips, guides and stories is open to everyone.",
  },
  {
    question: "Can I choose my own tour guide?",
    answer:
      "Yes. Every booking includes a guide picker, and each guide has a public profile with experience, languages and the stories they've shared.",
  },
  {
    question: "How do I become a tour guide?",
    answer:
      "Open Become a guide in your dashboard and submit your CV, experience and languages. An admin reviews each application, and you'll see the status on that page.",
  },
  {
    question: "Is my payment information safe?",
    answer:
      "Card details go directly to Stripe and never touch TourNest's servers. Our API is protected with signed tokens and role-based access.",
  },
  {
    question: "How do I share a travel story?",
    answer:
      "Go to Add stories in your dashboard, write about your trip, upload photos and publish. Stories appear on the Community page and can be shared on Facebook.",
  },
  {
    question: "Are there limits on stories?",
    answer:
      "No. You can add, edit or delete as many stories as you like from Manage stories.",
  },
];

const Item = ({ item, open, onToggle }) => {
  const id = useId();
  return (
    <div className="surface-flat overflow-hidden">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-semibold hover:bg-base-content/4 sm:text-lg"
        >
          <span>{item.question}</span>
          <LuChevronDown
            size={20}
            aria-hidden="true"
            className={`shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className={`grid transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-muted sm:text-base">{item.answer}</p>
        </div>
      </div>
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? faqs : faqs.slice(0, 5);

  return (
    <section id="faq" className="section bg-base-200">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <SectionHeading
            title="Questions, answered"
            description="Everything you need to know about booking, payments and becoming a guide."
            className="!mb-0"
          />
        </div>
        <div className="space-y-3">
          {visible.map((item, index) => (
            <Item
              key={item.question}
              item={item}
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
          <div className="pt-2">
            <button type="button" className="btn btn-outline" onClick={() => setShowAll((v) => !v)}>
              {showAll ? "Show fewer questions" : `Show all ${faqs.length} questions`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
