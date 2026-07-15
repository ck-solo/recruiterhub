import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../../features/theme/useTheme.js";
import useAuth from "../../features/auth/hooks/useAuth.js";
import { selectUser } from "../../features/auth/auth.slice.js";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

function AppLayout() {
  const { darkMode, setDarkMode } = useTheme();
  const { handleLogout } = useAuth();
  const user = useSelector(selectUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        user={user}
        onLogout={handleLogout}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Navbar
          darkMode={darkMode}
          onThemeToggle={() => setDarkMode(!darkMode)}
          onLogout={handleLogout}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Content Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
