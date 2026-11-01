import RoleRoute from "./RoleRoute";

const AdminRoute = ({ children }) => <RoleRoute allow={["admin"]}>{children}</RoleRoute>;

export default AdminRoute;
