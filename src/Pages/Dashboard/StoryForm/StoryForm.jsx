import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormField from "../../../Components/UI/FormField";
import ImageUploader from "../../../Components/UI/ImageUploader";

/** Shared create / edit form for travel stories. */
const StoryForm = ({ initial, submitLabel, onSubmit, saving }) => {
  const [images, setImages] = useState(initial?.images || []);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initial?.title || "",
      location: initial?.location || "",
      description: initial?.description || "",
    },
  });

  useEffect(() => {
    if (initial) {
      reset({ title: initial.title, location: initial.location, description: initial.description });
      setImages(initial.images || []);
    }
  }, [initial, reset]);

  const submit = (data) => {
    if (images.length === 0) {
      setImageError("Add at least one photo to your story.");
      return;
    }
    setImageError("");
    onSubmit({ ...data, title: data.title.trim(), location: data.location.trim(), description: data.description.trim() }, images);
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6">
      <section className="surface p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Title" htmlFor="story-title" required error={errors.title?.message} className="md:col-span-2">
            <input id="story-title" className="input w-full" placeholder="Give your story a headline" {...register("title", { required: "Add a title." })} />
          </FormField>
          <FormField label="Location" htmlFor="story-location" required error={errors.location?.message} className="md:col-span-2">
            <input id="story-location" className="input w-full" placeholder="e.g. Cox's Bazar" {...register("location", { required: "Add a location." })} />
          </FormField>
          <FormField label="Your story" htmlFor="story-desc" required error={errors.description?.message} className="md:col-span-2">
            <textarea
              id="story-desc"
              rows={9}
              className="textarea w-full"
              placeholder="What did you see, eat and feel? What would you tell the next traveler?"
              {...register("description", {
                required: "Write your story.",
                minLength: { value: 30, message: "Tell us a little more (at least 30 characters)." },
              })}
            />
          </FormField>
        </div>
      </section>

      <section className="surface p-5 sm:p-6">
        <ImageUploader
          value={images}
          onChange={(next) => {
            setImages(next);
            if (next.length) setImageError("");
          }}
          max={10}
          label="Photos"
          helper="Up to 10 photos. The first one becomes the cover."
          disabled={saving}
        />
        {imageError && (
          <p role="alert" className="mt-3 text-sm font-medium text-error">
            {imageError}
          </p>
        )}
      </section>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn btn-primary btn-lg w-full sm:w-auto">
          {saving ? <span className="loading loading-spinner loading-sm"></span> : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default StoryForm;
