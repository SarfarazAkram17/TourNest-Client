import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { NavLink } from "react-router";
import { LuChevronDown, LuLogOut } from "react-icons/lu";
import useAuth from "../../Hooks/useAuth";
import useUserRole from "../../Hooks/useUserRole";
import Avatar from "../UI/Avatar";
import { RoleBadge } from "../UI/StatusBadge";
import buildNav from "./dashboardNav";

const UserMenu = () => {
  const { user, userEmail, logOutUser } = useAuth();
  const { role, roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const groups = useMemo(() => (roleLoading ? [] : buildNav(role)), [role, roleLoading]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logOutUser();
      toast.info("You have been signed out.");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const itemClass =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-base-content/6";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
        className="flex items-center gap-1.5 rounded-full p-0.5 pr-1.5 transition-colors hover:bg-base-content/6"
      >
        <Avatar src={user?.photoURL} name={user?.displayName} size="sm" />
        <LuChevronDown
          size={16}
          aria-hidden="true"
          className={`hidden text-muted transition-transform sm:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="surface absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] p-2"
          style={{ animation: "tn-pop 0.14s ease-out" }}
        >
          <div className="flex items-center gap-3 border-b border-base-content/10 px-3 pb-3 pt-2">
            <Avatar src={user?.photoURL} name={user?.displayName} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user?.displayName || "Traveler"}</p>
              <p className="truncate text-xs text-muted">{userEmail}</p>
              {!roleLoading && role !== "user" && (
                <div className="mt-1.5">
                  <RoleBadge role={role} />
                </div>
              )}
            </div>
          </div>
          <nav aria-label="Account" className="scroll-thin max-h-[min(22rem,60vh)] overflow-y-auto py-1.5">
            {groups.map((group) => (
              <div key={group.label} className="mb-1.5 last:mb-0">
                <p className="px-3 pb-1 pt-1.5 text-xs font-semibold text-muted">{group.label}</p>
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `${itemClass} ${isActive ? "bg-primary/10 text-primary" : ""}`
                    }
                  >
                    <Icon size={18} aria-hidden="true" /> {label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
          <div className="border-t border-base-content/10 pt-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className={`${itemClass} text-error`}
            >
              <LuLogOut size={18} aria-hidden="true" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
