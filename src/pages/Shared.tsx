import { motion } from "framer-motion";
import { Share2, Copy, ExternalLink } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useStorage } from "../context/StorageContext";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../lib/utils";

export function Shared() {
  const { shares, files } = useStorage();
  const { addToast } = useToast();

  const handleCopy = (token: string) => {
    const link = `${window.location.origin}/s/${token}`;
    navigator.clipboard.writeText(link);
    addToast({ type: "success", title: "Link copied!" });
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">🔗 Shared Files</h1>
          <p className="text-surface-600 dark:text-surface-400">Files you've shared with others</p>
        </div>

        {shares.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-10 h-10 text-surface-400" />
            </div>
            <p className="text-lg font-medium text-surface-900 dark:text-white mb-1">No shared files</p>
            <p className="text-sm text-surface-500">Share files to see them here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shares.map((share) => {
              const file = files.find((f) => f.id === share.file_id);
              return (
                <Card key={share.id} hover>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Share2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                          {file?.name || "Unknown file"}
                        </p>
                        <p className="text-xs text-surface-500">
                          {share.download_count} downloads • Created {formatDate(share.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleCopy(share.token)}>
                          <Copy className="w-4 h-4" /> Copy Link
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
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
