import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import useAxios from "../../../Hooks/useAxios";
import FormField from "../../../Components/UI/FormField";
import ImageUploader from "../../../Components/UI/ImageUploader";
import PackageCard from "../../../Components/Shared/PackageCard";

const REQUIRED_IMAGES = 5;

const emptyValues = { tourPlan: [{ activities: "" }] };

const toFormValues = (pkg) => ({
  title: pkg.title,
  location: pkg.location,
  tourType: pkg.tourType,
  duration: pkg.duration,
  price: pkg.price,
  description: pkg.description,
  tourPlan: (pkg.tourPlan?.length ? pkg.tourPlan : emptyValues.tourPlan).map((p) => ({
    activities: p.activities,
  })),
});

/** Shared create / edit form for tour packages (with live preview). */
const PackageForm = ({ initial, submitLabel, onSubmit, saving }) => {
  const axiosInstance = useAxios();
  const [images, setImages] = useState(initial?.images || []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initial ? toFormValues(initial) : emptyValues,
    mode: "onTouched",
  });
  const minImages = initial ? 1 : REQUIRED_IMAGES; // older packages may have fewer photos
  const imagesOk = images.length >= minImages && images.length <= REQUIRED_IMAGES;
  const { fields, append, remove } = useFieldArray({ control, name: "tourPlan" });

  useEffect(() => {
    if (initial) {
      reset(toFormValues(initial));
      setImages(initial.images || []);
    }
  }, [initial, reset]);

  const { data: types = [] } = useQuery({
    queryKey: ["package-types"],
    queryFn: async () => (await axiosInstance.get("/packages/types")).data,
  });

  const values = watch();
  const preview = {
    _id: "preview",
    title: values.title || "Your trip title",
    location: values.location || "Destination",
    tourType: values.tourType || "Trip type",
    duration: values.duration || "Duration",
    price: Number(values.price) || 0,
    images: images.length ? images : [],
  };

  const submit = (data) => {
    if (!imagesOk) {
      toast.error(
        minImages === REQUIRED_IMAGES
          ? `Upload exactly ${REQUIRED_IMAGES} photos before saving.`
          : `Keep between 1 and ${REQUIRED_IMAGES} photos.`
      );
      return;
    }
    onSubmit({
      tourType: data.tourType.trim(),
      title: data.title.trim(),
      location: data.location.trim(),
      price: Number(data.price),
      duration: data.duration.trim(),
      description: data.description.trim(),
      images,
      tourPlan: data.tourPlan.map((p, i) => ({ day: `Day ${i + 1}`, activities: p.activities.trim() })),
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-6">
          <section className="surface p-5 sm:p-6">
            <h2 className="text-lg font-bold">Trip details</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <FormField label="Trip title" htmlFor="title" required error={errors.title?.message} className="md:col-span-2">
                <input id="title" className="input w-full" placeholder="e.g. Sajek Valley weekend escape" {...register("title", { required: "Add a title." })} />
              </FormField>
              <FormField label="Location" htmlFor="location" required error={errors.location?.message}>
                <input id="location" className="input w-full" placeholder="e.g. Sajek, Rangamati" {...register("location", { required: "Add a location." })} />
              </FormField>
              <FormField label="Trip type" htmlFor="tourType" required error={errors.tourType?.message}>
                <input
                  id="tourType"
                  list="trip-types"
                  className="input w-full"
                  placeholder="e.g. Adventure"
                  {...register("tourType", { required: "Add a trip type." })}
                />
                <datalist id="trip-types">
                  {types.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </FormField>
              <FormField label="Duration" htmlFor="duration" required error={errors.duration?.message}>
                <input id="duration" className="input w-full" placeholder="e.g. 3 days, 2 nights" {...register("duration", { required: "Add a duration." })} />
              </FormField>
              <FormField label="Price (BDT)" htmlFor="price" required error={errors.price?.message}>
                <input
                  id="price"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  className="input w-full"
                  {...register("price", {
                    required: "Add a price.",
                    validate: (v) => Number(v) > 0 || "Price must be more than 0.",
                  })}
                />
              </FormField>
              <FormField label="Description" htmlFor="description" required error={errors.description?.message} className="md:col-span-2">
                <textarea
                  id="description"
                  rows={5}
                  className="textarea w-full resize-none"
                  placeholder="What makes this trip special? What's included?"
                  {...register("description", { required: "Add a description." })}
                />
              </FormField>
            </div>
          </section>

          <section className="surface p-5 sm:p-6">
            <h2 className="text-lg font-bold">Photos</h2>
            <p className="mb-5 mt-1 text-sm text-muted">The first photo is used as the cover.</p>
            <ImageUploader
              value={images}
              onChange={setImages}
              max={REQUIRED_IMAGES}
              label="Trip photos"
              helper={minImages === REQUIRED_IMAGES ? `Upload exactly ${REQUIRED_IMAGES} photos.` : `Up to ${REQUIRED_IMAGES} photos.`}
              disabled={saving}
            />
          </section>

          <section className="surface p-5 sm:p-6">
            <h2 className="text-lg font-bold">Day-by-day plan</h2>
            <ol className="mt-5 space-y-4">
              {fields.map((field, index) => (
                <li key={field.id} className="surface-tint p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="font-bold">Day {index + 1}</p>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="btn btn-ghost btn-sm text-error"
                        aria-label={`Remove day ${index + 1}`}
                      >
                        <LuTrash2 size={16} aria-hidden="true" /> Remove
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    aria-label={`Activities for day ${index + 1}`}
                    aria-invalid={!!errors.tourPlan?.[index]?.activities}
                    className="textarea w-full resize-none"
                    placeholder="What happens on this day?"
                    {...register(`tourPlan.${index}.activities`, { required: "Describe this day." })}
                  />
                  {errors.tourPlan?.[index]?.activities && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-error">
                      {errors.tourPlan[index].activities.message}
                    </p>
                  )}
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => append({ activities: "" })} className="btn btn-outline btn-sm mt-4">
              <LuPlus size={16} aria-hidden="true" /> Add another day
            </button>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !imagesOk}
              className="btn btn-primary btn-lg w-full sm:w-auto"
            >
              {saving ? <span className="loading loading-spinner loading-sm"></span> : submitLabel}
            </button>
          </div>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <p className="mb-3 text-sm font-semibold text-muted">Live preview</p>
            <div className="pointer-events-none" aria-hidden="true">
              <PackageCard pkg={preview} />
            </div>
          </div>
        </aside>
    </form>
  );
};

export default PackageForm;
