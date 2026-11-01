import { useState } from "react";
import { Link, useParams } from "react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { LuBriefcase, LuCalendarDays, LuLanguages, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import useAxios from "../../Hooks/useAxios";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import Loading from "../../Components/Loading/Loading";
import StoryCard from "../../Components/Shared/StoryCard";
import Avatar from "../../Components/UI/Avatar";
import Pagination from "../../Components/UI/Pagination";
import EmptyState from "../../Components/UI/EmptyState";
import { formatDate } from "../../utils/format";

const Fact = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon size={18} aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="text-xs text-muted">{label}</p>
      <div className="break-words text-sm font-semibold">{children}</div>
    </div>
  </div>
);

const TourGuideProfile = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const [page, setPage] = useState(1);

  const { data: guide, isLoading, isError } = useQuery({
    queryKey: ["tourGuide", id],
    queryFn: async () => (await axiosInstance.get(`/users/tour-guide/${id}`)).data,
    retry: false,
  });
  const info = guide?.guideInfo;
  useDocumentTitle(info?.name || "Tour guide");

  const { data: storyData, isLoading: storiesLoading } = useQuery({
    queryKey: ["tourGuide-stories", info?.email, page],
    queryFn: async () =>
      (await axiosInstance.get("/stories", { params: { email: info.email, page } })).data,
    placeholderData: keepPreviousData,
    enabled: !!info?.email,
  });

  if (isLoading) return <Loading label="Loading guide profile" />;
  if (isError || !info) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Guide not found" description="This profile may no longer be available.">
          <Link to="/" className="btn btn-primary">
            Back to home
          </Link>
        </EmptyState>
      </div>
    );
  }

  const stories = storyData?.stories || [];
  const totalPages = Math.ceil((storyData?.total || 0) / (storyData?.limit || 12));

  return (
    <div className="pb-14">
      <section className="border-b border-base-content/10 bg-base-200">
        <div className="container-page flex flex-col items-center gap-6 py-10 text-center md:flex-row md:items-center md:gap-10 md:py-14 md:text-left">
          <Avatar src={info.photo} name={info.name} size="xl" className="ring-4 ring-base-100" />
          <div className="min-w-0 flex-1">
            <h1 className="h-section break-words">{info.name}</h1>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-muted md:justify-start">
              <LuMapPin size={16} aria-hidden="true" />
              {[info.district, info.region].filter(Boolean).join(", ")}
            </p>
            {info.bio && <p className="mt-4 max-w-2xl text-base sm:text-lg">{info.bio}</p>}
            <Link to="/allTrips" className="btn btn-primary mt-6">
              Browse trips to book with {info.name?.split(" ")[0]}
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page mt-10">
        <div className="surface grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          <Fact icon={LuBriefcase} label="Experience">
            {info.experience} {Number(info.experience) === 1 ? "year" : "years"}
          </Fact>
          <Fact icon={LuLanguages} label="Languages">
            <span className="capitalize">{(info.languages || []).join(", ") || "-"}</span>
          </Fact>
          <Fact icon={LuCalendarDays} label="Guiding since">
            {formatDate(info.tourGuideAt)}
          </Fact>
          <Fact icon={LuMail} label="Email">
            <a href={`mailto:${info.email}`} className="underline-offset-4 hover:underline">
              {info.email}
            </a>
          </Fact>
          <Fact icon={LuPhone} label="Phone">
            <a href={`tel:${info.phone}`} className="underline-offset-4 hover:underline">
              {info.phone}
            </a>
          </Fact>
        </div>
      </section>

      <section className="container-page mt-14">
        <h2 className="h-page mb-6">Stories by {info.name?.split(" ")[0]}</h2>
        {storiesLoading ? (
          <Loading className="min-h-40" />
        ) : stories.length === 0 ? (
          <EmptyState title="No stories yet" description="This guide hasn't shared a story so far." />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
};

export default TourGuideProfile;
