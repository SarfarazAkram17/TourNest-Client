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
import PackageForm from "../PackageForm/PackageForm";
import { getErrorMessage, showSuccess } from "../../../utils/alerts";

const EditPackage = () => {
  useDocumentTitle("Edit package");
  const { packageId } = useParams();
  const { userEmail } = useAuth();
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const { data: pkg, isLoading, isError } = useQuery({
    queryKey: ["package", packageId],
    queryFn: async () => (await axiosInstance.get(`/packages/${packageId}`)).data,
    retry: false,
  });

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      await axiosSecure.patch(`/packages/${packageId}?email=${userEmail}`, payload);
      ["package", "all-packages", "manage-packages", "package-types", "randomPackages"].forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
      await showSuccess("Package updated", "Changes are live. Existing bookings keep the price they were made at.");
      navigate("/dashboard/managePackages");
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't update this package."));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !pkg) {
    return (
      <EmptyState title="Package not found" description="It may have been deleted.">
        <Link to="/dashboard/managePackages" className="btn btn-primary">
          Back to packages
        </Link>
      </EmptyState>
    );
  }

  return (
    <div>
      <Link to="/dashboard/managePackages" className="btn btn-ghost btn-sm -ml-3 mb-2">
        <LuArrowLeft size={16} aria-hidden="true" /> Manage packages
      </Link>
      <PageHeader title="Edit package" description={pkg.title} />
      <PackageForm initial={pkg} submitLabel="Save changes" onSubmit={handleSubmit} saving={saving} />
    </div>
  );
};

export default EditPackage;
