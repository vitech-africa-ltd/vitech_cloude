import { motion } from "framer-motion";
import { Trash2, RotateCcw, X, FileText, Image, Video, Music, Archive, Presentation, FileSpreadsheet, File, Folder } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useStorage } from "../context/StorageContext";
import { useToast } from "../context/ToastContext";
import { formatBytes, formatDate, getFileInfo } from "../lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Image, Video, Music, Archive, Presentation, FileSpreadsheet, File, Folder,
};

export function Trash() {
  const { files, restoreFile, permanentDelete } = useStorage();
  const { addToast } = useToast();
  const trashedFiles = files.filter((f) => f.is_trashed);

  const handleRestore = async (fileId: string) => {
    await restoreFile(fileId);
    addToast({ type: "success", title: "File restored" });
  };

  const handlePermanentDelete = async (fileId: string) => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      await permanentDelete(fileId);
      addToast({ type: "info", title: "Permanently deleted" });
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">🗑 Trash</h1>
          <p className="text-surface-600 dark:text-surface-400">
            {trashedFiles.length} {trashedFiles.length === 1 ? "item" : "items"} in trash
          </p>
        </div>

        {trashedFiles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-10 h-10 text-surface-400" />
            </div>
            <p className="text-lg font-medium text-surface-900 dark:text-white mb-1">Trash is empty</p>
            <p className="text-sm text-surface-500">Deleted files will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trashedFiles.map((file) => {
              const fileInfo = getFileInfo(file.mime_type, file.extension);
              const Icon = iconMap[fileInfo.icon] || File;
              return (
                <Card key={file.id} hover>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${fileInfo.color}20` }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                        <p className="text-xs text-surface-500">
                          {formatBytes(file.size)} • Deleted {file.trashed_at ? formatDate(file.trashed_at) : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleRestore(file.id)}>
                          <RotateCcw className="w-4 h-4" /> Restore
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handlePermanentDelete(file.id)}>
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
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
