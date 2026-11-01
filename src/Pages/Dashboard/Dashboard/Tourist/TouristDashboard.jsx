import { Link } from "react-router";
import {
  LuCalendarClock,
  LuCircleCheck,
  LuCompass,
  LuCreditCard,
  LuLuggage,
  LuWallet,
} from "react-icons/lu";
import useAuth from "../../../../Hooks/useAuth";
import { useTouristStats } from "../../../../Hooks/useDashboardStats";
import PageHeader from "../../../../Components/UI/PageHeader";
import StatCard from "../../../../Components/UI/StatCard";
import EmptyState from "../../../../Components/UI/EmptyState";
import { AreaTrend, BarList, ChartCard, ChartEmpty, DonutChart } from "../../../../Components/UI/Charts";
import { DashboardSkeleton } from "../../../../Components/UI/Skeletons";
import Panel from "../../../../Components/Dashboard/Panel";
import BookingList from "../../../../Components/Dashboard/BookingList";
import Avatar from "../../../../Components/UI/Avatar";
import { BookingBadge } from "../../../../Components/UI/StatusBadge";
import { formatBDT, formatDate } from "../../../../utils/format";
import { getBookingStatus } from "../../../../utils/constants";

const TouristDashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useTouristStats();

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
    monthlySpending = [],
    spentPerPackage = [],
    nextTrips = [],
    awaitingPayment = [],
    recentBookings = [],
  } = data;
  const firstName = user?.displayName?.split(" ")[0] || "traveler";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hello, ${firstName}`}
        description="Your trips, payments and spending in one place."
        actions={
          <Link to="/allTrips" className="btn btn-primary">
            <LuCompass size={18} aria-hidden="true" /> Find a trip
          </Link>
        }
      />

      {awaitingPayment.length > 0 && (
        <section
          aria-label="Bookings awaiting payment"
          className="rounded-2xl border border-warning/40 bg-warning/8 p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning">
              <LuCreditCard size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold">Finish paying to secure your date</p>
              <p className="text-sm text-muted">Your guide is only notified once payment is complete.</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {awaitingPayment.map((b) => (
              <li
                key={b._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-base-100 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{b.packageName}</p>
                  <p className="text-xs text-muted">Trip date: {formatDate(b.tourDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tabular-nums">{formatBDT(b.price)}</span>
                  <Link to={`/dashboard/payment/${b._id}`} className="btn btn-primary btn-sm">
                    Pay now
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 xs:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={LuCalendarClock} tone="secondary" label="Upcoming trips" value={stats.upcomingTours || 0} />
        <StatCard icon={LuCreditCard} tone="warning" label="Awaiting payment" value={stats.pendingPayments || 0} to="/dashboard/myBookings" />
        <StatCard icon={LuCircleCheck} tone="success" label="Completed trips" value={stats.completedTours || 0} />
        <StatCard icon={LuWallet} tone="primary" label="Total spent" value={formatBDT(stats.totalSpent)} hint={`${stats.totalBookings || 0} bookings`} />
      </div>

      <Panel title="Your next trips" subtitle="Confirmed and in-review bookings" actionTo="/dashboard/myBookings" actionLabel="All bookings">
        {nextTrips.length === 0 ? (
          <EmptyState
            icon={LuLuggage}
            title="No upcoming trips"
            description="When you reserve a trip it shows up here with its date and guide."
            className="border-0 bg-transparent py-8"
          >
            <Link to="/allTrips" className="btn btn-primary btn-sm">
              Explore trips
            </Link>
          </EmptyState>
        ) : (
          <ul className="grid gap-4 md:grid-cols-3">
            {nextTrips.map((trip) => (
              <li key={trip._id} className="surface-tint overflow-hidden">
                <div className="aspect-[16/9] bg-base-200">
                  {trip.packageImage && (
                    <img src={trip.packageImage} alt="" loading="lazy" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <p className="truncate font-bold" title={trip.packageName}>
                    {trip.packageName}
                  </p>
                  <p className="mt-1 text-sm text-muted">{formatDate(trip.tourDate, { weekday: "short" })}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2 text-xs text-muted">
                      <Avatar src={trip.tourGuideImage} name={trip.tourGuideName} size="xs" />
                      <span className="truncate">{trip.tourGuideName}</span>
                    </span>
                    <BookingBadge status={getBookingStatus(trip)} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Spending" subtitle="What you've paid each month" className="lg:col-span-2">
          {monthlySpending.length ? (
            <AreaTrend data={monthlySpending} xKey="month" yKey="total" name="Spent" currency />
          ) : (
            <ChartEmpty message="Your spending shows up here after your first payment." />
          )}
        </ChartCard>
        <ChartCard title="Trip status" subtitle="All your bookings">
          <DonutChart data={tourDistribution} centerLabel="Trips" />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Spending by package">
          <BarList
            items={spentPerPackage.map((p) => ({ label: p.package, value: p.spent }))}
            valueFormatter={formatBDT}
            emptyMessage="No payments yet."
          />
        </ChartCard>
        <Panel title="Recent activity" actionTo="/dashboard/myBookings" actionLabel="View all">
          <BookingList bookings={recentBookings} person="guide" emptyMessage="No bookings yet." />
        </Panel>
      </div>
    </div>
  );
};

export default TouristDashboard;
