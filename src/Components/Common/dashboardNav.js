import {
  LuBadgeCheck,
  LuBookOpen,
  LuCalendarCheck,
  LuClipboardList,
  LuContact,
  LuLayoutDashboard,
  LuLuggage,
  LuPackage,
  LuPackagePlus,
  LuPenLine,
  LuUser,
  LuUsers,
} from "react-icons/lu";

/**
 * Single source of truth for role-based dashboard navigation.
 * Used by the dashboard sidebar and the profile dropdown.
 * `badges` optionally adds counters: { applications, requests }.
 */
export const buildNav = (role, badges = {}) => {
  const overview = {
    label: "Overview",
    items: [{ to: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard, end: true }],
  };

  const bookings = { to: "/dashboard/myBookings", label: "My bookings", icon: LuLuggage };

  const content = {
    label: "Stories",
    items: [
      { to: "/dashboard/addStories", label: "Add story", icon: LuPenLine },
      { to: "/dashboard/manageStories", label: "My stories", icon: LuBookOpen },
    ],
  };

  const account = (extra = []) => ({
    label: "Account",
    items: [{ to: "/dashboard/manageProfile", label: "My profile", icon: LuUser }, ...extra],
  });

  if (role === "admin") {
    return [
      overview,
      {
        label: "Management",
        items: [
          { to: "/dashboard/manageCandidates", label: "Guide applications", icon: LuClipboardList, badge: badges.applications },
          { to: "/dashboard/manageUsers", label: "Users", icon: LuUsers },
          { to: "/dashboard/addPackage", label: "Add package", icon: LuPackagePlus },
          { to: "/dashboard/managePackages", label: "Manage packages", icon: LuPackage },
        ],
      },
      content,
      account(),
    ];
  }

  if (role === "tour guide") {
    return [
      overview,
      {
        label: "Guiding",
        items: [
          { to: "/dashboard/myAssignedTours", label: "Assigned tours", icon: LuCalendarCheck, badge: badges.requests },
          { to: "/dashboard/manageGuideProfile", label: "Guide profile", icon: LuContact },
        ],
      },
      content,
      account(),
    ];
  }

  return [
    overview,
    { label: "Travel", items: [bookings] },
    content,
    account([{ to: "/dashboard/joinAsTourGuide", label: "Become a guide", icon: LuBadgeCheck }]),
  ];
};
export default buildNav;
