import { useQuery } from "@tanstack/react-query";

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load ${url}`);
  return res.json();
};

/** Bangladesh divisions and their districts (static JSON served from /public). */
const useLocations = () => {
  const { data: regions = [] } = useQuery({
    queryKey: ["regions"],
    queryFn: () => fetchJson("/regions.json"),
    staleTime: Infinity,
  });
  const { data: districts = {} } = useQuery({
    queryKey: ["districts"],
    queryFn: () => fetchJson("/districts.json"),
    staleTime: Infinity,
  });
  return { regions, districts };
};

export default useLocations;
