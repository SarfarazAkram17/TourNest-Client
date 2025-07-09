import React, { useState, useEffect } from "react";
import { FiEdit3, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import useAuth from "../../../Hooks/useAuth";
import userImage from "../../../assets/image-upload-icon.png";

const ManageProfile = () => {
  const { user, updateUserProfile } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Set the initial preview URL
  useEffect(() => {
    if (user?.photoURL && !preview) {
      setPreview(user.photoURL);
    }
  }, [user?.photoURL, preview]);

  // Clean up blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Open the modal for editing profile
  const handleEditClick = () => {
    setFormData({ name: user?.displayName || "" });
    setPreview(user?.photoURL || null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle profile update (name and photo)
  const handleUpdate = async () => {
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!preview) {
      toast.error("Please select a profile image");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = user.photoURL;
      let nameToUpdate = user.displayName;

      // Upload new image if changed
      if (selectedFile) {
        const imgbbKey = import.meta.env.VITE_imgbb_key;
        const imageData = new FormData();
        imageData.append("image", selectedFile);

        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
          imageData
        );

        if (!res.data.success) {
          toast.error("Image upload failed");
          setLoading(false);
          return;
        }
        imageUrl = res.data.data.url;
      }

      // Update name if changed
      if (trimmedName !== user.displayName) {
        nameToUpdate = trimmedName;
      }

      // Update Firebase user profile
      await updateUserProfile({
        displayName: nameToUpdate,
        photoURL: imageUrl,
      });

      toast.success("Profile updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Disable the Save button if no changes are made
  const isSaveDisabled =
    formData.name.trim() === user?.displayName && preview === user?.photoURL;

  return (
    <div className="max-w-2xl mx-auto p-6 shadow-lg bg-white rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-primary">
        Welcome back, {user?.displayName} 👋
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        <img
          src={user?.photoURL}
          alt="Profile"
          className="w-36 h-36 rounded-full object-cover border-4 border-primary shadow"
        />
        <div className="flex-1 space-y-3">
          <p>
            <span className="font-semibold">Name:</span> {user?.displayName}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user?.email}
          </p>
          <button
            onClick={handleEditClick}
            className="btn btn-outline btn-primary mt-4 flex items-center gap-2"
          >
            <FiEdit3 />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Modal for editing profile */}
      {isModalOpen && (
        <>
          {/* Blur background */}
          <div
            className="fixed inset-0 z-40 backdrop-blur-md"
            onClick={() => !loading && setIsModalOpen(false)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border rounded-lg max-w-md w-full p-8 relative shadow-xl">
              <button
                onClick={() => !loading && setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition"
                aria-label="Close modal"
                disabled={loading}
              >
                <FiX size={26} />
              </button>

              <h3 className="text-2xl font-semibold mb-6 text-center">
                Edit Profile
              </h3>

              <div className="flex flex-col items-start mb-4">
                {/* Profile Image */}
                <label
                  htmlFor="profileImage"
                  className="cursor-pointer block w-32 h-32 rounded-full border-2 border-primary overflow-hidden mb-2"
                >
                  <img
                    src={preview || userImage}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </label>

                {/* Change Image Button */}
                <button
                  onClick={() =>
                    document.getElementById("profileImage").click()
                  }
                  className="btn bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white"
                >
                  Change Profile Photo
                </button>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {!preview && (
                  <p className="text-red-500 text-center font-semibold mb-4">
                    Profile image is required.
                  </p>
                )}
              </div>

              <label className="label font-semibold mt-4 mb-2">Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              {!formData.name.trim() && (
                <p className="text-red-500 text-sm font-semibold mt-2">
                  Name is required.
                </p>
              )}

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => !loading && setIsModalOpen(false)}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="btn btn-primary text-white"
                  disabled={
                    loading ||
                    !formData.name.trim() ||
                    !preview ||
                    isSaveDisabled
                  }
                >
                  {loading ? (
                    <span className="loading loading-spinner text-primary"></span>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProfile;
