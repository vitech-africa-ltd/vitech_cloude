import { motion } from "framer-motion";
import { HardDrive, FileText, Folder, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { useStorage } from "../context/StorageContext";
import { formatBytes, formatDate, getFileInfo } from "../lib/utils";
import {
  FileText as FileTextIcon,
  Image,
  Video,
  Music,
  Archive,
  Presentation,
  FileSpreadsheet,
  File,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText: FileTextIcon,
  Image,
  Video,
  Music,
  Archive,
  Presentation,
  FileSpreadsheet,
  File,
};

export function Dashboard() {
  const { user } = useAuth();
  const { files, folders, activities } = useStorage();

  const recentFiles = files.filter((f) => !f.is_trashed).slice(0, 5);
  const storagePercent = ((user?.storage_used_bytes || 0) / (user?.storage_quota_bytes || 1)) * 100;

  const stats = [
    { label: "Total Files", value: files.filter((f) => !f.is_trashed).length.toString(), icon: FileText, color: "from-blue-500 to-cyan-500" },
    { label: "Folders", value: folders.length.toString(), icon: Folder, color: "from-purple-500 to-pink-500" },
    { label: "Storage Used", value: formatBytes(user?.storage_used_bytes || 0), icon: HardDrive, color: "from-orange-500 to-red-500" },
    { label: "Recent Activity", value: activities.length.toString(), icon: Clock, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
            Hello, {user?.full_name?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="text-surface-600 dark:text-surface-400">Welcome back to your cloud</p>
        </div>

        {/* Stats Grid */}
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
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Storage Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Storage</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-surface-600 dark:text-surface-400">Used</span>
                    <span className="font-medium text-surface-900 dark:text-white">
                      {formatBytes(user?.storage_used_bytes || 0)} / {formatBytes(user?.storage_quota_bytes || 0)}
                    </span>
                  </div>
                  <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${storagePercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-surface-500 mt-2">{storagePercent.toFixed(1)}% used</p>
                </div>

                <div className="pt-4 border-t border-surface-200 dark:border-surface-800 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-600 dark:text-surface-400">Documents</span>
                    <span className="font-medium text-surface-900 dark:text-white">2.4 GB</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-600 dark:text-surface-400">Images</span>
                    <span className="font-medium text-surface-900 dark:text-white">3.1 GB</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-600 dark:text-surface-400">Videos</span>
                    <span className="font-medium text-surface-900 dark:text-white">1.2 GB</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-600 dark:text-surface-400">Other</span>
                    <span className="font-medium text-surface-900 dark:text-white">0.5 GB</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Files */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Files</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentFiles.map((file) => {
                  const fileInfo = getFileInfo(file.mime_type, file.extension);
                  const Icon = iconMap[fileInfo.icon] || File;
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${fileInfo.color}20` }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                        <p className="text-xs text-surface-500">{formatBytes(file.size)}</p>
                      </div>
                      <div className="text-xs text-surface-500">{formatDate(file.updated_at)}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity */}
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
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
      </motion.div>
    </div>
  );
}
