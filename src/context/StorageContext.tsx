import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { FileItem, Folder, UploadTask, ActivityLog, Share, ActivityAction } from "../types";
import { config } from "../config";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { getFileExtension } from "../lib/utils";
import { supabase } from "../lib/supabase/client";

interface StorageContextType {
  files: FileItem[];
  folders: Folder[];
  currentFolderId: string | null;
  uploads: UploadTask[];
  activities: ActivityLog[];
  shares: Share[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  navigateToFolder: (folderId: string | null) => void;
  createFolder: (name: string, parentId?: string | null) => Promise<Folder>;
  uploadFiles: (files: File[], folderId?: string | null) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  restoreFile: (fileId: string) => Promise<void>;
  permanentDelete: (fileId: string) => Promise<void>;
  toggleFavorite: (fileId: string) => Promise<void>;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;
  moveFile: (fileId: string, targetFolderId: string | null) => Promise<void>;
  shareFile: (fileId: string, options?: Partial<Share>) => Promise<Share>;
  getDownloadUrl: (fileId: string) => Promise<string>;
  logActivity: (action: ActivityAction, metadata?: Record<string, unknown>) => void;
  refreshData: () => Promise<void>;
  getBreadcrumbs: () => { id: string | null; name: string }[];
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

// Demo data generator
function generateDemoData(): { files: FileItem[]; folders: Folder[]; activities: ActivityLog[] } {
  const userId = "demo-user-id";
  const now = Date.now();

  const folders: Folder[] = [
    { id: "f1", user_id: userId, parent_id: null, name: "Documents", created_at: new Date(now - 86400000 * 20).toISOString(), updated_at: new Date(now - 86400000).toISOString() },
    { id: "f2", user_id: userId, parent_id: null, name: "Projects", created_at: new Date(now - 86400000 * 15).toISOString(), updated_at: new Date(now - 86400000 * 2).toISOString() },
    { id: "f3", user_id: userId, parent_id: null, name: "Images", created_at: new Date(now - 86400000 * 10).toISOString(), updated_at: new Date(now - 86400000 * 3).toISOString() },
    { id: "f4", user_id: userId, parent_id: "f1", name: "Work", created_at: new Date(now - 86400000 * 8).toISOString(), updated_at: new Date(now - 86400000).toISOString() },
    { id: "f5", user_id: userId, parent_id: "f2", name: "VITECH", created_at: new Date(now - 86400000 * 5).toISOString(), updated_at: new Date(now - 86400000).toISOString() },
    { id: "f6", user_id: userId, parent_id: "f2", name: "Business Manager", created_at: new Date(now - 86400000 * 3).toISOString(), updated_at: new Date(now - 86400000).toISOString() },
  ];

  const files: FileItem[] = [
    { id: "file1", user_id: userId, folder_id: "f4", name: "Q4-Report.pdf", storage_key: "users/demo/files/file1", mime_type: "application/pdf", size: 2456789, extension: "pdf", is_favorite: true, is_trashed: false, created_at: new Date(now - 86400000 * 2).toISOString(), updated_at: new Date(now - 86400000).toISOString() },
    { id: "file2", user_id: userId, folder_id: "f5", name: "VITECH-Business-Manager.zip", storage_key: "users/demo/files/file2", mime_type: "application/zip", size: 125829120, extension: "zip", is_favorite: true, is_trashed: false, created_at: new Date(now - 86400000 * 5).toISOString(), updated_at: new Date(now - 86400000 * 2).toISOString() },
    { id: "file3", user_id: userId, folder_id: "f3", name: "Company-Logo.png", storage_key: "users/demo/files/file3", mime_type: "image/png", size: 456789, extension: "png", is_favorite: true, is_trashed: false, created_at: new Date(now - 86400000 * 7).toISOString(), updated_at: new Date(now - 86400000 * 3).toISOString() },
    { id: "file4", user_id: userId, folder_id: null, name: "Project-Proposal.docx", storage_key: "users/demo/files/file4", mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 1234567, extension: "docx", is_favorite: false, is_trashed: false, created_at: new Date(now - 86400000 * 1).toISOString(), updated_at: new Date(now - 3600000).toISOString() },
    { id: "file5", user_id: userId, folder_id: "f3", name: "Team-Photo.jpg", storage_key: "users/demo/files/file5", mime_type: "image/jpeg", size: 3456789, extension: "jpg", is_favorite: false, is_trashed: false, created_at: new Date(now - 86400000 * 4).toISOString(), updated_at: new Date(now - 86400000 * 4).toISOString() },
    { id: "file6", user_id: userId, folder_id: "f6", name: "Dashboard-Mockup.png", storage_key: "users/demo/files/file6", mime_type: "image/png", size: 890123, extension: "png", is_favorite: false, is_trashed: false, created_at: new Date(now - 3600000 * 12).toISOString(), updated_at: new Date(now - 3600000 * 12).toISOString() },
    { id: "file7", user_id: userId, folder_id: null, name: "Presentation.pptx", storage_key: "users/demo/files/file7", mime_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation", size: 5678901, extension: "pptx", is_favorite: false, is_trashed: false, created_at: new Date(now - 86400000 * 6).toISOString(), updated_at: new Date(now - 86400000 * 6).toISOString() },
    { id: "file8", user_id: userId, folder_id: "f4", name: "Budget-2024.xlsx", storage_key: "users/demo/files/file8", mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: 234567, extension: "xlsx", is_favorite: false, is_trashed: false, created_at: new Date(now - 86400000 * 9).toISOString(), updated_at: new Date(now - 86400000 * 9).toISOString() },
    { id: "file9", user_id: userId, folder_id: null, name: "demo-video.mp4", storage_key: "users/demo/files/file9", mime_type: "video/mp4", size: 45678901, extension: "mp4", is_favorite: false, is_trashed: true, trashed_at: new Date(now - 86400000 * 3).toISOString(), created_at: new Date(now - 86400000 * 10).toISOString(), updated_at: new Date(now - 86400000 * 3).toISOString() },
    { id: "file10", user_id: userId, folder_id: "f1", name: "notes.txt", storage_key: "users/demo/files/file10", mime_type: "text/plain", size: 12345, extension: "txt", is_favorite: false, is_trashed: false, created_at: new Date(now - 86400000 * 1).toISOString(), updated_at: new Date(now - 86400000).toISOString() },
  ];

  const activities: ActivityLog[] = [
    { id: "a1", user_id: userId, user_name: "Vab Idriss", action: "UPLOAD", file_name: "Project-Proposal.docx", created_at: new Date(now - 3600000).toISOString() },
    { id: "a2", user_id: userId, user_name: "Vab Idriss", action: "DOWNLOAD", file_name: "Q4-Report.pdf", created_at: new Date(now - 7200000).toISOString() },
    { id: "a3", user_id: userId, user_name: "Vab Idriss", action: "CREATE_FOLDER", file_name: "VITECH", created_at: new Date(now - 86400000).toISOString() },
    { id: "a4", user_id: userId, user_name: "Vab Idriss", action: "SHARE", file_name: "Company-Logo.png", created_at: new Date(now - 86400000 * 2).toISOString() },
    { id: "a5", user_id: userId, user_name: "Vab Idriss", action: "LOGIN", created_at: new Date(now - 86400000 * 3).toISOString() },
  ];

  return { files, folders, activities };
}

export function StorageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [shares, setShares] = useState<Share[]>([]);
  const [uploads, setUploads] = useState<UploadTask[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    if (config.isDemoMode) {
      const demo = generateDemoData();
      setFiles(demo.files);
      setFolders(demo.folders);
      setActivities(demo.activities);
      setLoading(false);
      return;
    }
    const [filesRes, foldersRes, activitiesRes, sharesRes] = await Promise.all([
      supabase.from("files").select("*").eq("user_id", user.user_id).order("created_at", { ascending: false }),
      supabase.from("folders").select("*").eq("user_id", user.user_id).order("name"),
      supabase.from("activity_logs").select("*").eq("user_id", user.user_id).order("created_at", { ascending: false }).limit(50),
      supabase.from("shares").select("*").eq("owner_id", user.user_id),
    ]);
    if (filesRes.data) setFiles(filesRes.data as FileItem[]);
    if (foldersRes.data) setFolders(foldersRes.data as Folder[]);
    if (activitiesRes.data) setActivities(activitiesRes.data as ActivityLog[]);
    if (sharesRes.data) setShares(sharesRes.data as Share[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const logActivity = useCallback((action: ActivityAction, metadata?: Record<string, unknown>) => {
    if (!user) return;
    const newActivity: ActivityLog = {
      id: uuidv4(),
      user_id: user.user_id,
      user_name: user.full_name,
      action,
      metadata,
      file_name: metadata?.file_name as string | undefined,
      created_at: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, 100));
    if (!config.isDemoMode) {
      supabase.from("activity_logs").insert({ ...newActivity, user_id: user.user_id });
    }
  }, [user]);

  const navigateToFolder = (folderId: string | null) => setCurrentFolderId(folderId);

  const createFolder = async (name: string, parentId: string | null = currentFolderId): Promise<Folder> => {
    const folder: Folder = {
      id: uuidv4(),
      user_id: user!.user_id,
      parent_id: parentId,
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (config.isDemoMode) {
      setFolders((prev) => [...prev, folder]);
      logActivity("CREATE_FOLDER", { file_name: name });
      addToast({ type: "success", title: "Folder created", message: name });
      return folder;
    }
    const { data, error } = await supabase.from("folders").insert(folder).select().single();
    if (error) throw error;
    setFolders((prev) => [...prev, data as Folder]);
    logActivity("CREATE_FOLDER", { file_name: name });
    addToast({ type: "success", title: "Folder created", message: name });
    return data as Folder;
  };

  const uploadFiles = async (fileList: File[], folderId: string | null = currentFolderId) => {
    if (!user) return;
    const tasks: UploadTask[] = fileList.map((file) => ({
      id: uuidv4(),
      file,
      progress: 0,
      status: "pending",
      folder_id: folderId,
    }));
    setUploads((prev) => [...prev, ...tasks]);

    for (const task of tasks) {
      setUploads((prev) => prev.map((t) => t.id === task.id ? { ...t, status: "uploading" } : t));

      // Simulate progress for demo
      if (config.isDemoMode) {
        for (let p = 0; p <= 100; p += Math.random() * 20 + 5) {
          await new Promise((r) => setTimeout(r, 100));
          setUploads((prev) => prev.map((t) => t.id === task.id ? { ...t, progress: Math.min(100, Math.round(p)) } : t));
        }
      } else {
        // Real upload via Supabase Storage
        const storageKey = `users/${user.user_id}/files/${task.id}`;
        const { error } = await supabase.storage.from("vitech-files").upload(storageKey, task.file, { upsert: false });
        if (error) {
          setUploads((prev) => prev.map((t) => t.id === task.id ? { ...t, status: "error", error: error.message } : t));
          continue;
        }
        setUploads((prev) => prev.map((t) => t.id === task.id ? { ...t, progress: 100 } : t));
      }

      const newFile: FileItem = {
        id: task.id,
        user_id: user.user_id,
        folder_id: task.folder_id,
        name: task.file.name,
        storage_key: `users/${user.user_id}/files/${task.id}`,
        mime_type: task.file.type || "application/octet-stream",
        size: task.file.size,
        extension: getFileExtension(task.file.name),
        is_favorite: false,
        is_trashed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (config.isDemoMode) {
        setFiles((prev) => [newFile, ...prev]);
      } else {
        await supabase.from("files").insert(newFile);
        await supabase.from("profiles").update({
          storage_used_bytes: user.storage_used_bytes + task.file.size,
        }).eq("user_id", user.user_id);
      }

      setUploads((prev) => prev.map((t) => t.id === task.id ? { ...t, status: "complete", progress: 100 } : t));
      logActivity("UPLOAD", { file_name: task.file.name, size: task.file.size });
      addToast({ type: "success", title: "Upload complete", message: task.file.name });
    }

    setTimeout(() => setUploads((prev) => prev.filter((t) => !tasks.find((tk) => tk.id === t.id))), 3000);
  };

  const deleteFile = async (fileId: string) => {
    setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, is_trashed: true, trashed_at: new Date().toISOString() } : f));
    const file = files.find((f) => f.id === fileId);
    if (file) logActivity("DELETE", { file_name: file.name });
    if (!config.isDemoMode) {
      await supabase.from("files").update({ is_trashed: true, trashed_at: new Date().toISOString() }).eq("id", fileId).eq("user_id", user!.user_id);
    }
    addToast({ type: "info", title: "Moved to trash" });
  };

  const deleteFolder = async (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    // Move all files in this folder to trash
    setFiles((prev) => prev.map((f) => f.folder_id === folderId ? { ...f, is_trashed: true, trashed_at: new Date().toISOString() } : f));
    // Move all subfolders' files to trash recursively
    const childFolders = folders.filter((f) => f.parent_id === folderId);
    for (const child of childFolders) {
      setFiles((prev) => prev.map((f) => f.folder_id === child.id ? { ...f, is_trashed: true, trashed_at: new Date().toISOString() } : f));
    }
    // Remove the folder and its children
    setFolders((prev) => prev.filter((f) => f.id !== folderId && f.parent_id !== folderId));
    if (folder) logActivity("DELETE", { file_name: folder.name });
    if (!config.isDemoMode) {
      await supabase.from("folders").delete().eq("id", folderId).eq("user_id", user!.user_id);
    }
    addToast({ type: "info", title: "Folder deleted" });
  };

  const restoreFile = async (fileId: string) => {
    setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, is_trashed: false, trashed_at: undefined } : f));
    logActivity("RESTORE");
    addToast({ type: "success", title: "File restored" });
    if (!config.isDemoMode) {
      await supabase.from("files").update({ is_trashed: false, trashed_at: null }).eq("id", fileId).eq("user_id", user!.user_id);
    }
  };

  const permanentDelete = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (!config.isDemoMode && file) {
      await supabase.storage.from("vitech-files").remove([file.storage_key]);
      await supabase.from("files").delete().eq("id", fileId).eq("user_id", user!.user_id);
    }
    addToast({ type: "info", title: "Permanently deleted" });
  };

  const toggleFavorite = async (fileId: string) => {
    setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, is_favorite: !f.is_favorite } : f));
    if (!config.isDemoMode) {
      const file = files.find((f) => f.id === fileId);
      if (file) await supabase.from("files").update({ is_favorite: !file.is_favorite }).eq("id", fileId).eq("user_id", user!.user_id);
    }
  };

  const renameFile = async (fileId: string, newName: string) => {
    setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, name: newName, extension: getFileExtension(newName), updated_at: new Date().toISOString() } : f));
    logActivity("RENAME", { file_name: newName });
    if (!config.isDemoMode) {
      await supabase.from("files").update({ name: newName, extension: getFileExtension(newName) }).eq("id", fileId).eq("user_id", user!.user_id);
    }
  };

  const renameFolder = async (folderId: string, newName: string) => {
    setFolders((prev) => prev.map((f) => f.id === folderId ? { ...f, name: newName, updated_at: new Date().toISOString() } : f));
    if (!config.isDemoMode) {
      await supabase.from("folders").update({ name: newName }).eq("id", folderId).eq("user_id", user!.user_id);
    }
  };

  const moveFile = async (fileId: string, targetFolderId: string | null) => {
    setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, folder_id: targetFolderId } : f));
    logActivity("MOVE");
    if (!config.isDemoMode) {
      await supabase.from("files").update({ folder_id: targetFolderId }).eq("id", fileId).eq("user_id", user!.user_id);
    }
  };

  const shareFile = async (fileId: string, options?: Partial<Share>): Promise<Share> => {
    const share: Share = {
      id: uuidv4(),
      file_id: fileId,
      owner_id: user!.user_id,
      token: uuidv4().replace(/-/g, "").slice(0, 16),
      is_public: options?.is_public ?? true,
      allow_download: options?.allow_download ?? true,
      download_count: 0,
      expires_at: options?.expires_at,
      created_at: new Date().toISOString(),
    };
    setShares((prev) => [...prev, share]);
    logActivity("SHARE");
    if (!config.isDemoMode) {
      await supabase.from("shares").insert(share);
    }
    addToast({ type: "success", title: "Share link created" });
    return share;
  };

  const getDownloadUrl = async (fileId: string): Promise<string> => {
    const file = files.find((f) => f.id === fileId);
    if (!file) throw new Error("File not found");
    if (config.isDemoMode) {
      return URL.createObjectURL(new Blob(["Demo file content"], { type: file.mime_type }));
    }
    const result = await supabase.storage.from("vitech-files").createSignedUrl(file.storage_key, 3600);
    return result.data?.signedUrl || "";
  };

  const refreshData = async () => { await loadData(); };

  const getBreadcrumbs = (): { id: string | null; name: string }[] => {
    const crumbs: { id: string | null; name: string }[] = [{ id: null, name: "My Files" }];
    let currentId = currentFolderId;
    const trail: { id: string; name: string }[] = [];
    while (currentId) {
      const folder = folders.find((f) => f.id === currentId);
      if (!folder) break;
      trail.unshift({ id: folder.id, name: folder.name });
      currentId = folder.parent_id;
    }
    return [...crumbs, ...trail];
  };

  return (
    <StorageContext.Provider value={{
      files, folders, currentFolderId, uploads, activities, shares, loading, searchQuery,
      setSearchQuery, navigateToFolder, createFolder, uploadFiles, deleteFile, deleteFolder,
      restoreFile, permanentDelete, toggleFavorite, renameFile, renameFolder, moveFile,
      shareFile, getDownloadUrl, logActivity, refreshData, getBreadcrumbs,
    }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error("useStorage must be used within StorageProvider");
  return ctx;
}
