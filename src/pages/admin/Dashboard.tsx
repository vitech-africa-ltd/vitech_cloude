import { motion } from "framer-motion";
import { Users, FileText, HardDrive, Upload, Shield } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { useStorage } from "../../context/StorageContext";
import { useAuth } from "../../context/AuthContext";
import { formatBytes, formatDate } from "../../lib/utils";
import { Link } from "react-router-dom";

export function AdminDashboard() {
  const { user } = useAuth();
  const { files, folders, activities } = useStorage();

  if (user?.role !== "ADMIN") {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-surface-500">You don't have permission to access this page.</p>
      </div>
    );
  }

  const stats = [
    { label: "Total Users", value: "127", icon: Users, color: "from-blue-500 to-cyan-500" },
    { label: "Total Files", value: files.length.toLocaleString(), icon: FileText, color: "from-purple-500 to-pink-500" },
    { label: "Storage Used", value: formatBytes(user?.storage_used_bytes || 0), icon: HardDrive, color: "from-orange-500 to-red-500" },
    { label: "Uploads Today", value: "284", icon: Upload, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-brand-600" />
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400">Manage your VITECH Cloud platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Storage Usage */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Storage Usage</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-surface-600 dark:text-surface-400">Platform storage</span>
                    <span className="font-medium text-surface-900 dark:text-white">78%</span>
                  </div>
                  <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full" />
                  </div>
                </div>
                <div className="pt-4 border-t border-surface-200 dark:border-surface-800 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-600 dark:text-surface-400">Total capacity</span>
                    <span className="font-medium text-surface-900 dark:text-white">1 TB</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-600 dark:text-surface-400">Used</span>
                    <span className="font-medium text-surface-900 dark:text-white">782 GB</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-600 dark:text-surface-400">Available</span>
                    <span className="font-medium text-green-600 dark:text-green-400">218 GB</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {activity.user_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-surface-900 dark:text-white">
                        <span className="font-medium">{activity.user_name}</span>{" "}
                        <span className="text-surface-600 dark:text-surface-400">
                          {activity.action.toLowerCase().replace("_", " ")}
                        </span>{" "}
                        {activity.file_name && <span className="font-medium">{activity.file_name}</span>}
                      </p>
                      <p className="text-xs text-surface-500">{formatDate(activity.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Quick Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link to="/admin/users">
                <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 hover:border-brand-500 dark:hover:border-brand-500 transition-colors cursor-pointer">
                  <Users className="w-8 h-8 text-brand-600 mb-2" />
                  <h4 className="font-medium text-surface-900 dark:text-white mb-1">Manage Users</h4>
                  <p className="text-sm text-surface-500">View and manage user accounts</p>
                </div>
              </Link>
              <Link to="/admin/storage">
                <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 hover:border-brand-500 dark:hover:border-brand-500 transition-colors cursor-pointer">
                  <HardDrive className="w-8 h-8 text-brand-600 mb-2" />
                  <h4 className="font-medium text-surface-900 dark:text-white mb-1">Storage Analytics</h4>
                  <p className="text-sm text-surface-500">Monitor storage usage and trends</p>
                </div>
              </Link>
              <Link to="/admin/activity">
                <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 hover:border-brand-500 dark:hover:border-brand-500 transition-colors cursor-pointer">
                  <FileText className="w-8 h-8 text-brand-600 mb-2" />
                  <h4 className="font-medium text-surface-900 dark:text-white mb-1">Activity Logs</h4>
                  <p className="text-sm text-surface-500">View platform activity logs</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
