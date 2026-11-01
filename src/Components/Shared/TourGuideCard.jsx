import { Link } from "react-router";
import { LuBriefcase, LuMapPin } from "react-icons/lu";
import Avatar from "../UI/Avatar";

const TourGuideCard = ({ guide }) => {
  const info = guide.guideInfo || {};
  const languages = info.languages || [];

  return (
    <article className="surface-flat group relative flex h-full flex-col p-5 transition-shadow duration-300 hover:shadow-lift">
      <div className="flex items-center gap-4">
        <Avatar src={info.photo} name={info.name} size="lg" />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold leading-tight">
            <Link
              to={`/tourGuide/${guide._id}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {info.name}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted">
            <LuMapPin size={14} className="shrink-0" aria-hidden="true" />
            {[info.district, info.region].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm">
        <LuBriefcase size={16} className="shrink-0 text-primary" aria-hidden="true" />
        {info.experience} {Number(info.experience) === 1 ? "year" : "years"} of experience
      </p>

      {languages.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Languages">
          {languages.slice(0, 4).map((lang) => (
            <li
              key={lang}
              className="rounded-full bg-base-content/6 px-2.5 py-1 text-xs font-medium capitalize"
            >
              {lang}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};

export default TourGuideCard;
