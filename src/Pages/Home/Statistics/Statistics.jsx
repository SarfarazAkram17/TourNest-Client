import { useQuery } from "@tanstack/react-query";
import CountUp from "react-countup";
import { LuBookOpenText, LuMap, LuUserRound, LuUsers } from "react-icons/lu";
import useAxios from "../../../Hooks/useAxios";

const items = [
  { key: "packages", label: "Trips to explore", icon: LuMap },
  { key: "guides", label: "Verified local guides", icon: LuUserRound },
  { key: "tourists", label: "Travelers on board", icon: LuUsers },
  { key: "stories", label: "Stories shared", icon: LuBookOpenText },
];

const Statistics = () => {
  const axiosInstance = useAxios();
  const { data, isError } = useQuery({
    queryKey: ["public-stats"],
    queryFn: async () => (await axiosInstance.get("/stats/public")).data,
    staleTime: 5 * 60 * 1000,
  });

  if (isError) return null;

  return (
    <section aria-label="TourNest in numbers" className="container-page pt-14 md:pt-16">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
        {items.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center gap-3 sm:gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
              <Icon size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <dd className="font-display text-2xl font-bold leading-none tabular-nums sm:text-3xl">
                {data ? (
                  <CountUp end={data[key] || 0} duration={1.4} separator="," enableScrollSpy scrollSpyOnce />
                ) : (
                  <span className="skeleton inline-block h-7 w-14 align-middle"></span>
                )}
              </dd>
              <dt className="mt-1 text-sm text-muted">{label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default Statistics;
