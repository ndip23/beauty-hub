import { useState } from "react";
import {
  FaBars,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBillWave,
  FaStore,
  FaTachometerAlt,
  FaTags,
  FaTimes,
  FaUsers,
  FaKey
} from "react-icons/fa";
import { FaLayerGroup } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";

const SidebarLink = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `
      flex items-center gap-3 px-4 py-3 rounded-xl text-[15px]
      transition-all duration-200 tracking-wide

      ${
        isActive
          ? "bg-white/15 text-white font-semibold"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }
    `
    }
  >
    <Icon size={18} className="opacity-90 shrink-0" />
    <span>{children}</span>
  </NavLink>
);

const AdminSidebar = () => {
  const [open, setOpen] = useState(false);
  const closeSidebar = () => setOpen(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
        className="lg:hidden fixed top-4 left-4 z-[60]
        bg-white shadow-md p-3 rounded-full"
      >
        <FaBars size={20} className="text-slate-800" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen w-[85vw] sm:w-72 lg:w-64
          flex flex-col p-6
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          border-r border-white/10 text-white
          shadow-xl
          transition-transform duration-300 ease-out

          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-xl font-extrabold">
            <span className="bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
              BookerBeauty
            </span>
          </Link>

          <button
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="lg:hidden text-slate-300"
          >
            <FaTimes size={22} />
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mb-3 uppercase tracking-widest">
          Admin Panel
        </p>

        {/* Navigation */}
        <nav
          className="flex-1 space-y-1 overflow-y-auto pr-1
          scrollbar-thin scrollbar-thumb-slate-400/20
          hover:scrollbar-thumb-slate-400/40
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:w-0"
        >
          <SidebarLink
            to="/admin/overview"
            icon={FaTachometerAlt}
            onClick={closeSidebar}
          >
            Overview
          </SidebarLink>

          <SidebarLink to="/admin/users" icon={FaUsers} onClick={closeSidebar}>
            Users
          </SidebarLink>

          <SidebarLink to="/admin/salons" icon={FaStore} onClick={closeSidebar}>
            Salons
          </SidebarLink>

          <SidebarLink
            to="/admin/appointments"
            icon={FaCalendarCheck}
            onClick={closeSidebar}
          >
            Appointments
          </SidebarLink>

          <SidebarLink
            to="/admin/subscriptions"
            icon={FaClipboardList}
            onClick={closeSidebar}
          >
            Subscriptions
          </SidebarLink>
          <SidebarLink to="/admin/credentials" icon={FaKey}>
  Password Manager
</SidebarLink>

          <SidebarLink to="/admin/plans" icon={FaLayerGroup} onClick={closeSidebar}>
            Plans
          </SidebarLink>

          <SidebarLink
            to="/admin/payments"
            icon={FaMoneyBillWave}
            onClick={closeSidebar}
          >
            Payments
          </SidebarLink>

          <SidebarLink to="/admin/coupons" icon={FaTags} onClick={closeSidebar}>
            Coupons
          </SidebarLink>
        </nav>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 text-xs text-slate-400">
          Admin access only
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
