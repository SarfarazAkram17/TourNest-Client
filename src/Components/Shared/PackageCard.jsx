import { Link } from "react-router";
import { LuClock, LuMapPin } from "react-icons/lu";
import { formatBDT } from "../../utils/format";

const PackageCard = ({ pkg }) => (
  <article className="group surface-flat relative flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift">
    <div className="relative aspect-[4/3] overflow-hidden bg-base-200">
      <img
        src={pkg.images?.[0]}
        alt={pkg.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {pkg.tourType && (
        <span className="absolute left-3 top-3 rounded-full bg-base-100/90 px-3 py-1 text-xs font-semibold text-base-content backdrop-blur">
          {pkg.tourType}
        </span>
      )}
    </div>

    <div className="flex flex-1 flex-col p-5">
      <h3 className="line-clamp-2 text-lg font-bold leading-snug">
        <Link to={`/packages/${pkg._id}`} className="after:absolute after:inset-0 after:content-['']">
          {pkg.title}
        </Link>
      </h3>

      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        <li className="flex items-center gap-2">
          <LuMapPin size={16} className="shrink-0" aria-hidden="true" />
          <span className="truncate">{pkg.location}</span>
        </li>
        {pkg.duration && (
          <li className="flex items-center gap-2">
            <LuClock size={16} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{pkg.duration}</span>
          </li>
        )}
      </ul>

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <div>
          <p className="text-xs text-muted">From</p>
          <p className="font-display text-xl font-bold tabular-nums">{formatBDT(pkg.price)}</p>
        </div>
        <span className="btn btn-sm btn-primary btn-soft pointer-events-none">View trip</span>
      </div>
    </div>
  </article>
);

export default PackageCard;
