import { useState, useEffect, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import axios from "axios";
import { FiEdit3, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";

const ManageGuideProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();

  const [regions, setRegions] = useState([]);
  const [districtMap, setDistrictMap] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const [preview, setPreview] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);

  const previewUrlRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    data: guideInfo,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["guideInfo", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/guide-info?email=${userEmail}`);
      return res.data;
    },
    enabled: !!userEmail,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: "onChange",
  });

  // Use useWatch for region to prevent issues
  const selectedRegion = useWatch({ control, name: "region" });

  // Fetch regions and districts data once
  useEffect(() => {
    const fetchLocationData = async () => {
      const regionRes = await fetch("/regions.json");
      const regionData = await regionRes.json();
      setRegions(regionData);

      const districtRes = await fetch("/districts.json");
      const districtData = await districtRes.json();
      setDistrictMap(districtData);
    };

    fetchLocationData();
  }, []);

  useEffect(() => {
    if (guideInfo) {
      reset({
        ...guideInfo,
        languages: guideInfo.languages?.join(", "),
        region: { value: guideInfo.region, label: guideInfo.region },
        district: { value: guideInfo.district, label: guideInfo.district },
      });

      if (!isModalOpen) {
        setPreview(guideInfo.photo);
      }

      setSelectedFile(null);
    }
  }, [guideInfo, reset, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      setLocalPreview(preview);
    }
  }, [isModalOpen, preview]);

  useEffect(() => {
    if (!selectedRegion) return;

    const firstDistrict = districtMap[selectedRegion.value]?.[0];
    const currentDistrict = getValues("district")?.value;

    if (firstDistrict && currentDistrict !== firstDistrict) {
      reset((prev) => ({
        ...prev,
        district: { value: firstDistrict, label: firstDistrict },
      }));
    }
  }, [selectedRegion ,selectedRegion?.value, districtMap, reset, getValues]);

  const getDistrictOptions = () => {
    if (!selectedRegion) return [];
    return (
      districtMap[selectedRegion.value]?.map((d) => ({
        label: d,
        value: d,
      })) || []
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = URL.createObjectURL(file);
      setSelectedFile(file);
      setLocalPreview(previewUrlRef.current);
    }
  };

  const handleUpdateGuideInfo = async (data) => {
    setLoading(true);
    try {
      let imageUrl = guideInfo?.photo || "";

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_cloudinary_preset_name
        );

        const cloudinaryRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_cloudinary_cloud_name
          }/image/upload`,
          formData
        );
        imageUrl = cloudinaryRes.data.secure_url;
      }

      const updated = {
        ...data,
        region: data.region.value,
        district: data.district.value,
        photo: imageUrl,
        languages: data.languages.split(",").map((lang) => lang.trim()),
      };

      await axiosSecure.patch(`/users/guide-info?email=${userEmail}`, updated);
      toast.success("Guide profile updated!");
      setIsModalOpen(false);
      setSelectedFile(null);
      setPreview(imageUrl);
      await refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  const isUpdateDisabled =
    loading || (Object.keys(dirtyFields).length === 0 && selectedFile === null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-primary">
        Manage Guide Profile
      </h2>

      <div className="bg-white shadow p-6 rounded-lg">
        <div className="flex flex-col gap-6">
          <img
            src={preview}
            alt="Guide"
            className="w-40 h-40 rounded-full object-cover border-4 border-primary"
          />
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {guideInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {guideInfo.email}
            </p>
            <p>
              <strong>Phone:</strong> {guideInfo.phone}
            </p>
            <p>
              <strong>Region:</strong> {guideInfo.region}
            </p>
            <p>
              <strong>District:</strong> {guideInfo.district}
            </p>
            <p>
              <strong>Experience:</strong> {guideInfo.experience} years
            </p>
            <p>
              <strong>Languages:</strong> {guideInfo.languages?.join(", ")}
            </p>
            <p>
              <strong>Age:</strong> {guideInfo.age}
            </p>
            <p>
              <strong>Bio:</strong> {guideInfo.bio}
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-outline btn-primary mt-4 flex items-center gap-2"
            >
              <FiEdit3 /> Edit Guide Info
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => !loading && setIsModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex justify-center items-center px-4">
            <div className="bg-white p-6 rounded-lg max-w-xl w-full shadow-lg max-h-[90vh] overflow-y-auto relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                onClick={() => !loading && setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
              <h3 className="text-xl font-bold text-center mb-4">
                Update Guide Info
              </h3>

              {/* Form */}
              <form
                onSubmit={handleSubmit(handleUpdateGuideInfo)}
                className="space-y-4"
              >
                {/* Photo */}
                <div>
                  <label className="block mb-1 font-semibold">Photo</label>
                  <img
                    src={localPreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full mb-2 object-cover border border-gray-300"
                  />
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    id="photoUpload"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {/* Button to trigger file input */}
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("photoUpload").click()
                    }
                    className="btn btn-outline btn-primary"
                  >
                    Change Profile Image
                  </button>
                </div>

                {/* Name */}
                <div>
                  <label className="label font-semibold mt-4 mb-2 text-sm">
                    Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    className="input input-bordered w-full"
                    placeholder="Name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs font-semibold mt-2">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="label font-semibold mt-4 mb-2 text-sm">
                    Phone
                  </label>
                  <input
                    {...register("phone", { required: "Phone is required" })}
                    className="input input-bordered w-full"
                    placeholder="Phone"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs font-semibold mt-2">{errors.phone.message}</p>
                  )}
                </div>

                {/* Region */}
                <div>
                  <label className="label font-semibold mt-4 mb-2 text-sm">
                    Region
                  </label>
                  <Controller
                    name="region"
                    control={control}
                    rules={{ required: "Region is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={regions.map((r) => ({ value: r, label: r }))}
                        placeholder="Select Region"
                      />
                    )}
                  />
                  {errors.region && (
                    <p className="text-red-500 text-xs font-semibold mt-2">{errors.region.message}</p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="label font-semibold mt-4 mb-2 text-sm">
                    District
                  </label>
                  <Controller
                    name="district"
                    control={control}
                    rules={{ required: "District is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={getDistrictOptions()}
                        placeholder="Select District"
                        isDisabled={!selectedRegion}
                      />
                    )}
                  />
                  {errors.district && (
                    <p className="text-red-500 text-xs font-semibold mt-2">{errors.district.message}</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="label font-semibold mt-4 mb-2 text-sm">
                    Experience
                  </label>
                  <input
                    type="number"
                    {...register("experience", {
                      required: "Experience is required",
                    })}
                    className="input input-bordered w-full"
                    placeholder="Experience (years)"
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-xs font-semibold mt-2">{errors.experience.message}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="label font-semibold mt-4 mb-2 text-sm">
                    Age
                  </label>
                  <input
                    type="number"
                    {...register("age", {
                      required: "Age is required",
                      validate: (value) =>
                        value >= 18 || "Age must be at least 18",
                    })}
                    className="input input-bordered w-full"
                    placeholder="Age"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-xs font-semibold mt-2">{errors.age.message}</p>
                  )}
                </div>

                {/* Languages */}
                <div>
                  <label className="label font-semibold mt-4 mb-2 text-sm">
                    Languages
                  </label>
                  <input
                    {...register("languages", {
                      required: "Languages are required",
                    })}
                    className="input input-bordered w-full"
                    placeholder="Languages (comma-separated)"
                  />
                  {errors.languages && (
                    <p className="text-red-500 text-xs font-semibold mt-2">{errors.languages.message}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="label font-semibold mt-4 mb-2 text-sm">
                    Bio
                  </label>
                  <textarea
                    {...register("bio", { required: "Bio is required" })}
                    className="textarea textarea-bordered w-full"
                    placeholder="Short Bio"
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-xs font-semibold mt-2">{errors.bio.message}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-outline"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-white"
                    disabled={isUpdateDisabled}
                  >
                    {loading ? (
                      <span className="loading loading-spinner text-primary"></span>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageGuideProfile;
