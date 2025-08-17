import { FaCalendarAlt, FaCheckCircle, FaBan } from "react-icons/fa";
import { MdBookmarkAdded } from "react-icons/md";

const TourGuideStats = ({ stats }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {/* Total Bookings Assigned */}
      <div className="bg-blue-100 text-blue-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
        <MdBookmarkAdded size={35} />
        <div>
          <p className="text-lg font-bold">{stats.totalBookings || 0}</p>
          <p className="text-sm font-medium">Total Bookings Assigned</p>
        </div>
      </div>

      {/* Upcoming Tours */}
      <div className="bg-yellow-100 text-yellow-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
        <FaCalendarAlt size={35} />
        <div>
          <p className="text-lg font-bold">{stats.upcomingTours || 0}</p>
          <p className="text-sm font-medium">Upcoming Tours</p>
        </div>
      </div>

      {/* Completed Tours */}
      <div className="bg-green-100 text-green-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
        <FaCheckCircle size={35} />
        <div>
          <p className="text-lg font-bold">{stats.completedTours || 0}</p>
          <p className="text-sm font-medium">Completed Tours</p>
        </div>
      </div>

      {/* Rejected Tours */}
      <div className="bg-red-100 text-red-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
        <FaBan size={35} />
        <div>
          <p className="text-lg font-bold">{stats.rejectedTours || 0}</p>
          <p className="text-sm font-medium">Rejected Tours</p>
        </div>
      </div>
    </div>
  );
};

export default TourGuideStats;