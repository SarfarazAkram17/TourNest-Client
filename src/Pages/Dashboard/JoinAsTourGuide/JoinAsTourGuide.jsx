import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Select from "react-select";
import { toast } from "react-toastify";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const JoinAsTourGuide = () => {
  const { user, userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const [regions, setRegions] = useState([]);
  const [districtMap, setDistrictMap] = useState({});
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      const regionRes = await fetch("/regions.json");
      const regionData = await regionRes.json();
      setRegions(regionData);

      const districtRes = await fetch("/districts.json");
      const districtData = await districtRes.json();
      setDistrictMap(districtData);
    };

    fetchData();
  }, []);

  const getDistrictOptions = () => {
    if (!selectedRegion) return [];
    return (
      districtMap[selectedRegion.value]?.map((district) => ({
        value: district,
        label: district,
      })) || []
    );
  };

  const onSubmit = async (data) => {
    if (!selectedRegion) {
      toast.error("Please select a Region.");
      return;
    }
    if (!selectedDistrict) {
      toast.error("Please select a District.");
      return;
    }

    setLoading(true);

    const applicationData = {
      name: user?.displayName || "",
      email: userEmail,
      phone: data.phone,
      applicationTitle: data.applicationTitle,
      reason: data.reason,
      cvLink: data.cvLink,
      region: selectedRegion.value,
      district: selectedDistrict.value,
      experience: data.experience,
      languages: data.languages.split(",").map((lang) => lang.trim()),
      bio: data.bio,
      age: parseInt(data.age, 10),
      photo: user?.photoURL,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post(`/applications?email=${userEmail}`, applicationData);
      if (res.data.insertedId) {
        reset();
        setSelectedRegion(null);
        setSelectedDistrict(null);

        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Waiting for admin approval.",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        reset();
        setSelectedRegion(null);
        setSelectedDistrict(null);
        toast.warn(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Join as a Tour Guide
      </h2>

      <div className="p-6 shadow-lg bg-white rounded-lg mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Application Title */}
          <div>
            <label htmlFor="applicationTitle" className="text-xs text-black/60 font-semibold mb-1 block">Application Title</label>
            <input
              id="applicationTitle"
              type="text"
              placeholder="Application Title"
              {...register("applicationTitle", { required: "Application Title is required" })}
              className={`input input-bordered w-full ${errors.applicationTitle ? "border-red-500" : ""}`}
            />
            {errors.applicationTitle && (
              <p className="text-red-500 text-xs mt-1">{errors.applicationTitle.message}</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="text-xs text-black/60 font-semibold mb-1 block">Reason</label>
            <textarea
              id="reason"
              placeholder="Why do you want to be a Tour Guide?"
              {...register("reason", { required: "Reason is required" })}
              className={`textarea textarea-bordered resize-none w-full ${errors.reason ? "border-red-500" : ""}`}
            ></textarea>
            {errors.reason && (
              <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* CV Link */}
          <div>
            <label htmlFor="cvLink" className="text-xs text-black/60 font-semibold mb-1 block">CV Link</label>
            <input
              id="cvLink"
              type="url"
              placeholder="CV Link (Google Drive or other)"
              {...register("cvLink", { required: "CV Link is required" })}
              className={`input input-bordered w-full ${errors.cvLink ? "border-red-500" : ""}`}
            />
            {errors.cvLink && (
              <p className="text-red-500 text-xs mt-1">{errors.cvLink.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="text-xs text-black/60 font-semibold mb-1 block">Phone</label>
            <input
              id="phone"
              type="number"
              placeholder="Phone Number"
              {...register("phone", { required: "Phone number is required" })}
              className={`input input-bordered w-full ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="text-xs text-black/60 font-semibold mb-1 block">Age</label>
            <input
              id="age"
              type="number"
              placeholder="Age (must be at least 18)"
              {...register("age", {
                required: "Age is required",
                valueAsNumber: true,
                validate: (value) => value >= 18 || "You must be at least 18 years old",
              })}
              className={`input input-bordered w-full ${errors.age ? "border-red-500" : ""}`}
              min={18}
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
            )}
          </div>

          {/* Region */}
          <div>
            <label className="text-xs text-black/60 font-semibold mb-1 block">Region</label>
            <Select
              options={regions.map((r) => ({ value: r, label: r }))}
              value={selectedRegion}
              onChange={(value) => {
                setSelectedRegion(value);
                setSelectedDistrict(null);
              }}
              placeholder="Select Region"
            />
          </div>

          {/* District */}
          <div>
            <label className="text-xs text-black/60 font-semibold mb-1 block">District</label>
            <Select
              options={getDistrictOptions()}
              value={selectedDistrict}
              onChange={setSelectedDistrict}
              placeholder="Select District"
              isDisabled={!selectedRegion}
            />
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="experience" className="text-xs text-black/60 font-semibold mb-1 block">Experience</label>
            <input
              id="experience"
              type="text"
              placeholder="Years of Experience"
              {...register("experience", {
                required: "Experience is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Experience must be a valid number",
                },
              })}
              className={`input input-bordered w-full ${errors.experience ? "border-red-500" : ""}`}
            />
            {errors.experience && (
              <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>
            )}
          </div>

          {/* Languages */}
          <div>
            <label htmlFor="languages" className="text-xs text-black/60 font-semibold mb-1 block">Languages</label>
            <input
              id="languages"
              type="text"
              placeholder="Languages (comma-separated)"
              {...register("languages", {
                required: "Languages are required",
                validate: (value) => value.trim() !== "" || "Languages cannot be empty",
              })}
              className={`input input-bordered w-full ${errors.languages ? "border-red-500" : ""}`}
            />
            {errors.languages && (
              <p className="text-red-500 text-xs mt-1">{errors.languages.message}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="text-xs text-black/60 font-semibold mb-1 block">Bio</label>
            <textarea
              id="bio"
              placeholder="Brief Bio"
              {...register("bio", { required: "Bio is required" })}
              className={`textarea textarea-bordered resize-none w-full ${errors.bio ? "border-red-500" : ""}`}
            ></textarea>
            {errors.bio && (
              <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary text-white w-full"
          >
            {loading ? (
              <span className="loading loading-spinner text-primary loading-md"></span>
            ) : (
              "Apply as Tour Guide"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinAsTourGuide;
