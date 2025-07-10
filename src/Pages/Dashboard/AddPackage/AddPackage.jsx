import React, { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const AddPackage = () => {
  const fileInputRef = useRef();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tourPlan: [{ day: "", activities: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tourPlan",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageURLs, setImageURLs] = useState([]);
  const { userEmail } = useAuth();

  const axiosSecure = useAxiosSecure();
  const imgbbKey = import.meta.env.VITE_imgbb_key;

  // Upload images in batches
  const handleImageUpload = async (files) => {
    if (!files.length) return;

    const totalImages = imageURLs.length + files.length;
    if (totalImages > 10) {
      toast.error("You can upload a maximum of 10 images.");
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("image", files[i]);

        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
          formData
        );

        uploaded.push(res.data.data.url);
      }

      setImageURLs((prev) => [...prev, ...uploaded]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = (index) => {
    setImageURLs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPakage = async (data) => {
    if (imageURLs.length < 5) {
      toast.error("Please upload at least 5 images before submitting.");
      return;
    }

    setLoading(true);

    const newPackage = {
      tourType: data.tourType,
      title: data.title,
      location: data.location,
      price: parseFloat(data.price),
      duration: data.duration,
      description: data.description,
      images: imageURLs,
      tourPlan: data.tourPlan,
    };

    try {
      await axiosSecure.post(`/packages?email=${userEmail}`, newPackage);
      toast.success("🎉 Package added successfully!");
      setImageURLs([]);
      reset();
    } catch (err) {
      toast.error(`Failed to add package: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6">
      <h2 className="text-3xl md:text-4xl text-center font-bold mb-2 text-primary">
        Add New Package
      </h2>
      <p className="text-center text-sm text-gray-600 mb-8 max-w-2xl mx-auto">
        Fill in the details below to create a new tour package. Please provide
        accurate information including the tour type, location, price, duration,
        and a detailed description. Upload between 5 to 10 high-quality images
        to showcase the package. You can also add a day-by-day tour plan to help
        travelers understand the itinerary.
      </p>
      <form onSubmit={handleSubmit(handleAddPakage)} className="space-y-4">
        <input
          type="text"
          placeholder="Tour Type (e.g. Adventure, Nature, Forest)"
          className="input input-bordered w-full"
          {...register("tourType", { required: true })}
        />
        {errors.tourType && (
          <p className="text-red-500 text-xs font-semibold">
            Tour Type is required.
          </p>
        )}

        <input
          type="text"
          placeholder="Trip Title"
          className="input input-bordered w-full"
          {...register("title", { required: true })}
        />
        {errors.title && (
          <p className="text-red-500 text-xs font-semibold">
            Title is required.
          </p>
        )}

        <input
          type="text"
          placeholder="Location"
          className="input input-bordered w-full"
          {...register("location", { required: true })}
        />
        {errors.location && (
          <p className="text-red-500 text-xs font-semibold">
            Location is required.
          </p>
        )}

        <input
          type="number"
          placeholder="Price (in BDT)"
          className="input input-bordered w-full"
          {...register("price", { required: true, min: 0 })}
        />
        {errors.price && (
          <p className="text-red-500 text-xs font-semibold">
            Enter a valid price.
          </p>
        )}

        <input
          type="text"
          placeholder="Duration (e.g. 5 Days 4 Nights)"
          className="input input-bordered w-full"
          {...register("duration", { required: true })}
        />
        {errors.duration && (
          <p className="text-red-500 text-xs font-semibold">
            Duration is required.
          </p>
        )}

        <textarea
          placeholder="Description"
          className="textarea textarea-bordered w-full resize-none"
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="text-red-500 text-xs font-semibold">
            Description is required.
          </p>
        )}

        {/* Image Upload Input + Previews */}
        <div>
          <label className="font-semibold block mb-1">
            Upload Images (5–10)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            className="file-input file-input-bordered w-full"
            disabled={uploading || imageURLs.length >= 10}
          />
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
            {imageURLs.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt={`uploaded-${i}`}
                  className="h-24 w-full object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded opacity-80 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Uploaded: {imageURLs.length} / 10
          </p>
        </div>

        {/* Tour Plan Inputs */}
        <div className="mt-4">
          <label className="block font-semibold mb-2">Tour Plan</label>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="mb-2 space-y-2 border p-4 rounded-lg"
            >
              <input
                type="text"
                placeholder={`Day ${index + 1}`}
                className="input input-bordered w-full"
                {...register(`tourPlan.${index}.day`, { required: true })}
              />
              <textarea
                placeholder="Activities"
                className="textarea textarea-bordered w-full"
                {...register(`tourPlan.${index}.activities`, {
                  required: true,
                })}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="btn btn-sm btn-error mt-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ day: "", activities: "" })}
            className="btn btn-sm btn-outline btn-primary"
          >
            + Add Day
          </button>
        </div>

        <div className="flex justify-end">
          <button
            className="btn btn-primary text-white"
            disabled={loading || uploading}
            type="submit"
          >
            {uploading || loading ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : (
              "Add Package"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPackage;
