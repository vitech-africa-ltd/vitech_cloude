import { motion } from "framer-motion";
import { FileText, Shield } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { useStorage } from "../../context/StorageContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../lib/utils";

export function AdminActivity() {
  const { user } = useAuth();
  const { activities } = useStorage();

  if (user?.role !== "ADMIN") {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-surface-500">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Activity Logs</h1>
          <p className="text-surface-600 dark:text-surface-400">Monitor platform activity and user actions</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-800">
                    <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase">User</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase hidden md:table-cell">File</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase hidden lg:table-cell">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id} className="border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {activity.user_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
                          </div>
                          <span className="text-sm font-medium text-surface-900 dark:text-white">{activity.user_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300">
                          <FileText className="w-3 h-3" />
                          {activity.action.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-surface-600 dark:text-surface-400 hidden md:table-cell">
                        {activity.file_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-surface-500 hidden lg:table-cell">
                        {formatDate(activity.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
