import { motion } from "framer-motion";
import { HardDrive, Shield } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import { formatBytes } from "../../lib/utils";

export function AdminStorage() {
  const { user } = useAuth();

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
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Storage Analytics</h1>
          <p className="text-surface-600 dark:text-surface-400">Monitor storage usage and trends</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <HardDrive className="w-8 h-8 text-brand-600 mb-3" />
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Total Capacity</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">1 TB</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <HardDrive className="w-8 h-8 text-orange-600 mb-3" />
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Used Storage</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">782 GB</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <HardDrive className="w-8 h-8 text-green-600 mb-3" />
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Available</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">218 GB</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Storage Distribution</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-surface-600 dark:text-surface-400">Overall usage</span>
                  <span className="font-medium text-surface-900 dark:text-white">78%</span>
                </div>
                <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                  <div className="h-full w-[78%] bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full" />
                </div>
              </div>

              <div className="pt-4 border-t border-surface-200 dark:border-surface-800">
                <h4 className="text-sm font-medium text-surface-900 dark:text-white mb-4">By file type</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-surface-600 dark:text-surface-400">Documents</span>
                      <span className="font-medium text-surface-900 dark:text-white">245 GB</span>
                    </div>
                    <div className="h-2 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                      <div className="h-full w-[31%] bg-blue-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-surface-600 dark:text-surface-400">Images</span>
                      <span className="font-medium text-surface-900 dark:text-white">312 GB</span>
                    </div>
                    <div className="h-2 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                      <div className="h-full w-[40%] bg-pink-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-surface-600 dark:text-surface-400">Videos</span>
                      <span className="font-medium text-surface-900 dark:text-white">156 GB</span>
                    </div>
                    <div className="h-2 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                      <div className="h-full w-[20%] bg-purple-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-surface-600 dark:text-surface-400">Other</span>
                      <span className="font-medium text-surface-900 dark:text-white">69 GB</span>
                    </div>
                    <div className="h-2 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                      <div className="h-full w-[9%] bg-orange-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
