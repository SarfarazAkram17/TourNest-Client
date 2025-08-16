import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useUserRole from "../../../Hooks/useUserRole";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";

const AddStories = () => {
  const { user, userEmail } = useAuth();
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [uploading, setUploading] = useState(false);
  const [imageURLs, setImageURLs] = useState([]);
  const [loading, setLoading] = useState(false);

  const cloudName = import.meta.env.VITE_cloudinary_cloud_name;
  const uploadPreset = import.meta.env.VITE_cloudinary_preset_name;

  const handleImageUpload = async (files) => {
    if (!files.length) return;

    setUploading(true);
    try {
      const uploaded = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("upload_preset", uploadPreset);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );

        uploaded.push(res.data.secure_url);
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

  const handleAddStory = async (data) => {
    if (imageURLs.length === 0) {
      toast.error("Please upload at least 1 image before submitting.");
      return;
    }

    const newStory = {
      title: data.title,
      description: data.description,
      location: data.location,
      images: imageURLs,
      name: user?.displayName,
      email: userEmail,
      photo: user?.photoURL,
      role,
    };

    setLoading(true);
    try {
      await axiosSecure.post(`/stories?email=${userEmail}`, newStory);
      Swal.fire("Success", "🎉 Story added successfully!", "success");
      setImageURLs([]);
      reset();
      navigate("/dashboard/manageStories");
    } catch (err) {
      toast.error(`Failed to add story: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4">
      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4 text-primary">
        Share Your Story
      </h2>
      <p className="text-center text-sm text-gray-600 mb-8 max-w-2xl mx-auto">
        Add a travel story to inspire other tourists. You can upload multiple
        images and share your experience with location details.
      </p>

      <form onSubmit={handleSubmit(handleAddStory)} className="space-y-4">
        <input
          type="text"
          placeholder="Story Title"
          className="input input-bordered w-full"
          {...register("title", { required: true })}
        />
        {errors.title && (
          <p className="text-red-500 text-xs font-semibold">
            Title is required.
          </p>
        )}

        <textarea
          placeholder="Description"
          className="textarea textarea-bordered w-full resize-none"
          rows={5}
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="text-red-500 text-xs font-semibold">
            Description is required.
          </p>
        )}

        <input
          type="text"
          placeholder="Location (e.g., Cox’s Bazar)"
          className="input input-bordered w-full"
          {...register("location", { required: true })}
        />
        {errors.location && (
          <p className="text-red-500 text-xs font-semibold">
            Location is required.
          </p>
        )}

        <div>
          <label className="font-semibold block mb-1">Upload Images</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            className="file-input file-input-bordered w-full"
            disabled={uploading}
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
            Uploaded: {imageURLs.length} image
            {imageURLs.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex justify-end">
          <button
            className="btn w-full mt-8 btn-primary text-white"
            disabled={loading || uploading}
            type="submit"
          >
            {uploading || loading ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : (
              "Add Story"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStories;
