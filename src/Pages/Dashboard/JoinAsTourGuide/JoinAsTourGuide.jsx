import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LuClock, LuSend } from "react-icons/lu";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useLocations from "../../../Hooks/useLocations";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import PageHeader from "../../../Components/UI/PageHeader";
import FormField from "../../../Components/UI/FormField";
import Loading from "../../../Components/Loading/Loading";
import { showSuccess, getErrorMessage } from "../../../utils/alerts";
import { formatDate } from "../../../utils/format";

const JoinAsTourGuide = () => {
  useDocumentTitle("Become a guide");
  const { user, userEmail } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { regions, districts } = useLocations();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { region: "", district: "" } });

  const region = watch("region");
  const districtOptions = districts[region] || [];

  const { data: existing, isLoading } = useQuery({
    queryKey: ["myApplication", userEmail],
    queryFn: async () => (await axiosSecure.get(`/applications/mine?email=${userEmail}`)).data,
    enabled: !!userEmail,
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await axiosSecure.post(`/applications?email=${userEmail}`, {
        name: user?.displayName || "",
        email: userEmail,
        photo: user?.photoURL || "",
        phone: data.phone.trim(),
        applicationTitle: data.applicationTitle.trim(),
        reason: data.reason.trim(),
        cvLink: data.cvLink.trim(),
        region: data.region,
        district: data.district,
        experience: Number(data.experience),
        languages: data.languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        bio: data.bio.trim(),
        age: Number(data.age),
      });

      if (res.data.insertedId) {
        await showSuccess("Application submitted", "An admin will review it soon. You can check the status on this page.");
        queryClient.invalidateQueries({ queryKey: ["myApplication"] });
      } else {
        toast.info(res.data.message || "You have already applied.");
        queryClient.invalidateQueries({ queryKey: ["myApplication"] });
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;

  if (existing?.application) {
    const app = existing.application;
    return (
      <div>
        <PageHeader title="Become a guide" />
        <div className="surface mx-auto max-w-2xl p-6 text-center sm:p-10">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-warning/12 text-warning">
            <LuClock size={30} aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-xl font-bold">Your application is under review</h2>
          <p className="mt-2 text-muted">
            You applied on {formatDate(app.createdAt)} as <strong>{app.applicationTitle}</strong>. We'll
            update your account as soon as an admin decides. There's nothing else you need to do.
          </p>
          <Link to="/dashboard" className="btn btn-outline mt-6">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const field = (name) => ({ "aria-invalid": !!errors[name] });

  return (
    <div>
      <PageHeader
        title="Become a guide"
        description="Tell us about yourself. An admin reviews every application before you can host trips."
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <section className="surface p-5 sm:p-6">
          <h2 className="text-lg font-bold">About your application</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FormField label="Application title" htmlFor="applicationTitle" required error={errors.applicationTitle?.message} className="md:col-span-2">
              <input
                id="applicationTitle"
                className="input w-full"
                placeholder="e.g. Sundarbans wildlife guide with 6 years of experience"
                {...field("applicationTitle")}
                {...register("applicationTitle", { required: "Add a short title." })}
              />
            </FormField>
            <FormField label="Why do you want to be a guide?" htmlFor="reason" required error={errors.reason?.message} className="md:col-span-2">
              <textarea
                id="reason"
                rows={4}
                className="textarea w-full resize-none"
                {...field("reason")}
                {...register("reason", { required: "Tell us your motivation." })}
              />
            </FormField>
            <FormField label="CV link" htmlFor="cvLink" required hint="A public Google Drive, Dropbox or website link." error={errors.cvLink?.message} className="md:col-span-2">
              <input
                id="cvLink"
                type="url"
                className="input w-full"
                placeholder="https://"
                {...field("cvLink")}
                {...register("cvLink", {
                  required: "Add a link to your CV.",
                  pattern: { value: /^https?:\/\/\S+$/i, message: "Enter a full link starting with https://" },
                })}
              />
            </FormField>
          </div>
        </section>

        <section className="surface p-5 sm:p-6">
          <h2 className="text-lg font-bold">Your guide profile</h2>
          <p className="mt-1 text-sm text-muted">This information appears on your public guide profile once approved.</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FormField label="Phone" htmlFor="phone" required error={errors.phone?.message}>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="input w-full"
                placeholder="01XXXXXXXXX"
                {...field("phone")}
                {...register("phone", {
                  required: "Enter a phone number.",
                  pattern: { value: /^[+\d][\d\s-]{6,17}$/, message: "Enter a valid phone number." },
                })}
              />
            </FormField>
            <FormField label="Age" htmlFor="age" required error={errors.age?.message}>
              <input
                id="age"
                type="number"
                inputMode="numeric"
                className="input w-full"
                {...field("age")}
                {...register("age", {
                  required: "Enter your age.",
                  validate: (v) => Number(v) >= 18 || "You must be at least 18.",
                })}
              />
            </FormField>
            <FormField label="Region" htmlFor="region" required error={errors.region?.message}>
              <select
                id="region"
                className="select w-full"
                {...field("region")}
                {...register("region", {
                  required: "Select your region.",
                  onChange: () => setValue("district", ""),
                })}
              >
                <option value="">Select region</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="District" htmlFor="district" required error={errors.district?.message}>
              <select
                id="district"
                className="select w-full"
                disabled={!region}
                {...field("district")}
                {...register("district", { required: "Select your district." })}
              >
                <option value="">{region ? "Select district" : "Choose a region first"}</option>
                {districtOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Years of experience" htmlFor="experience" required error={errors.experience?.message}>
              <input
                id="experience"
                type="number"
                inputMode="numeric"
                min={0}
                className="input w-full"
                {...field("experience")}
                {...register("experience", {
                  required: "Enter your experience.",
                  validate: (v) => (Number(v) >= 0 && Number(v) <= 60) || "Enter a number between 0 and 60.",
                })}
              />
            </FormField>
            <FormField label="Languages" htmlFor="languages" required hint="Separate with commas, e.g. Bangla, English" error={errors.languages?.message}>
              <input
                id="languages"
                className="input w-full"
                {...field("languages")}
                {...register("languages", {
                  required: "List the languages you speak.",
                  validate: (v) => v.split(",").some((l) => l.trim()) || "List at least one language.",
                })}
              />
            </FormField>
            <FormField label="Short bio" htmlFor="bio" required error={errors.bio?.message} className="md:col-span-2">
              <textarea
                id="bio"
                rows={4}
                className="textarea w-full resize-none"
                {...field("bio")}
                {...register("bio", { required: "Write a short bio." })}
              />
            </FormField>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full sm:w-auto">
            {submitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <LuSend size={18} aria-hidden="true" /> Submit application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JoinAsTourGuide;
