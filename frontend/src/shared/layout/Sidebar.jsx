import { Link, NavLink } from "react-router-dom";
import { FiLayout, FiSearch, FiUpload, FiCopy, FiCpu, FiLogOut, FiUser, FiX } from "react-icons/fi";

function Sidebar({ user, onLogout, isOpen, onClose }) {
  const navItems = [
    { name: "Dashboard", path: "/", icon: <FiLayout size={18} /> },
    { name: "Search Jobs", path: "/jobs", icon: <FiSearch size={18} /> },
    { name: "Import Dataset", path: "/import", icon: <FiUpload size={18} /> },
    { name: "Duplicate Review", path: "/duplicates", icon: <FiCopy size={18} /> },
    { name: "Resume Tailor", path: "/resume", icon: <FiCpu size={18} /> },
  ];

  return (
    <>
      {/* Mobile Sidebar Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-30 md:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Panel Container */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 flex flex-col border-r border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 z-40 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:bg-white/70 md:dark:bg-slate-900/70 md:backdrop-blur-md ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <Link to="/" className="flex items-center gap-2" onClick={onClose}>
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 bg-clip-text text-transparent">
              HireHub
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50">
              v1.0
            </span>
          </Link>
          {/* Close button on Mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-650 transition"
            title="Close menu"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-100"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Profile Card / Footer */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 mb-4 p-2 -m-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold">
              {user?.name ? user.name[0].toUpperCase() : <FiUser />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-100">
                {user?.name || "User Account"}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email || "user@hirehub.com"}</p>
            </div>
          </Link>
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-sm font-semibold transition-colors duration-200"
          >
            <FiLogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
