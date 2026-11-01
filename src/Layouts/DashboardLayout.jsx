import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { LuExternalLink, LuLogOut, LuMenu, LuX } from "react-icons/lu";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import useWindowSize from "../Hooks/useWindowSize";
import { useAdminStats, useGuideStats } from "../Hooks/useDashboardStats";
import Logo from "../Components/Common/Logo";
import ThemeToggle from "../Components/Common/ThemeToggle";
import UserMenu from "../Components/Common/UserMenu";
import Footer from "../Components/Common/Footer";
import buildNav from "../Components/Common/dashboardNav";
import Avatar from "../Components/UI/Avatar";
import { RoleBadge } from "../Components/UI/StatusBadge";

const PAGE_TITLES = {
  "/dashboard": "Overview",
  "/dashboard/manageProfile": "My profile",
  "/dashboard/myBookings": "My bookings",
  "/dashboard/payment": "Checkout",
  "/dashboard/addStories": "Add story",
  "/dashboard/manageStories": "My stories",
  "/dashboard/editStories": "Edit story",
  "/dashboard/addPackage": "Add package",
  "/dashboard/managePackages": "Manage packages",
  "/dashboard/editPackage": "Edit package",
  "/dashboard/manageUsers": "Users",
  "/dashboard/manageCandidates": "Guide applications",
  "/dashboard/joinAsTourGuide": "Become a guide",
  "/dashboard/manageGuideProfile": "Guide profile",
  "/dashboard/myAssignedTours": "Assigned tours",
};

const getTitle = (pathname) => {
  const clean = pathname.replace(/\/$/, "");
  if (PAGE_TITLES[clean]) return PAGE_TITLES[clean];
  const parent = clean.split("/").slice(0, 3).join("/");
  return PAGE_TITLES[parent] || "Dashboard";
};

const SidebarContent = ({ groups, user, role, onNavigate, onSignOut }) => (
  <div className="flex h-full flex-col">
    <div className="flex h-16 shrink-0 items-center border-b border-base-content/10 px-5">
      <Logo onClick={onNavigate} />
    </div>

    <nav aria-label="Dashboard" className="scroll-thin flex-1 overflow-y-auto px-3 py-4">
      {groups.map((group) => (
        <div key={group.label} className="mb-5">
          <p className="px-3 pb-1.5 text-xs font-semibold text-muted">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map(({ to, label, icon: Icon, end, badge }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-base-content/75 hover:bg-base-content/6 hover:text-base-content"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-2 h-[calc(100%-1rem)] w-1 rounded-full bg-primary"
                        />
                      )}
                      <Icon size={19} aria-hidden="true" className="shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                      {badge > 0 && (
                        <span
                          className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[0.7rem] font-bold leading-5 text-primary-content"
                          aria-label={`${badge} pending`}
                        >
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>

    <div className="shrink-0 border-t border-base-content/10 p-3">
      <div className="flex items-center gap-3 rounded-xl bg-base-200 p-3">
        <Avatar src={user?.photoURL} name={user?.displayName} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user?.displayName}</p>
          {role !== "user" && <RoleBadge role={role} />}
        </div>
      </div>
      <Link
        to="/"
        onClick={onNavigate}
        className="btn btn-ghost btn-sm mt-2 w-full justify-start text-muted"
      >
        <LuExternalLink size={16} aria-hidden="true" /> Back to website
      </Link>
      <button
        type="button"
        onClick={onSignOut}
        className="btn btn-ghost btn-sm mt-1 w-full justify-start text-error"
      >
        <LuLogOut size={16} aria-hidden="true" /> Sign out
      </button>
    </div>
  </div>
);

const DashboardLayout = () => {
  const { user, logOutUser } = useAuth();
  const navigate = useNavigate();
  const { role, roleLoading } = useUserRole();
  const { pathname } = useLocation();
  const { width } = useWindowSize();
  const [open, setOpen] = useState(false);

  const isDesktop = width >= 1024;
  const { data: adminStats } = useAdminStats(!roleLoading && role === "admin");
  const { data: guideStats } = useGuideStats(!roleLoading && role === "tour guide");

  const groups = useMemo(
    () =>
      buildNav(role, {
        applications: adminStats?.pendingApplications || 0,
        requests: guideStats?.stats?.awaitingResponse || 0,
      }),
    [role, adminStats, guideStats]
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeDrawer = () => setOpen(false);

  const handleSignOut = async () => {
    closeDrawer();
    try {
      await logOutUser();
      toast.info("You have been signed out.");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <a
        href="#main"
        className="sr-only z-[100] rounded-lg bg-primary px-4 py-2 font-semibold text-primary-content focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      {/* Mobile overlay */}
      {open && !isDesktop && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeDrawer}
          className="fixed inset-0 z-40 cursor-default bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        inert={!isDesktop && !open}
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[86vw] border-r border-base-content/10 bg-base-100 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {!isDesktop && open && (
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close menu"
            className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3.5 z-10"
          >
            <LuX size={20} />
          </button>
        )}
        {roleLoading ? (
          <div className="space-y-3 p-5" aria-busy="true">
            <div className="skeleton h-9 w-36"></div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-10 w-full"></div>
            ))}
          </div>
        ) : (
          <SidebarContent
            groups={groups}
            user={user}
            role={role}
            onNavigate={closeDrawer}
            onSignOut={handleSignOut}
          />
        )}
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-base-content/10 bg-base-100/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="btn btn-ghost btn-circle -ml-2 lg:hidden"
            >
              <LuMenu size={22} />
            </button>
            <p className="min-w-0 truncate text-sm text-muted">
              <span className="hidden xs:inline">Dashboard / </span>
              <span className="font-semibold text-base-content">{getTitle(pathname)}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>

        <Footer compact />
      </div>
      <ScrollRestoration />
    </div>
  );
};

export default DashboardLayout;
