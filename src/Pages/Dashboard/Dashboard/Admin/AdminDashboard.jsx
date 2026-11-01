import { Link } from "react-router";
import {
  LuBanknote,
  LuBookOpen,
  LuClipboardList,
  LuLuggage,
  LuMap,
  LuPackagePlus,
  LuUserRound,
  LuUsers,
} from "react-icons/lu";
import useAuth from "../../../../Hooks/useAuth";
import { useAdminStats } from "../../../../Hooks/useDashboardStats";
import PageHeader from "../../../../Components/UI/PageHeader";
import StatCard from "../../../../Components/UI/StatCard";
import Avatar from "../../../../Components/UI/Avatar";
import { RoleBadge } from "../../../../Components/UI/StatusBadge";
import { AreaTrend, BarList, ChartCard, ChartEmpty, DonutChart } from "../../../../Components/UI/Charts";
import { DashboardSkeleton } from "../../../../Components/UI/Skeletons";
import Panel from "../../../../Components/Dashboard/Panel";
import BookingList from "../../../../Components/Dashboard/BookingList";
import { formatBDT, timeAgo } from "../../../../utils/format";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { data: stats, isLoading, isError } = useAdminStats();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !stats) {
    return (
      <p className="surface p-8 text-center text-muted">
        We couldn't load the dashboard right now. Refresh the page to try again.
      </p>
    );
  }

  const firstName = user?.displayName?.split(" ")[0] || "there";
  const userSplit = [
    { name: "Tourists", value: stats.totalClients || 0 },
    { name: "Guides", value: stats.totalTourGuides || 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="A live overview of bookings, revenue and people on TourNest."
        actions={
          <>
            <Link to="/dashboard/managePackages" className="btn btn-outline">
              Manage packages
            </Link>
            <Link to="/dashboard/addPackage" className="btn btn-primary">
              <LuPackagePlus size={18} aria-hidden="true" /> Add package
            </Link>
          </>
        }
      />

      {stats.pendingApplications > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/8 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <LuClipboardList size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold">
                {stats.pendingApplications} guide{" "}
                {stats.pendingApplications === 1 ? "application needs" : "applications need"} your review
              </p>
              <p className="text-sm text-muted">Approve or decline so applicants know where they stand.</p>
            </div>
          </div>
          <Link to="/dashboard/manageCandidates" className="btn btn-primary btn-sm self-start sm:self-auto">
            Review applications
          </Link>
        </div>
      )}

      <div className="grid gap-4 xs:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={LuBanknote} tone="success" label="Total revenue" value={formatBDT(stats.totalPayments)} hint="After refunds" />
        <StatCard icon={LuLuggage} tone="primary" label="Bookings" value={stats.totalBookings || 0} to="/dashboard/manageUsers" hint="All time" />
        <StatCard icon={LuUsers} tone="secondary" label="Tourists" value={stats.totalClients || 0} to="/dashboard/manageUsers" />
        <StatCard icon={LuUserRound} tone="info" label="Tour guides" value={stats.totalTourGuides || 0} to="/dashboard/manageUsers" />
        <StatCard icon={LuMap} tone="warning" label="Tour packages" value={stats.totalPackages || 0} to="/dashboard/managePackages" />
        <StatCard icon={LuBookOpen} tone="neutral" label="Stories" value={stats.totalStories || 0} to="/community" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Revenue" subtitle="Monthly payments received" className="lg:col-span-2">
          {stats.paymentsTrend?.length ? (
            <AreaTrend data={stats.paymentsTrend} xKey="month" yKey="payments" name="Revenue" currency />
          ) : (
            <ChartEmpty message="Revenue will appear here after the first payment." />
          )}
        </ChartCard>
        <ChartCard title="Booking status" subtitle="Where every booking stands">
          <DonutChart data={stats.bookingStatus || []} centerLabel="Bookings" />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Most booked packages" subtitle="By number of active bookings" className="lg:col-span-2">
          <BarList
            items={(stats.topPackages || []).map((p) => ({ label: p.package, value: p.bookings }))}
            emptyMessage="No bookings yet."
          />
        </ChartCard>
        <ChartCard title="Community" subtitle="Tourists vs guides">
          <DonutChart data={userSplit} centerLabel="People" />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Panel title="Recent bookings" subtitle="Latest activity across the platform" className="lg:col-span-3">
          <BookingList bookings={stats.recentBookings} emptyMessage="No bookings yet." />
        </Panel>

        <Panel
          title="New members"
          subtitle="Latest sign-ups"
          actionTo="/dashboard/manageUsers"
          actionLabel="All users"
          className="lg:col-span-2"
        >
          {stats.recentUsers?.length ? (
            <ul className="space-y-4">
              {stats.recentUsers.map((u) => (
                <li key={u._id} className="flex items-center gap-3">
                  <Avatar src={u.photo} name={u.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{u.name}</p>
                    <p className="truncate text-xs text-muted">{u.email}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <RoleBadge role={u.role} />
                    {u.createdAt && <p className="mt-1 text-[0.7rem] text-muted">{timeAgo(u.createdAt)}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ChartEmpty message="No members yet." height={140} />
          )}
        </Panel>
      </div>
    </div>
  );
};

export default AdminDashboard;
