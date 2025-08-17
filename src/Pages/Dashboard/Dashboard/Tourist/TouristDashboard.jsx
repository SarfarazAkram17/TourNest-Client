import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";
import Loading from "../../../../Components/Loading/Loading";
import TouristStats from "./TouristStats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useUserRole from "../../../../Hooks/useUserRole";

const TouristDashboard = () => {
  const { roleLoading, role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();

  const { data: dashboardData = {}, isLoading } = useQuery({
    queryKey: ["touristStats", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tourist/stats?email=${userEmail}`);
      return res.data;
    },
    enabled: !!userEmail && !roleLoading && role === "tourist",
    refetchInterval: 3000,
  });

  if (isLoading) return <Loading />;

  const {
    stats,
    tourDistribution = [],
    monthlySpending = [],
    spentPerPackage = [],
  } = dashboardData;
  const COLORS = ["#0088FE", "#00C49F", "#FF4C4C", "#FFBB28"];

  return (
    <div className="px-4 space-y-8">
<h1 className="text-center text-3xl sm:text-4xl text-primary font-extrabold">Dashboard</h1>

      {/* Stat Cards */}
      <TouristStats stats={stats} />

      {/* Tour Distribution */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">Tour Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={tourDistribution}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}`}
            >
              {tourDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Spending per Package */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold mb-4">Spending per Package</h3>
        {spentPerPackage.length === 0 ? (
          <p className="font-semibold h-[200px] flex justify-center items-center">
            No spending yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spentPerPackage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="package" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="spent" fill="#82ca9d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Monthly Spending Trend */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-semibold mb-4">Monthly Spending Trend</h3>
        {monthlySpending.length === 0 ? (
          <p className="font-semibold h-[200px] flex justify-center items-center">
            No spending yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
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

export default TouristDashboard;
