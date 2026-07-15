import { FiSun, FiMoon, FiLogOut, FiMenu } from "react-icons/fi";

function Navbar({ darkMode, onThemeToggle, onLogout, onMenuToggle }) {
  return (
    <header className="py-4 flex items-center justify-between px-6 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10">
      {/* Mobile Menu & Brand */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
          title="Open Menu"
        >
          <FiMenu size={18} />
        </button>
        <span className="text-xl font-black bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent md:hidden">
          Applywizz
        </span>
      </div>

      <div className="hidden md:block">
        <h2 className="text-sm font-semibold text-slate-400">Recruiter Console</h2>
      </div>

      {/* Quick Controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Toggle theme"
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Mobile menu signout helper */}
        <button
          onClick={onLogout}
          className="md:hidden p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
          title="Sign out"
        >
          <FiLogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
