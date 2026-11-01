import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useUserRole from "../../../Hooks/useUserRole";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import PageHeader from "../../../Components/UI/PageHeader";
import StoryForm from "../StoryForm/StoryForm";
import { getErrorMessage, showSuccess } from "../../../utils/alerts";

const AddStories = () => {
  useDocumentTitle("Add story");
  const { user, userEmail } = useAuth();
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data, images) => {
    setSaving(true);
    try {
      await axiosSecure.post(`/stories?email=${userEmail}`, {
        title: data.title,
        description: data.description,
        location: data.location,
        images,
        name: user?.displayName,
        email: userEmail,
        photo: user?.photoURL,
        role,
      });
      queryClient.invalidateQueries({ queryKey: ["my-stories"] });
      queryClient.invalidateQueries({ queryKey: ["community-stories"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      await showSuccess("Story published", "It's now visible on the Community page.");
      navigate("/dashboard/manageStories");
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't publish your story."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Share your story"
        description="Inspire other travelers with what you saw, ate and learned along the way."
      />
      <StoryForm submitLabel="Publish story" onSubmit={handleSubmit} saving={saving} />
    </div>
  );
};

export default AddStories;
