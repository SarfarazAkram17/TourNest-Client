import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { LuCalendarDays, LuMail, LuPencil, LuShield } from "react-icons/lu";
import useAuth from "../../../Hooks/useAuth";
import useUserRole from "../../../Hooks/useUserRole";
import useDocumentTitle from "../../../Hooks/useDocumentTitle";
import PageHeader from "../../../Components/UI/PageHeader";
import Avatar from "../../../Components/UI/Avatar";
import Modal from "../../../Components/UI/Modal";
import FormField from "../../../Components/UI/FormField";
import { RoleBadge } from "../../../Components/UI/StatusBadge";
import { uploadImage } from "../../../utils/cloudinary";
import { formatDate } from "../../../utils/format";

const ManageProfile = () => {
  useDocumentTitle("My profile");
  const { user, userEmail, updateUserProfile } = useAuth();
  const { role, roleLoading } = useUserRole();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const openEditor = () => {
    setName(user?.displayName || "");
    setPreview(user?.photoURL || null);
    setFile(null);
    setOpen(true);
  };

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

  const trimmed = name.trim();
  const unchanged = trimmed === (user?.displayName || "") && !file;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!trimmed) return;
    setSaving(true);
    try {
      const photoURL = file ? await uploadImage(file) : user.photoURL;
      await updateUserProfile({ displayName: trimmed, photoURL });
      toast.success("Profile updated.");
      setOpen(false);
    } catch (error) {
      toast.error(error.message || "We couldn't update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const joined = user?.metadata?.creationTime;
  const lastSignIn = user?.metadata?.lastSignInTime;

  return (
    <div>
      <PageHeader title="My profile" description="How you appear to guides, travelers and the community." />

      <div className="surface overflow-hidden">
        <div className="h-28 bg-linear-to-r from-secondary/80 via-secondary/50 to-primary/70 sm:h-36" aria-hidden="true" />
        <div className="px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <Avatar src={user?.photoURL} name={user?.displayName} size="xl" className="ring-4 ring-base-100" />
            <button type="button" onClick={openEditor} className="btn btn-primary self-start sm:self-auto">
              <LuPencil size={16} aria-hidden="true" /> Edit profile
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-bold tracking-tight">{user?.displayName}</h2>
            {!roleLoading && role !== "user" && <RoleBadge role={role} />}
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="surface-tint flex items-center gap-3 p-4">
              <LuMail size={20} className="shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-xs text-muted">Email</dt>
                <dd className="truncate text-sm font-semibold">{userEmail}</dd>
              </div>
            </div>
            <div className="surface-tint flex items-center gap-3 p-4">
              <LuShield size={20} className="shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-xs text-muted">Account type</dt>
                <dd className="text-sm font-semibold capitalize">{roleLoading ? "..." : role}</dd>
              </div>
            </div>
            <div className="surface-tint flex items-center gap-3 p-4">
              <LuCalendarDays size={20} className="shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-xs text-muted">Member since</dt>
                <dd className="text-sm font-semibold">{formatDate(joined)}</dd>
              </div>
            </div>
            <div className="surface-tint flex items-center gap-3 p-4">
              <LuCalendarDays size={20} className="shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-xs text-muted">Last sign-in</dt>
                <dd className="text-sm font-semibold">{formatDate(lastSignIn)}</dd>
              </div>
            </div>
          </dl>

          {!roleLoading && role === "tourist" && (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary/6 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold">Know your region well?</p>
                <p className="text-sm text-muted">Apply to host travelers as a local guide.</p>
              </div>
              <Link to="/dashboard/joinAsTourGuide" className="btn btn-primary btn-sm self-start sm:self-auto">
                Become a guide
              </Link>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => !saving && setOpen(false)}
        title="Edit profile"
        size="sm"
        footer={
          <>
            <button type="button" className="btn btn-ghost" disabled={saving} onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              type="submit"
              form="profile-form"
              className="btn btn-primary"
              disabled={saving || !trimmed || unchanged}
            >
              {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save changes"}
            </button>
          </>
        }
      >
        <form id="profile-form" onSubmit={handleSave} className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar src={preview} name={name} size="xl" />
            <div>
              <label htmlFor="profileImage" className="btn btn-outline btn-sm cursor-pointer">
                Change photo
              </label>
              <input id="profileImage" type="file" accept="image/*" className="sr-only" onChange={handleFile} />
              <p className="mt-2 text-xs text-muted">JPG or PNG, up to 10 MB.</p>
            </div>
          </div>
          <FormField label="Full name" htmlFor="profile-name" error={!trimmed ? "Name can't be empty." : ""}>
            <input
              id="profile-name"
              className="input w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </FormField>
        </form>
      </Modal>
    </div>
  );
};

export default ManageProfile;
