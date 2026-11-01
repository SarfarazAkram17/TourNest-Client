import { useEffect } from "react";

const BASE = "TourNest";

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : `${BASE} | Explore Bangladesh with local guides`;
  }, [title]);
};

export default useDocumentTitle;
