import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  LuArrowLeft,
  LuCalendarDays,
  LuClock,
  LuImages,
  LuMapPin,
  LuShieldCheck,
  LuTag,
  LuUserRound,
} from "react-icons/lu";
import useAxios from "../../Hooks/useAxios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import useUserRole from "../../Hooks/useUserRole";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import Loading from "../../Components/Loading/Loading";
import Avatar from "../../Components/UI/Avatar";
import Modal from "../../Components/UI/Modal";
import EmptyState from "../../Components/UI/EmptyState";
import FormField from "../../Components/UI/FormField";
import { confirmAction, getErrorMessage } from "../../utils/alerts";
import { dateInputToISO, formatBDT, formatDate, tomorrowInputValue } from "../../utils/format";

const Fact = ({ icon: Icon, label, value }) => (
  <div className="surface-flat flex items-center gap-3 p-4">
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Icon size={20} aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="text-xs text-muted">{label}</p>
      <p className="truncate text-sm font-bold">{value}</p>
    </div>
  </div>
);

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const { user, userEmail } = useAuth();
  const { role } = useUserRole();

  const [guideEmail, setGuideEmail] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [showAllGuides, setShowAllGuides] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const { data: pkg, isLoading, isError } = useQuery({
    queryKey: ["package", id],
    queryFn: async () => (await axiosInstance.get(`/packages/${id}`)).data,
    retry: false,
  });

  const { data: guides = [], isLoading: guidesLoading } = useQuery({
    queryKey: ["tour-guides"],
    queryFn: async () => (await axiosInstance.get("/users/tour-guide")).data || [],
    staleTime: 5 * 60 * 1000,
  });

  useDocumentTitle(pkg?.title || "Trip details");

  useEffect(() => {
    if (lightboxIndex === null) return;
    document.getElementById(`photo-${lightboxIndex}`)?.scrollIntoView({ block: "start" });
  }, [lightboxIndex]);

  const eligibleGuides = useMemo(
    () => guides.filter((g) => g.guideInfo?.email && g.guideInfo.email !== userEmail),
    [guides, userEmail]
  );
  const visibleGuides = showAllGuides ? eligibleGuides : eligibleGuides.slice(0, 4);
  const selectedGuide = eligibleGuides.find((g) => g.guideInfo.email === guideEmail);

  if (isLoading) return <Loading label="Loading trip" />;
  if (isError || !pkg) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Trip not found" description="This package may have been removed.">
          <Link to="/allTrips" className="btn btn-primary">
            Browse all trips
          </Link>
        </EmptyState>
      </div>
    );
  }

  const images = pkg.images || [];
  const canBook = !user || role === "tourist";

  const validate = () => {
    const next = {};
    if (!guideEmail) next.guide = "Choose the guide you'd like to travel with.";
    if (!tourDate) next.date = "Pick a travel date.";
    else if (tourDate < tomorrowInputValue()) next.date = "Choose a date from tomorrow onwards.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleReserve = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.info("Log in to reserve this trip.");
      navigate("/login", { state: location.pathname });
      return;
    }
    if (!validate()) return;

    const confirmed = await confirmAction({
      title: "Reserve this trip?",
      text: `${pkg.title} with ${selectedGuide.guideInfo.name} on ${formatDate(
        dateInputToISO(tourDate)
      )}. You'll complete payment on the next screen.`,
      confirmText: "Yes, reserve",
    });
    if (!confirmed) return;

    setSubmitting(true);
    try {
      const res = await axiosSecure.post(`/bookings?email=${userEmail}`, {
        packageId: id,
        tourDate: dateInputToISO(tourDate),
        tourDay: tourDate,
        tourGuideEmail: guideEmail,
        touristName: user.displayName,
        touristImage: user.photoURL,
      });
      if (res.data.insertedId) {
        toast.success("Reserved! Complete payment to secure your date.");
        navigate(`/dashboard/payment/${res.data.insertedId}`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't create your booking. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const bookingCard = (
    <form
      id="booking"
      onSubmit={handleReserve}
      noValidate
      className="surface scroll-mt-24 p-5 sm:p-6"
      aria-label="Reserve this trip"
    >
      <p className="text-sm text-muted">Package price</p>
      <p className="font-display text-3xl font-bold tabular-nums">{formatBDT(pkg.price)}</p>
      <p className="mt-0.5 text-xs text-muted">{pkg.duration}</p>

      {canBook ? (
        <>
          <div className="mt-5 space-y-4">
            <FormField label="Travel date" htmlFor="tourDate" error={errors.date} required>
              <input
                id="tourDate"
                type="date"
                min={tomorrowInputValue()}
                value={tourDate}
                onChange={(e) => setTourDate(e.target.value)}
                aria-invalid={!!errors.date}
                className="input w-full"
              />
            </FormField>

            <div>
              <p className="text-sm font-semibold">Your guide</p>
              {selectedGuide ? (
                <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-base-200 p-3">
                  <Avatar src={selectedGuide.guideInfo.photo} name={selectedGuide.guideInfo.name} size="sm" />
                  <p className="min-w-0 truncate text-sm font-semibold">{selectedGuide.guideInfo.name}</p>
                </div>
              ) : (
                <p className="mt-1.5 text-sm text-muted">
                  Select a guide from the list{" "}
                  <a href="#guide-picker" className="font-semibold text-primary underline-offset-4 hover:underline">
                    above
                  </a>
                  .
                </p>
              )}
              {errors.guide && (
                <p role="alert" className="mt-1.5 text-xs font-medium text-error">
                  {errors.guide}
                </p>
              )}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary mt-6 w-full">
            {submitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : user ? (
              "Reserve and pay"
            ) : (
              "Log in to reserve"
            )}
          </button>
          <p className="mt-3 flex items-start gap-2 text-xs text-muted">
            <LuShieldCheck size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
            Pay securely with Stripe. Full refund if your guide declines or you cancel before
            confirmation.
          </p>
        </>
      ) : (
        <p className="mt-5 rounded-xl bg-info/10 p-3 text-sm text-info">
          Only tourist accounts can book trips. You're signed in as {role === "tour guide" ? "a tour guide" : "an admin"}, so you can browse
          trips but not reserve them.
        </p>
      )}
    </form>
  );

  return (
    <div className="pb-24 lg:pb-14">
      <div className="container-page pt-6 md:pt-8">
        <Link to="/allTrips" className="btn btn-ghost btn-sm -ml-3">
          <LuArrowLeft size={16} aria-hidden="true" /> All trips
        </Link>

        <header className="mt-3 max-w-4xl">
          <h1 className="h-section break-words">{pkg.title}</h1>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            <li className="inline-flex items-center gap-1.5">
              <LuMapPin size={16} aria-hidden="true" /> {pkg.location}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <LuClock size={16} aria-hidden="true" /> {pkg.duration}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <LuTag size={16} aria-hidden="true" /> {pkg.tourType}
            </li>
          </ul>
        </header>

        {/* Gallery */}
        <div className="relative mt-6 grid grid-cols-4 gap-2 overflow-hidden rounded-3xl sm:gap-3">
          {images.slice(0, 5).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={`Open photo ${i + 1} of ${images.length}`}
              className={`group relative overflow-hidden bg-base-200 ${
                i === 0
                  ? "col-span-4 aspect-[16/10] lg:col-span-2 lg:row-span-2 lg:aspect-auto"
                  : "aspect-square lg:aspect-[4/3]"
              }`}
            >
              <img
                src={src}
                alt={`${pkg.title}, photo ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </button>
          ))}
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              className="btn btn-sm absolute bottom-3 right-3 border-0 bg-base-100/90 shadow backdrop-blur"
            >
              <LuImages size={16} aria-hidden="true" /> All {images.length} photos
            </button>
          )}
        </div>
      </div>

      <div className="container-page mt-10 grid gap-10 lg:grid-cols-[1fr_22.5rem] lg:gap-12">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="h-page">
              About this trip
            </h2>
            <p className="story-body mt-4 text-base sm:text-lg">{pkg.description}</p>
            <div className="mt-6 grid gap-3 xs:grid-cols-2">
              <Fact icon={LuMapPin} label="Destination" value={pkg.location} />
              <Fact icon={LuClock} label="Duration" value={pkg.duration} />
              <Fact icon={LuTag} label="Trip type" value={pkg.tourType} />
              <Fact icon={LuCalendarDays} label="Itinerary" value={`${pkg.tourPlan?.length || 0} days planned`} />
            </div>
          </section>

          <section aria-labelledby="plan-heading">
            <h2 id="plan-heading" className="h-page">
              Day-by-day plan
            </h2>
            <ol className="mt-6 space-y-0">
              {(pkg.tourPlan || []).map((plan, i, arr) => (
                <li key={`${plan.day}-${i}`} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < arr.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[1.05rem] top-9 h-[calc(100%-1.75rem)] w-px bg-base-content/15"
                    />
                  )}
                  <span className="relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-content">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-1">
                    <h3 className="font-bold">{plan.day}</h3>
                    <p className="mt-1 whitespace-pre-line text-sm text-muted sm:text-base">
                      {plan.activities}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {canBook && (
            <section id="guide-picker" aria-labelledby="guide-heading" className="scroll-mt-24">
              <h2 id="guide-heading" className="h-page">
                Choose your guide
              </h2>
              <p className="mt-2 text-muted">
                Your guide hosts you for the whole trip. Compare experience and languages below.
              </p>

              {guidesLoading ? (
                <Loading className="min-h-40" />
              ) : eligibleGuides.length === 0 ? (
                <div className="mt-5">
                  <EmptyState
                    icon={LuUserRound}
                    title="No guides available yet"
                    description="Check back soon. Guides are added as applications are approved."
                  />
                </div>
              ) : (
                <fieldset className="mt-6">
                  <legend className="sr-only">Tour guide</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {visibleGuides.map((guide) => {
                      const info = guide.guideInfo;
                      const checked = guideEmail === info.email;
                      return (
                        <div key={guide._id} className="relative">
                          <label className="block cursor-pointer">
                            <input
                              type="radio"
                              name="guide"
                              value={info.email}
                              checked={checked}
                              onChange={() => {
                                setGuideEmail(info.email);
                                setErrors((prev) => ({ ...prev, guide: undefined }));
                              }}
                              className="peer sr-only"
                            />
                            <span className="surface-flat flex items-center gap-3 p-4 pr-20 transition-colors peer-checked:border-primary peer-checked:bg-primary/6 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary hover:border-base-content/30">
                              <Avatar src={info.photo} name={info.name} size="md" />
                              <span className="min-w-0">
                                <span className="block truncate font-bold">{info.name}</span>
                                <span className="block truncate text-xs text-muted">
                                  {info.experience} yrs experience
                                </span>
                                <span className="block truncate text-xs capitalize text-muted">
                                  {(info.languages || []).slice(0, 3).join(", ")}
                                </span>
                              </span>
                            </span>
                          </label>
                          <Link
                            to={`/tourGuide/${guide._id}`}
                            className="absolute right-3 top-3 rounded-md px-2 py-1 text-xs font-semibold text-primary underline-offset-4 hover:underline"
                          >
                            Profile
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                  {eligibleGuides.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setShowAllGuides((v) => !v)}
                      className="btn btn-outline btn-sm mt-4"
                    >
                      {showAllGuides ? "Show fewer guides" : `Show all ${eligibleGuides.length} guides`}
                    </button>
                  )}
                </fieldset>
              )}
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">{bookingCard}</aside>
      </div>

      {/* Mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-base-content/10 bg-base-100/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="text-xs text-muted">Package price</p>
          <p className="font-display text-lg font-bold tabular-nums">{formatBDT(pkg.price)}</p>
        </div>
        <a href="#booking" className="btn btn-primary">
          Reserve
        </a>
      </div>

      <Modal
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        title={`${pkg.title}, photos`}
        size="xl"
      >
        <div className="space-y-4">
          {images.map((src, i) => (
            <img
              key={src}
              id={`photo-${i}`}
              src={src}
              alt={`${pkg.title}, photo ${i + 1}`}
              loading="lazy"
              className="w-full scroll-mt-20 rounded-2xl object-cover"
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default PackageDetails;
