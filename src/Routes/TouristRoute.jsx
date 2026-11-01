import RoleRoute from "./RoleRoute";

const TouristRoute = ({ children }) => <RoleRoute allow={["tourist"]}>{children}</RoleRoute>;

export default TouristRoute;
