import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LuBriefcase, LuCalendarDays, LuLanguages, LuMapPin, LuPencil, LuPhone, LuUserRound } from "react-icons/lu";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useLocations from "../../../Hooks/useLocations";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import PageHeader from "../../../Components/UI/PageHeader";
import Avatar from "../../../Components/UI/Avatar";
import Modal from "../../../Components/UI/Modal";
import FormField from "../../../Components/UI/FormField";
import Loading from "../../../Components/Loading/Loading";
import { uploadImage } from "../../../utils/cloudinary";
import { getErrorMessage } from "../../../utils/alerts";
import { formatDate } from "../../../utils/format";

const Fact = ({ icon: Icon, label, children }) => (
  <div className="surface-tint flex items-start gap-3 p-4">
    <Icon size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
    <div className="min-w-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="break-words text-sm font-semibold">{children}</dd>
    </div>
  </div>
);

const ManageGuideProfile = () => {
  useDocumentTitle("Guide profile");
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();
  const { regions, districts } = useLocations();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: info, isLoading, refetch } = useQuery({
    queryKey: ["guideInfo", userEmail],
    queryFn: async () => (await axiosSecure.get(`/users/guide-info?email=${userEmail}`)).data,
    enabled: !!userEmail,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm();

  const region = watch("region");
  const districtOptions = districts[region] || [];

  useEffect(() => {
    if (open && info) {
      reset({
        name: info.name,
        phone: info.phone,
        region: info.region,
        district: info.district,
        experience: info.experience,
        age: info.age,
        languages: (info.languages || []).join(", "),
        bio: info.bio,
      });
      setPreview(info.photo);
      setFile(null);
    }
  }, [open, info, reset]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const photo = file ? await uploadImage(file) : info.photo;
      await axiosSecure.patch(`/users/guide-info?email=${userEmail}`, {
        name: data.name.trim(),
        phone: String(data.phone).trim(),
        region: data.region,
        district: data.district,
        experience: Number(data.experience),
        age: Number(data.age),
        bio: data.bio.trim(),
        languages: data.languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        photo,
      });
      toast.success("Guide profile updated.");
      setOpen(false);
      await refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <Loading />;
  if (!info) return null;

  return (
    <div>
      <PageHeader
        title="Guide profile"
        description="This is what travelers see before they choose you as their guide."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
            <LuPencil size={16} aria-hidden="true" /> Edit profile
          </button>
        }
      />

      <div className="surface p-5 sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
          <Avatar src={info.photo} name={info.name} size="xl" />
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold tracking-tight">{info.name}</h2>
            <p className="mt-1 text-muted">{[info.district, info.region].filter(Boolean).join(", ")}</p>
            <p className="mt-3 max-w-2xl">{info.bio}</p>
          </div>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <Fact icon={LuBriefcase} label="Experience">
            {info.experience} {Number(info.experience) === 1 ? "year" : "years"}
          </Fact>
          <Fact icon={LuLanguages} label="Languages">
            <span className="capitalize">{(info.languages || []).join(", ")}</span>
          </Fact>
          <Fact icon={LuPhone} label="Phone">
            {info.phone}
          </Fact>
          <Fact icon={LuUserRound} label="Age">
            {info.age}
          </Fact>
          <Fact icon={LuMapPin} label="Location">
            {[info.district, info.region].filter(Boolean).join(", ")}
          </Fact>
          <Fact icon={LuCalendarDays} label="Guiding since">
            {formatDate(info.tourGuideAt)}
          </Fact>
        </dl>
      </div>

      <p className="mt-4 text-sm text-muted">
        Want to see it as a traveler would?{" "}
        <Link to="/allTrips" className="font-semibold text-primary underline-offset-4 hover:underline">
          Browse trips
        </Link>{" "}
        and open any guide card.
      </p>

      <Modal
        open={open}
        onClose={() => !saving && setOpen(false)}
        title="Edit guide profile"
        size="lg"
        footer={
          <>
            <button type="button" className="btn btn-ghost" disabled={saving} onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              type="submit"
              form="guide-form"
              className="btn btn-primary"
              disabled={saving || (!isDirty && !file)}
            >
              {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save changes"}
            </button>
          </>
        }
      >
        <form id="guide-form" onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 md:grid-cols-2">
          <div className="flex items-center gap-4 md:col-span-2">
            <Avatar src={preview} name={info.name} size="xl" />
            <div>
              <label htmlFor="guidePhoto" className="btn btn-outline btn-sm cursor-pointer">
                Change photo
              </label>
              <input id="guidePhoto" type="file" accept="image/*" className="sr-only" onChange={handleFile} />
            </div>
          </div>

          <FormField label="Name" htmlFor="g-name" required error={errors.name?.message}>
            <input id="g-name" className="input w-full" {...register("name", { required: "Name is required." })} />
          </FormField>
          <FormField label="Phone" htmlFor="g-phone" required error={errors.phone?.message}>
            <input id="g-phone" type="tel" className="input w-full" {...register("phone", { required: "Phone is required." })} />
          </FormField>
          <FormField label="Region" htmlFor="g-region" required error={errors.region?.message}>
            <select
              id="g-region"
              className="select w-full"
              {...register("region", {
                required: "Select a region.",
                onChange: () => setValue("district", "", { shouldDirty: true }),
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
          <FormField label="District" htmlFor="g-district" required error={errors.district?.message}>
            <select
              id="g-district"
              className="select w-full"
              disabled={!region}
              {...register("district", { required: "Select a district." })}
            >
              <option value="">Select district</option>
              {districtOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Experience (years)" htmlFor="g-exp" required error={errors.experience?.message}>
            <input
              id="g-exp"
              type="number"
              min={0}
              className="input w-full"
              {...register("experience", {
                required: "Enter your experience.",
                validate: (v) => Number(v) >= 0 || "Must be 0 or more.",
              })}
            />
          </FormField>
          <FormField label="Age" htmlFor="g-age" required error={errors.age?.message}>
            <input
              id="g-age"
              type="number"
              className="input w-full"
              {...register("age", {
                required: "Enter your age.",
                validate: (v) => Number(v) >= 18 || "Age must be at least 18.",
              })}
            />
          </FormField>
          <FormField label="Languages" htmlFor="g-lang" required hint="Separate with commas" error={errors.languages?.message} className="md:col-span-2">
            <input id="g-lang" className="input w-full" {...register("languages", { required: "List at least one language." })} />
          </FormField>
          <FormField label="Bio" htmlFor="g-bio" required error={errors.bio?.message} className="md:col-span-2">
            <textarea id="g-bio" rows={4} className="textarea w-full resize-none" {...register("bio", { required: "Write a short bio." })} />
          </FormField>
        </form>
      </Modal>
    </div>
  );
};

export default ManageGuideProfile;
