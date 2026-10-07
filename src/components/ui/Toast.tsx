import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "../../lib/utils";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm",
              "bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800"
            )}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-surface-900 dark:text-white">{toast.title}</p>
              {toast.message && <p className="text-sm text-surface-600 dark:text-surface-400 mt-0.5">{toast.message}</p>}
            </div>
            <button onClick={() => removeToast(toast.id)} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800">
              <X className="w-4 h-4 text-surface-400" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
