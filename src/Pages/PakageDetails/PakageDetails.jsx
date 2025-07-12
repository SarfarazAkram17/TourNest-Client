import { useParams, useNavigate } from "react-router";
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

// Custom styles for react-select to fix height matching with inputs
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "2.75rem",    // ~44px, matches Tailwind input height
    height: "2.75rem",
    boxShadow: "none",
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "2.75rem",
    padding: "0 0.75rem",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "2.75rem",
  }),
};

const PackageDetails = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch package data
  const { data: pkg, isLoading: pkgLoading } = useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/packages/${id}`);
      return res.data;
    },
  });

  // Fetch tour guides data with useQuery
  const { data: guides = [], isLoading: guidesLoading } = useQuery({
    queryKey: ["tour-guides"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/tour-guide");
      return res.data || [];
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Register tourGuide manually for react-hook-form validation
  useEffect(() => {
    register("tourGuide", { required: true });
  }, [register]);

  // Set initial form values when pkg and user available
  useEffect(() => {
    if (pkg && user) {
      setValue("packageName", pkg.title);
      setValue("touristName", user.displayName);
      setValue("touristEmail", user.email);
      setValue("touristImage", user.photoURL);
    }
  }, [pkg, user, setValue]);

  // Watch tourGuide for React Select control
  const watchTourGuide = watch("tourGuide");

  const onSubmit = async (data) => {
    if (!user) {
      Swal.fire(
        "Login Required",
        "Please login to book this package.",
        "warning"
      );
      navigate("/login");
      return;
    }

    const bookingData = {
      packageId: id,
      packageName: pkg.title,
      touristName: user.displayName,
      touristEmail: user.email,
      touristImage: user.photoURL,
      price: pkg.price,
      tourDate: selectedDate,
      tourGuide: data.tourGuide,
      status: "pending",
    };

    try {
      await axiosInstance.post("/bookings", bookingData);
      Swal.fire({
        title: "Confirm your Booking",
        text: "Booking request sent successfully!",
        icon: "success",
        confirmButtonText: "Go to My Bookings",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/dashboard/myBookings");
        }
      });
    } catch (err) {
      Swal.fire(err.message, "Failed to book the package", "error");
    }
  };

  if (pkgLoading || guidesLoading) return <Loading />;
  if (!pkg)
    return <p className="text-center text-gray-500">Package not found.</p>;

  // Prepare options for React Select
  const guideOptions = guides.map((g) => ({
    value: g.guideInfo.email,
    label: `${g.guideInfo.name} - ${g.guideInfo.email}`,
  }));

  // Find currently selected option for React Select to show
  const selectedGuideOption = guideOptions.find(
    (option) => option.value === watchTourGuide
  ) || null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
      {/* Title & Short Description */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-3">{pkg.title}</h1>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto">
          {pkg.description.split(".")[0]}.
        </p>
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-3 md:grid-cols-6 grid-rows-2 gap-3 md:gap-4 mb-12 h-[450px]">
        {pkg.images[0] && (
          <img
            src={pkg.images[0]}
            alt="Gallery 1"
            className="col-span-3 row-span-2 object-cover w-full h-full rounded-xl shadow-md"
          />
        )}
        {pkg.images[1] && (
          <img
            src={pkg.images[1]}
            alt="Gallery 2"
            className="col-span-1 row-span-1 object-cover w-full h-full rounded-xl shadow-sm"
          />
        )}
        {pkg.images[2] && (
          <img
            src={pkg.images[2]}
            alt="Gallery 3"
            className="col-span-2 row-span-1 object-cover w-full h-full rounded-xl shadow-sm"
          />
        )}
        {pkg.images[3] && (
          <img
            src={pkg.images[3]}
            alt="Gallery 4"
            className="col-span-2 row-span-1 object-cover w-full h-full rounded-xl shadow-sm"
          />
        )}
        {pkg.images[4] && (
          <img
            src={pkg.images[4]}
            alt="Gallery 5"
            className="col-span-1 row-span-1 object-cover w-full h-full rounded-xl shadow-sm"
          />
        )}
        {pkg.images.slice(5).map((img, idx) => (
          <img
            key={idx + 5}
            src={img}
            alt={`Gallery ${idx + 6}`}
            className="hidden md:block col-span-1 row-span-1 object-cover w-full h-full rounded-xl shadow-sm"
          />
        ))}
      </div>

      {/* Info Sections */}
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

      {/* Tour Plan */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-primary mb-5">Tour Plan</h2>
        <div className="space-y-4">
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

      {/* Tour Guide List */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-primary mb-5">
          Meet Our Tour Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {guides.slice(0, 6).map((guide) => (
            <div
              key={guide._id}
              className="bg-white border shadow-sm rounded-lg p-3 space-y-3 text-center"
            >
              <img
                src={guide.guideInfo.photo}
                alt={guide.guideInfo.name}
                className="w-20 h-20 object-cover mx-auto rounded-full mb-2"
              />
              <h3 className="font-semibold text-lg text-primary">
                {guide.guideInfo.name}
              </h3>
              <p className="text-sm text-gray-600">{guide.guideInfo.email}</p>
              <button
                onClick={() => navigate(`/guide/${guide._id}`)}
                className="mt-2 btn btn-outline btn-primary hover:text-white btn-sm"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form */}
      <div className="border-t pt-8">
        <h2 className="text-3xl text-center font-semibold text-primary mb-8">
          Book This Package
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block mb-1 text-sm">Package Name</label>
              <input
                type="text"
                readOnly
                {...register("packageName")}
                className="input input-bordered w-full h-11"
                placeholder="Package Name"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Tourist Name</label>
              <input
                type="text"
                readOnly
                {...register("touristName")}
                className="input input-bordered w-full h-11"
                placeholder="Tourist Name"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Tourist Email</label>
              <input
                type="email"
                readOnly
                {...register("touristEmail")}
                className="input input-bordered w-full h-11"
                placeholder="Tourist Email"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Tourist Picture URL</label>
              <input
                type="text"
                readOnly
                {...register("touristImage")}
                className="input input-bordered w-full h-11"
                placeholder="Image URL"
              />
            </div>
            <div className="fieldset">
              <label className="block -mb-[2.8px] text-sm">Tour Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="input input-bordered w-full h-11"
                placeholderText="Pick a Date"
                required
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 text-sm">Select Tour Guide</label>
              <Select
                options={guideOptions}
                value={selectedGuideOption}
                onChange={(selectedOption) => {
                  setValue("tourGuide", selectedOption ? selectedOption.value : "");
                }}
                placeholder="Select a guide"
                isClearable
                classNamePrefix="react-select"
                styles={customSelectStyles}
              />
              {errors.tourGuide && (
                <p className="text-red-500 text-xs mt-1">
                  Please select a tour guide
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary text-white w-full mt-10"
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default PackageDetails;
