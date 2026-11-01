import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import PageHeader from "../../../Components/UI/PageHeader";
import PackageForm from "../PackageForm/PackageForm";
import { getErrorMessage, showSuccess } from "../../../utils/alerts";

const AddPackage = () => {
  useDocumentTitle("Add package");
  const { userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      const res = await axiosSecure.post(`/packages?email=${userEmail}`, payload);
      ["all-packages", "manage-packages", "package-types", "adminStats", "randomPackages"].forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
      await showSuccess("Package published", "Travelers can now find and book this trip.");
      navigate(res.data.insertedId ? `/packages/${res.data.insertedId}` : "/dashboard/managePackages");
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't publish this package."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add a tour package"
        description="Describe the trip, add five photos and outline the day-by-day plan."
      />
      <PackageForm submitLabel="Publish package" onSubmit={handleSubmit} saving={saving} />
    </div>
  );
};

export default AddPackage;
