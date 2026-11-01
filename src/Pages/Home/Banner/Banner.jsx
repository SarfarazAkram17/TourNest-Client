import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { LuCompass, LuSearch } from "react-icons/lu";
import useAxios from "../../../Hooks/useAxios";
import hero1 from "../../../assets/hero-1.jpg";
import hero2 from "../../../assets/hero-2.jpg";
import hero3 from "../../../assets/hero-3.jpg";

const slides = [hero1, hero2, hero3];

const Banner = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const [active, setActive] = useState(0);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const { data: types = [] } = useQuery({
    queryKey: ["package-types"],
    queryFn: async () => (await axiosInstance.get("/packages/types")).data,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (type) params.set("type", type);
    navigate(`/allTrips${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <>
      <section className="relative isolate overflow-hidden bg-neutral">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          {slides.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              fetchPriority={i === 0 ? "high" : "low"}
              loading={i === 0 ? "eager" : "lazy"}
              className={`hero-img absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="hero-scrim absolute inset-0" />
        </div>

        <div className="container-page relative flex min-h-[32rem] flex-col justify-center pb-36 pt-16 text-white md:min-h-[40rem] md:pb-44">
          <div className="reveal max-w-3xl">
            <h1 className="h-display" style={{ "--i": 0 }}>
              Explore Bangladesh with guides who call it home
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg" style={{ "--i": 1 }}>
              Hand-picked trips, verified local guides and secure booking in one
              place. Choose where, pick who shows you around, and go.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" style={{ "--i": 2 }}>
              <Link to="/allTrips" className="btn btn-primary btn-lg">
                <LuCompass size={20} aria-hidden="true" /> Browse trips
              </Link>
              <a href="#guides" className="btn btn-glass btn-lg">
                Meet the guides
              </a>
            </div>
          </div>

          <div className="absolute bottom-24 right-4 flex gap-2 sm:right-6 md:bottom-28 lg:right-8">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1} of ${slides.length}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="container-page relative z-10 -mt-12 md:-mt-14">
        <form
          onSubmit={handleSearch}
          role="search"
          aria-label="Search trips"
          className="surface grid gap-3 p-3 shadow-lift sm:p-4 md:grid-cols-[1.5fr_1fr_auto]"
        >
          <label className="input w-full items-center gap-2">
            <LuSearch size={18} className="shrink-0 opacity-60" aria-hidden="true" />
            <input
              type="search"
              className="min-w-0 grow"
              placeholder="Where to? Try Sajek or Sundarbans"
              aria-label="Destination or trip name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <select
            className="select w-full"
            aria-label="Trip type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Any trip type</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary md:px-8">
            Search trips
          </button>
        </form>
      </div>
    </>
  );
};

export default Banner;
