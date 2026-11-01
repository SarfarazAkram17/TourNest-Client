import RoleRoute from "./RoleRoute";

const TourGuideRoute = ({ children }) => <RoleRoute allow={["tour guide"]}>{children}</RoleRoute>;

export default TourGuideRoute;
