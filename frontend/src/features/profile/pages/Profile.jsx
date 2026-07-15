import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../auth/auth.slice.js";
import { useResetPasswordMutation, useSetNewPasswordMutation } from "../api/profile.api.js";
import { toast } from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiShield, FiKey } from "react-icons/fi";
import PageHeader from "../../../shared/components/PageHeader.jsx";

function Profile() {
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState("overview");

  // Reset Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // New Password form state
  const [directPassword, setDirectPassword] = useState("");
  const [confirmDirectPassword, setConfirmDirectPassword] = useState("");

  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
  const [setNewPasswordMut, { isLoading: isSetting }] = useSetNewPasswordMutation();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      const res = await resetPassword({ currentPassword, newPassword }).unwrap();
      toast.success(res?.message || "Password reset successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reset password.");
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    if (directPassword !== confirmDirectPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const res = await setNewPasswordMut({ newPassword: directPassword }).unwrap();
      toast.success(res?.message || "New password set successfully!");
      setDirectPassword("");
      setConfirmDirectPassword("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to set new password.");
    }
  };

  const menuItems = [
    { key: "overview", label: "Profile Overview", icon: <FiUser size={16} /> },
    { key: "reset", label: "Reset Password", icon: <FiShield size={16} /> },
    { key: "new", label: "New Password", icon: <FiKey size={16} /> },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Account Settings"
        subtitle="Manage your profile information and password"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Menu */}
        <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl h-fit space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === item.key
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-100"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content Panel */}
        <div className="lg:col-span-3">
          {/* Profile Overview */}
          {activeTab === "overview" && (
            <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-2xl space-y-6">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Profile Information</h3>

              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-600/20">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">{user?.name || "User"}</p>
                  <p className="text-sm text-slate-400">{user?.email || "user@hirehub.com"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-bold tracking-widest">
                    <FiUser size={12} />
                    Full Name
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name || "—"}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-bold tracking-widest">
                    <FiMail size={12} />
                    Email Address
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.email || "—"}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-bold tracking-widest">
                    <FiLock size={12} />
                    Password
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">••••••••</p>
                </div>
              </div>
            </div>
          )}

          {/* Reset Password */}
          {activeTab === "reset" && (
            <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-2xl space-y-6">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Reset Password</h3>
              <p className="text-sm text-slate-400">Verify your current password and set a new one.</p>

              <form onSubmit={handleResetPassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Re-enter new password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                >
                  {isResetting ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </div>
          )}

          {/* New Password */}
          {activeTab === "new" && (
            <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-2xl space-y-6">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Set New Password</h3>
              <p className="text-sm text-slate-400">Directly set a new password without verifying your current one.</p>

              <form onSubmit={handleSetNewPassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={directPassword}
                    onChange={(e) => setDirectPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmDirectPassword}
                    onChange={(e) => setConfirmDirectPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Re-enter new password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSetting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                >
                  {isSetting ? "Setting..." : "Set New Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
