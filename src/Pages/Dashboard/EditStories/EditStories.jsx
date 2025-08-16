import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxios from "../../../Hooks/useAxios";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../../Components/Loading/Loading";

const EditStories = () => {
  const { storyId } = useParams();
  const { userEmail } = useAuth();
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [existingImages, setExistingImages] = useState([]);
  const [newImagesURLs, setNewImagesURLs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const cloudName = import.meta.env.VITE_cloudinary_cloud_name;
  const uploadPreset = import.meta.env.VITE_cloudinary_preset_name;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data: storyData, isLoading } = useQuery({
    queryKey: ["story", storyId, userEmail],
    queryFn: async () => {
      const res = await axiosInstance.get(`/stories/${storyId}`);
      return res.data;
    },
    enabled: !!storyId && !!userEmail,
  });

  useEffect(() => {
    if (storyData) {
      reset({
        title: storyData.title,
        description: storyData.description,
        location: storyData.location,
      });
      setExistingImages(storyData.images || []);
    }
  }, [storyData, reset]);

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

      setNewImagesURLs((prev) => [...prev, ...uploaded]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(`Image upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const handleRemoveNewImage = (index) => {
    setNewImagesURLs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStoryUpdate = async (data) => {
    if (existingImages.length + newImagesURLs.length === 0) {
      toast.error("Please have at least one image.");
      return;
    }

    const imagesToRemove = storyData.images.filter(
      (img) => !existingImages.includes(img)
    );

    const payload = {
      title: data.title,
      description: data.description,
      location: data.location,
      imagesToAdd: newImagesURLs,
      imagesToRemove,
    };

    setLoading(true);
    try {
      await axiosSecure.patch(
        `/stories/${storyId}?email=${userEmail}`,
        payload
      );
      Swal.fire("Success", "Story updated successfully!", "success");
      navigate("/dashboard/manageStories");
    } catch (err) {
      toast.error(`Failed to update story: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">
        Edit Your Story
      </h2>

      <form onSubmit={handleSubmit(handleStoryUpdate)} className="space-y-4">
        <input
          type="text"
          placeholder="Story Title"
          className="input input-bordered w-full"
          {...register("title", { required: true })}
        />
        {errors.title && (
          <p className="text-red-500 text-xs">Title is required.</p>
        )}

        <textarea
          placeholder="Description"
          className="textarea textarea-bordered w-full resize-none"
          rows={5}
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="text-red-500 text-xs">Description is required.</p>
        )}

        <input
          type="text"
          placeholder="Location"
          className="input input-bordered w-full"
          {...register("location", { required: true })}
        />
        {errors.location && (
          <p className="text-red-500 text-xs">Location is required.</p>
        )}

        {/* Existing Images */}
        <div>
          <label className="font-semibold block mb-1">Uploaded Images</label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {existingImages.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt={`existing-img-${i}`}
                  className="h-24 w-full object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(url)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload New Images */}
        <div>
          <label className="font-semibold block mb-1">Add New Images</label>
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
            {newImagesURLs.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt={`new-uploaded-${i}`}
                  className="h-24 w-full object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="btn w-full mt-8 btn-primary text-white"
            disabled={uploading || loading}
            type="submit"
          >
            {uploading || loading ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : (
              "Update Story"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStories;
