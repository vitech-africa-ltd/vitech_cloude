import { motion } from "framer-motion";
import { Clock, FileText, Image, Video, Music, Archive, Presentation, FileSpreadsheet, File, Folder } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { useStorage } from "../context/StorageContext";
import { formatBytes, formatDate, getFileInfo } from "../lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Image, Video, Music, Archive, Presentation, FileSpreadsheet, File, Folder,
};

export function Recent() {
  const { files } = useStorage();
  const recent = files.filter((f) => !f.is_trashed).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 20);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">🕘 Recent Files</h1>
          <p className="text-surface-600 dark:text-surface-400">Files you've recently modified</p>
        </div>

        <Card>
          <div className="divide-y divide-surface-200 dark:divide-surface-800">
            {recent.map((file) => {
              const fileInfo = getFileInfo(file.mime_type, file.extension);
              const Icon = iconMap[fileInfo.icon] || File;
              return (
                <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${fileInfo.color}20` }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-surface-500">{formatBytes(file.size)}</p>
                  </div>
                  <div className="text-xs text-surface-500 flex-shrink-0">{formatDate(file.updated_at)}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
