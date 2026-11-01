import { Link } from "react-router";
import { LuBanknote, LuCalendarClock, LuCircleCheck, LuInbox } from "react-icons/lu";
import useAuth from "../../../../Hooks/useAuth";
import useBookingActions from "../../../../Hooks/useBookingActions";
import { useGuideStats } from "../../../../Hooks/useDashboardStats";
import PageHeader from "../../../../Components/UI/PageHeader";
import StatCard from "../../../../Components/UI/StatCard";
import { AreaTrend, BarList, ChartCard, ChartEmpty, DonutChart } from "../../../../Components/UI/Charts";
import { DashboardSkeleton } from "../../../../Components/UI/Skeletons";
import Panel from "../../../../Components/Dashboard/Panel";
import BookingList from "../../../../Components/Dashboard/BookingList";
import { formatBDT } from "../../../../utils/format";

const TourGuideDashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useGuideStats();
  const { accept, reject, busyId } = useBookingActions();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) {
    return (
      <p className="surface p-8 text-center text-muted">
        We couldn't load your dashboard right now. Refresh the page to try again.
      </p>
    );
  }

  const {
    stats = {},
    tourDistribution = [],
    toursPerPackage = [],
    monthlyTours = [],
    requests = [],
    nextTours = [],
  } = data;
  const firstName = user?.displayName?.split(" ")[0] || "guide";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Respond to requests, prepare for upcoming tours and track your earnings."
        actions={
          <Link to="/dashboard/myAssignedTours" className="btn btn-primary">
            All assigned tours
          </Link>
        }
      />

      <div className="grid gap-4 xs:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={LuInbox} tone="warning" label="Awaiting your response" value={stats.awaitingResponse || 0} to="/dashboard/myAssignedTours" />
        <StatCard icon={LuCalendarClock} tone="secondary" label="Upcoming tours" value={stats.upcomingTours || 0} />
        <StatCard icon={LuCircleCheck} tone="success" label="Completed tours" value={stats.completedTours || 0} hint={`${stats.totalBookings || 0} assigned in total`} />
        <StatCard icon={LuBanknote} tone="primary" label="Confirmed earnings" value={formatBDT(stats.earnings)} hint="From accepted tours" />
      </div>

      <Panel
        title="Requests to review"
        subtitle="Paid bookings waiting for your decision"
        actionTo="/dashboard/myAssignedTours"
        actionLabel="See all"
      >
        <BookingList
          bookings={requests}
          person="tourist"
          emptyMessage="You're all caught up. New paid bookings will appear here."
          renderAction={(b) => (
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={busyId === b._id}
                onClick={() => accept(b)}
              >
                Accept
              </button>
              <button
                type="button"
                className="btn btn-outline btn-error btn-sm"
                disabled={busyId === b._id}
                onClick={() => reject(b)}
              >
                Decline
              </button>
            </div>
          )}
        />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Tour activity" subtitle="Bookings assigned to you each month" className="lg:col-span-2">
          {monthlyTours.length ? (
            <AreaTrend data={monthlyTours} xKey="month" yKey="count" name="Tours" />
          ) : (
            <ChartEmpty message="Activity appears here once travelers book you." />
          )}
        </ChartCard>
        <ChartCard title="Tour status" subtitle="All assigned tours">
          <DonutChart data={tourDistribution} centerLabel="Tours" />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Tours per package">
          <BarList
            items={toursPerPackage.map((p) => ({ label: p.package, value: p.count }))}
            emptyMessage="No tours yet."
          />
        </ChartCard>
        <Panel title="Next tours" subtitle="Confirmed and upcoming">
          <BookingList bookings={nextTours} person="tourist" emptyMessage="No upcoming tours." />
        </Panel>
      </div>
    </div>
  );
};

export default TourGuideDashboard;
