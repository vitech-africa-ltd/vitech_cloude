import { motion } from "framer-motion";
import { Star, FileText, Image, Video, Music, Archive, Presentation, FileSpreadsheet, File, Folder } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { useStorage } from "../context/StorageContext";
import { formatBytes, formatDate, getFileInfo } from "../lib/utils";
import { FileItem } from "../types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Image, Video, Music, Archive, Presentation, FileSpreadsheet, File, Folder,
};

export function Favorites() {
  const { files, toggleFavorite } = useStorage();
  const favorites = files.filter((f) => f.is_favorite && !f.is_trashed);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">⭐ Favorites</h1>
          <p className="text-surface-600 dark:text-surface-400">Your starred files and folders</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-surface-400" />
            </div>
            <p className="text-lg font-medium text-surface-900 dark:text-white mb-1">No favorites yet</p>
            <p className="text-sm text-surface-500">Star files to quickly access them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map((file) => {
              const fileInfo = getFileInfo(file.mime_type, file.extension);
              const Icon = iconMap[fileInfo.icon] || File;
              return (
                <Card key={file.id} hover className="cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${fileInfo.color}20` }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(file.id); }}
                        className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800"
                      >
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-surface-500 mt-0.5">{formatBytes(file.size)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
