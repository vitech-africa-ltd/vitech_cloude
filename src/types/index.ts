// VITECH Cloud — Core Types

export type Role = "USER" | "ADMIN";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: Role;
  storage_quota_bytes: number;
  storage_used_bytes: number;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface FileItem {
  id: string;
  user_id: string;
  folder_id: string | null;
  name: string;
  storage_key: string;
  mime_type: string;
  size: number;
  extension: string;
  checksum?: string;
  thumbnail_url?: string;
  is_favorite: boolean;
  is_trashed: boolean;
  trashed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Share {
  id: string;
  file_id: string;
  owner_id: string;
  token: string;
  password_hash?: string;
  expires_at?: string;
  max_downloads?: number;
  download_count: number;
  allow_download: boolean;
  is_public: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name?: string;
  action: ActivityAction;
  file_id?: string;
  file_name?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export type ActivityAction =
  | "LOGIN"
  | "LOGOUT"
  | "UPLOAD"
  | "DOWNLOAD"
  | "DELETE"
  | "RESTORE"
  | "SHARE"
  | "RENAME"
  | "MOVE"
  | "CREATE_FOLDER"
  | "ADMIN_ACTION";

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

export interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  error?: string;
  folder_id: string | null;
}

export interface StorageStats {
  total_bytes: number;
  used_bytes: number;
  file_count: number;
  folder_count: number;
}

export interface AdminStats {
  users_count: number;
  files_count: number;
  storage_used_bytes: number;
  uploads_today: number;
}

export const MIME_CONFIG: Record<string, { category: string; icon: string; color: string }> = {
  "application/pdf": { category: "document", icon: "FileText", color: "#ef4444" },
  "application/msword": { category: "document", icon: "FileText", color: "#2563eb" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { category: "document", icon: "FileText", color: "#2563eb" },
  "application/vnd.ms-excel": { category: "document", icon: "FileSpreadsheet", color: "#16a34a" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { category: "document", icon: "FileSpreadsheet", color: "#16a34a" },
  "application/vnd.ms-powerpoint": { category: "document", icon: "Presentation", color: "#ea580c" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { category: "document", icon: "Presentation", color: "#ea580c" },
  "text/plain": { category: "document", icon: "FileText", color: "#64748b" },
  "text/csv": { category: "document", icon: "FileSpreadsheet", color: "#16a34a" },
  "application/zip": { category: "archive", icon: "Archive", color: "#ca8a04" },
  "application/x-rar-compressed": { category: "archive", icon: "Archive", color: "#ca8a04" },
  "application/x-7z-compressed": { category: "archive", icon: "Archive", color: "#ca8a04" },
  "image/jpeg": { category: "image", icon: "Image", color: "#ec4899" },
  "image/png": { category: "image", icon: "Image", color: "#ec4899" },
  "image/webp": { category: "image", icon: "Image", color: "#ec4899" },
  "image/gif": { category: "image", icon: "Image", color: "#ec4899" },
  "image/svg+xml": { category: "image", icon: "Image", color: "#ec4899" },
  "video/mp4": { category: "video", icon: "Video", color: "#8b5cf6" },
  "video/webm": { category: "video", icon: "Video", color: "#8b5cf6" },
  "video/quicktime": { category: "video", icon: "Video", color: "#8b5cf6" },
  "audio/mpeg": { category: "audio", icon: "Music", color: "#f59e0b" },
  "audio/wav": { category: "audio", icon: "Music", color: "#f59e0b" },
  "audio/ogg": { category: "audio", icon: "Music", color: "#f59e0b" },
};

export const DEFAULT_FILE_INFO = { category: "file", icon: "File", color: "#64748b" };

export const ALLOWED_EXTENSIONS = [
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv",
  "zip", "rar", "7z", "tar", "gz",
  "jpg", "jpeg", "png", "webp", "gif", "svg",
  "mp4", "webm", "mov",
  "mp3", "wav", "ogg",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB
export const DEFAULT_QUOTA = 10 * 1024 * 1024 * 1024; // 10 GB
