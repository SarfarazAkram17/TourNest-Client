import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";
import Loading from "../../../../Components/Loading/Loading";
import TourGuideStats from "./TourGuideStats";
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
} from "recharts";
import useUserRole from "../../../../Hooks/useUserRole";

const TourGuideDashboard = () => {
  const { roleLoading, role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();

  const { data: dashboardData = {}, isLoading } = useQuery({
    queryKey: ["tourGuideStats", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tourGuide/stats?email=${userEmail}`);
      return res.data;
    },
    enabled: !!userEmail && !roleLoading && role === "tour guide",
    refetchInterval: 3000,
  });

  if (isLoading) return <Loading />;

  const { stats, tourDistribution, toursPerPackage } = dashboardData;

  const COLORS = ["#00C49F", "#0088FE", "#FF0000"];

  return (
    <div className="px-4 space-y-8">
      <h1 className="text-center text-3xl sm:text-4xl text-primary font-extrabold">Dashboard</h1>

      {/* Stat Cards */}
      <TourGuideStats stats={stats} />

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

      {/* Tours per Package */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">Tours per Package</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={toursPerPackage}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="package" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TourGuideDashboard;
