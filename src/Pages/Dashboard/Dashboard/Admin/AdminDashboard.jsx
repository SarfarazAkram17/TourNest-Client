import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useUserRole from "../../../../Hooks/useUserRole";
import Loading from "../../../../Components/Loading/Loading";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import AdminStats from "./AdminStats";
import useAuth from "../../../../Hooks/useAuth";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();
  const { role, roleLoading } = useUserRole();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/stats?email=${userEmail}`);
      return res.data;
    },
    enabled: !roleLoading && role === "admin",
    refetchInterval: 3000,
  });

  if (isLoading) return <Loading />;

  // Pie chart: Tour Guides vs Clients
  const userDistribution = [
    { name: "Tour Guides", value: stats.totalTourGuides || 0 },
    { name: "Tourists/Clients", value: stats.totalClients || 0 },
  ];

  // Bar chart: Packages vs Stories
  const packagesAndStories = [
    { name: "Packages", count: stats.totalPackages || 0 },
    { name: "Stories", count: stats.totalStories || 0 },
  ];

  // Line chart: Payment trends from backend
  const paymentTrends = stats.paymentsTrend || [];

  const COLORS = ["#0088FE", "#FF8042"];
  const users = userDistribution.filter((user) => user.value > 0);

  return (
    <div className="px-4 space-y-8">
      <h1 className="text-center text-3xl sm:text-4xl text-primary font-extrabold">
        Dashboard
      </h1>

      {/* Stat Cards */}
      <AdminStats stats={stats} />

      {/* User Distribution */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
        {users.length === 0 ? (
          <p className="font-semibold h-[200px] flex justify-center items-center">
            No Clients and tour guides yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistribution.filter((user) => user.value > 0)}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}`}
              >
                {userDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Packages vs Stories */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold mb-4">Packages vs Stories</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={packagesAndStories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Trend */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold mb-4">Payment Trends</h3>
        {paymentTrends.length === 0 ? (
          <p className="font-semibold h-[200px] flex justify-center items-center">
            No payments yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={paymentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="payments"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
