import SectionHeading from "../../../Components/UI/SectionHeading";

const steps = [
  {
    title: "Choose a trip",
    text: "Browse curated packages by destination, trip type and budget.",
  },
  {
    title: "Pick your guide and date",
    text: "Compare local guides, then reserve the day that suits you.",
  },
  {
    title: "Pay securely",
    text: "Pay by card through Stripe. Your guide is notified the moment payment clears.",
  },
  {
    title: "Your guide confirms",
    text: "Once confirmed, you are set. If your guide can't make it, you are refunded automatically.",
  },
];

const HowItWorks = () => (
  <section className="section bg-base-200" >
    <div className="container-page">
      <SectionHeading
        title="From idea to itinerary in four steps"
        description="Booking is simple, and every step tells you exactly what happens next."
      />
      <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex gap-4 lg:flex-col lg:gap-5">
            <span className="relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-content">
              {index + 1}
            </span>
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-[1.35rem] top-11 hidden h-[calc(100%+1rem)] w-px bg-base-content/15 max-sm:block lg:left-14 lg:top-[1.35rem] lg:block lg:h-px lg:w-[calc(100%-2.5rem)]"
              />
            )}
            <div className="min-w-0">
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorks;
