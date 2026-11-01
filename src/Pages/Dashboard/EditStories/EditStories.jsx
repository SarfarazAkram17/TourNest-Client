import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LuArrowLeft } from "react-icons/lu";
import useAuth from "../../../Hooks/useAuth";
import useAxios from "../../../Hooks/useAxios";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import PageHeader from "../../../Components/UI/PageHeader";
import Loading from "../../../Components/Loading/Loading";
import EmptyState from "../../../Components/UI/EmptyState";
import StoryForm from "../StoryForm/StoryForm";
import { getErrorMessage, showSuccess } from "../../../utils/alerts";

const EditStories = () => {
  useDocumentTitle("Edit story");
  const { storyId } = useParams();
  const { userEmail } = useAuth();
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const { data: story, isLoading, isError } = useQuery({
    queryKey: ["story", storyId],
    queryFn: async () => (await axiosInstance.get(`/stories/${storyId}`)).data,
    enabled: !!storyId,
    retry: false,
  });

  const handleSubmit = async (data, images) => {
    const imagesToRemove = story.images.filter((img) => !images.includes(img));
    const imagesToAdd = images.filter((img) => !story.images.includes(img));

    setSaving(true);
    try {
      await axiosSecure.patch(`/stories/${storyId}?email=${userEmail}`, {
        title: data.title,
        description: data.description,
        location: data.location,
        imagesToAdd,
        imagesToRemove,
      });
      ["my-stories", "community-stories", "story"].forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
      await showSuccess("Story updated");
      navigate("/dashboard/manageStories");
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't update your story."));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !story) {
    return (
      <EmptyState title="Story not found" description="It may have been deleted.">
        <Link to="/dashboard/manageStories" className="btn btn-primary">
          Back to my stories
        </Link>
      </EmptyState>
    );
  }

  return (
    <div>
      <Link to="/dashboard/manageStories" className="btn btn-ghost btn-sm -ml-3 mb-2">
        <LuArrowLeft size={16} aria-hidden="true" /> My stories
      </Link>
      <PageHeader title="Edit story" description="Update the text or swap photos. Changes go live immediately." />
      <StoryForm initial={story} submitLabel="Save changes" onSubmit={handleSubmit} saving={saving} />
    </div>
  );
};

export default EditStories;
