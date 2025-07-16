import { useParams, useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";
import Loading from "../../Components/Loading/Loading";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import Select from "react-select";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import TourGuideCard from "../../Components/Shared/TourGuideCard";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";

const PackageDetails = () => {
  const [showAllGuide, setShowAllGuide] = useState(false);
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userEmail } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: pkg, isLoading } = useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/packages/${id}`);
      return res.data;
    },
  });

  const { data: guides = [], isLoading: guideLoading } = useQuery({
    queryKey: ["tour-guides"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/tour-guide");
      return res.data || [];
    },
  });

  const guidesForCard = showAllGuide ? guides : guides?.slice(0, 3);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const watchTourGuide = watch("tourGuide");

  useEffect(() => {
    register("tourGuide", { required: "Tour Guide is required" });
    register("tourDate", { required: "Tour date is required" });
  }, [register]);

  useEffect(() => {
    if (pkg && user) {
      setValue("packageName", pkg.title);
      setValue("touristName", user.displayName);
      setValue("touristEmail", userEmail);
      setValue("touristImage", user.photoURL);
      setValue("tourPrice", pkg.price);
    }
  }, [pkg, user, userEmail, setValue]);

  useEffect(() => {
    setValue("tourDate", selectedDate);
  }, [selectedDate, setValue]);

  const handleBooking = async (data) => {
    if (!user) {
      Swal.fire(
        "Login Required",
        "Please login to book this package.",
        "warning"
      );
      navigate("/login", { state: location.pathname });
      return;
    }

    const tourGuideName = data.tourGuide.split(" - ")[0];
    const tourGuideEmail = data.tourGuide.split(" - ")[1];
    const selectedGuide = guides.find(
      (g) => g.guideInfo.email === tourGuideEmail
    );

    const bookingData = {
      packageId: id,
      packageName: pkg.title,
      touristName: user.displayName,
      touristEmail: userEmail,
      touristImage: user.photoURL,
      price: pkg.price,
      tourDate: data.tourDate,
      tourGuideName,
      tourGuideImage: selectedGuide.guideInfo.photo,
      tourGuideEmail,
      status: "pending",
      bookingAt: new Date().toISOString(),
      payment_status: "not_paid",
    };

    // Confirmation Prompt
    const confirmResult = await Swal.fire({
      title: "Confirm Booking",
      text: "Are you sure you want to book this package?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Book Now",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    // Proceed with booking if confirmed
    try {
      setLoading(true);
      const res = await axiosSecure.post(
        `/bookings?email=${userEmail}`,
        bookingData
      );

      if (res.data.insertedId) {
        Swal.fire({
          title: "Booking Successful!",
          text: "Your booking has been placed successfully and redirecting you to the payment page.",
          icon: "success",
          confirmButtonText: "Going to Payment Page",
        }).then(() => {
          navigate(`/dashboard/payment/${res.data.insertedId}`);
        });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        Swal.fire(
          "Booking Denied",
          "You already booked this package and haven’t paid yet.",
          "error"
        );
      } else {
        Swal.fire("Error", "Something went wrong while booking.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || guideLoading) return <Loading />;
  if (!pkg)
    return <p className="text-center text-gray-500">Package not found.</p>;

  const guideOptions = guides.map((g) => ({
    value: `${g.guideInfo.name} - ${g.guideInfo.email}`,
    label: `${g.guideInfo.name} - ${g.guideInfo.email}`,
  }));

  const selectedGuideOption =
    guideOptions.find((option) => option.value === watchTourGuide) || null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-3">{pkg.title}</h1>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto">
          {pkg.description.split(".")[0]}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-12">
        {pkg.images[0] && (
          <img
            src={pkg.images[0]}
            alt="Gallery 1"
            className="sm:col-span-3 sm:row-span-2 object-cover w-full h-full rounded-xl shadow-md"
          />
        )}
        {pkg.images[1] && (
          <img
            src={pkg.images[1]}
            alt="Gallery 2"
            className="sm:col-span-1 sm:row-span-1 object-cover w-full h-full rounded-xl shadow-sm"
          />
        )}
        {pkg.images[2] && (
          <img
            src={pkg.images[2]}
            alt="Gallery 3"
            className="sm:col-span-2 sm:row-span-1 object-cover w-full h-full rounded-xl shadow-sm"
          />
        )}
        {pkg.images[3] && (
          <img
            src={pkg.images[3]}
            alt="Gallery 4"
            className="sm:col-span-2 sm:row-span-1 object-cover w-full h-full rounded-xl shadow-sm"
          />
        )}
        {pkg.images[4] && (
          <img
            src={pkg.images[4]}
            alt="Gallery 5"
            className="sm:col-span-1 sm:row-span-1 object-cover w-full h-full rounded-xl shadow-sm"
          />
        )}
        {pkg.images.slice(5).map((img, idx) => (
          <img
            key={idx + 5}
            src={img}
            alt={`Gallery ${idx + 6}`}
            className="sm:col-span-1 sm:row-span-1 object-cover w-full h-full rounded-xl shadow-sm"
          />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-primary">
            About The Tour
          </h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {pkg.description}
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">Trip Overview</h2>
          <ul className="text-gray-700 text-sm space-y-2">
            <li>
              <strong>Location:</strong> {pkg.location}
            </li>
            <li>
              <strong>Type:</strong> {pkg.tourType}
            </li>
            <li>
              <strong>Duration:</strong> {pkg.duration}
            </li>
            <li>
              <strong>Price:</strong> ৳{pkg.price.toLocaleString("en-BD")}
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-primary mb-5">Tour Plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
          {pkg.tourPlan.map((plan, i) => (
            <div
              key={i}
              className="bg-base-100 border border-gray-200 rounded-xl shadow-sm p-4"
            >
              <h3 className="font-bold text-lg mb-1 text-secondary">
                {plan.day}
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {plan.activities}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-primary mb-5">
          Meet Our Tour Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {guidesForCard.map((guide) => (
            <TourGuideCard key={guide._id} guide={guide} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAllGuide(!showAllGuide)}
            className="btn btn-secondary rounded-lg"
          >
            {showAllGuide ? (
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

      <div className="divider"></div>

      <div className="mt-10">
        <h2 className="text-3xl text-center font-semibold text-primary mb-8">
          Book This Package
        </h2>
        <form onSubmit={handleSubmit(handleBooking)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-6 items-start">
            <div className="fieldset">
              <label className="block text-sm">Package Name</label>
              <input
                type="text"
                readOnly
                {...register("packageName")}
                className="input input-bordered w-full h-10"
              />
            </div>
            <div className="fieldset">
              <label className="block text-sm">Tourist Name</label>
              <input
                type="text"
                readOnly
                {...register("touristName")}
                className="input input-bordered w-full h-10"
              />
            </div>
            <div className="fieldset">
              <label className="block text-sm">Tourist Email</label>
              <input
                type="email"
                readOnly
                {...register("touristEmail")}
                className="input input-bordered w-full h-10"
              />
            </div>
            <div className="fieldset">
              <label className="block text-sm">Tourist Picture URL</label>
              <input
                type="text"
                readOnly
                {...register("touristImage")}
                className="input input-bordered w-full h-10"
              />
            </div>
            <div className="fieldset">
              <label className="block text-sm">Tour Price</label>
              <input
                type="number"
                readOnly
                {...register("tourPrice")}
                className="input input-bordered w-full h-10"
              />
            </div>
            <div className="fieldset">
              <label className="block text-sm">Tour Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="input input-bordered w-full h-10"
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                placeholderText="Pick a Date"
                filterDate={(date) => date > new Date()}
              />
              {errors.tourDate && (
                <p className="text-red-500 font-semibold text-xs mt-1">
                  {errors.tourDate.message}
                </p>
              )}
            </div>
            <div className="fieldset sm:col-span-2">
              <label className="block text-sm">Select Tour Guide</label>
              <Select
                options={guideOptions}
                value={selectedGuideOption}
                onChange={(selectedOption) =>
                  setValue(
                    "tourGuide",
                    selectedOption ? selectedOption.value : ""
                  )
                }
                placeholder="Select a guide"
                isClearable
              />
              {errors.tourGuide && (
                <p className="text-red-500 font-semibold text-xs mt-1">
                  {errors.tourGuide.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary text-white w-full mt-10"
          >
            {loading ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : (
              "Book Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PackageDetails;
