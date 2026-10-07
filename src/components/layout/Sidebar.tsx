import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Cloud, LayoutDashboard, Folder, Star, Clock, Share2, Trash2, Settings, Shield, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/files", icon: Folder, label: "My Files" },
  { to: "/favorites", icon: Star, label: "Favorites" },
  { to: "/recent", icon: Clock, label: "Recent" },
  { to: "/shared", icon: Share2, label: "Shared" },
  { to: "/trash", icon: Trash2, label: "Trash" },
];

export function Sidebar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-surface-900 dark:text-white">VITECH</h1>
            <p className="text-xs text-surface-500 -mt-0.5">Cloud Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400"
                  : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 space-y-1 border-t border-surface-200 dark:border-surface-800 pt-4">
        {user?.role === "ADMIN" && (
          <NavLink
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive || location.pathname.startsWith("/admin")
                  ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400"
                  : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
              )
            }
          >
            <Shield className="w-5 h-5" />
            <span>Admin</span>
          </NavLink>
        )}
        <NavLink
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              isActive
                ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400"
                : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
            )
          }
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </div>

      <div className="px-4 pb-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-500/10 to-cyan-500/10 border border-brand-200/50 dark:border-brand-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{user?.full_name || "User"}</p>
              <p className="text-xs text-surface-500 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-surface-600 dark:text-surface-400">Storage</span>
              <span className="text-surface-900 dark:text-white font-medium">
                {((user?.storage_used_bytes || 0) / (1024 * 1024 * 1024)).toFixed(1)} GB / {((user?.storage_quota_bytes || 10 * 1024 * 1024 * 1024) / (1024 * 1024 * 1024)).toFixed(0)} GB
              </span>
            </div>
            <div className="h-1.5 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((user?.storage_used_bytes || 0) / (user?.storage_quota_bytes || 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 h-screen border-r border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 sticky top-0">
        {navContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-surface-950 border-r border-surface-200 dark:border-surface-800"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              <X className="w-5 h-5" />
            </button>
            {navContent}
          </motion.aside>
        </div>
      )}
    </>
  );
}
