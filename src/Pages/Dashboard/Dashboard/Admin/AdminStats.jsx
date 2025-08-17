import {
  FaUsers,
  FaMoneyBillWave,
  FaMapMarkedAlt,
  FaBookOpen,
  FaUserTie
} from "react-icons/fa";

const AdminStats = ({ stats }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {/* Total Payments */}
      <div className="bg-green-100 text-green-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
        <FaMoneyBillWave size={35} />
        <div>
          <p className="text-lg font-bold">৳ {stats.totalPayments || 0}</p>
          <p className="text-sm font-medium">Total Payments</p>
        </div>
      </div>

      {/* Tour Guides */}
      <div className="bg-blue-100 text-blue-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
        <FaUserTie size={35} />
        <div>
          <p className="text-lg font-bold">{stats.totalTourGuides || 0}</p>
          <p className="text-sm font-medium">Tour Guides</p>
        </div>
      </div>

      {/* Clients */}
      <div className="bg-purple-100 text-purple-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
        <FaUsers size={35} />
        <div>
          <p className="text-lg font-bold">{stats.totalClients || 0}</p>
          <p className="text-sm font-medium">Tourists/Clients</p>
        </div>
      </div>

      {/* Packages */}
      <div className="bg-yellow-100 text-yellow-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
        <FaMapMarkedAlt size={35} />
        <div>
          <p className="text-lg font-bold">{stats.totalPackages || 0}</p>
          <p className="text-sm font-medium">Tour Packages</p>
        </div>
      </div>

      {/* Stories */}
      <div className="bg-pink-100 text-pink-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
        <FaBookOpen size={35} />
        <div>
          <p className="text-lg font-bold">{stats.totalStories || 0}</p>
          <p className="text-sm font-medium">Stories</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
