import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Plus, Grid3X3, List, MoreVertical, Download, Trash2, Star,
  FolderPlus, Search, ChevronRight, Folder, FileText, Image, Video,
  Music, Archive, Presentation, FileSpreadsheet, File, Share2, Edit3,
  FolderOpen, Copy, Info, X, Check,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { useStorage } from "../context/StorageContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatBytes, formatDate, getFileInfo, getFileExtension } from "../lib/utils";
import { FileItem, Folder as FolderType, UploadTask } from "../types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Image, Video, Music, Archive, Presentation, FileSpreadsheet, File, Folder,
};

export function Files() {
  const {
    files, folders, currentFolderId, uploads, searchQuery,
    navigateToFolder, createFolder, uploadFiles, deleteFile, deleteFolder,
    toggleFavorite, renameFile, renameFolder, moveFile, shareFile,
    getDownloadUrl, getBreadcrumbs,
  } = useStorage();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FileItem | FolderType; type: "file" | "folder" } | null>(null);
  const [renameModal, setRenameModal] = useState<{ item: FileItem | FolderType; type: "file" | "folder" } | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [moveModal, setMoveModal] = useState<FileItem | null>(null);
  const [shareModal, setShareModal] = useState<FileItem | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const breadcrumbs = getBreadcrumbs();
  const currentFolders = folders.filter((f) => f.parent_id === currentFolderId);
  const currentFiles = files.filter((f) => f.folder_id === currentFolderId && !f.is_trashed);

  const filteredFolders = searchQuery
    ? folders.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : currentFolders;

  const filteredFiles = searchQuery
    ? files.filter((f) => !f.is_trashed && f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : currentFiles;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) uploadFiles(droppedFiles);
  }, [uploadFiles]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    await createFolder(newFolderName.trim());
    setNewFolderName("");
    setShowNewFolder(false);
  };

  const handleContextAction = async (action: string) => {
    if (!contextMenu) return;
    const { item, type } = contextMenu;
    setContextMenu(null);

    switch (action) {
      case "open":
        if (type === "folder") navigateToFolder(item.id);
        else setPreviewFile(item as FileItem);
        break;
      case "download":
        if (type === "file") {
          const url = await getDownloadUrl(item.id);
          window.open(url, "_blank");
        }
        break;
      case "delete":
        if (type === "file") await deleteFile(item.id);
        else await deleteFolder(item.id);
        break;
      case "favorite":
        if (type === "file") await toggleFavorite(item.id);
        break;
      case "rename":
        setRenameModal({ item, type });
        setRenameValue(item.name);
        break;
      case "share":
        if (type === "file") setShareModal(item as FileItem);
        break;
      case "move":
        if (type === "file") setMoveModal(item as FileItem);
        break;
    }
  };

  const handleRename = async () => {
    if (!renameModal || !renameValue.trim()) return;
    if (renameModal.type === "file") await renameFile(renameModal.item.id, renameValue.trim());
    else await renameFolder(renameModal.item.id, renameValue.trim());
    setRenameModal(null);
    addToast({ type: "success", title: "Renamed successfully" });
  };

  const handleShare = async () => {
    if (!shareModal) return;
    const share = await shareFile(shareModal.id);
    const link = `${window.location.origin}/s/${share.token}`;
    navigator.clipboard.writeText(link);
    addToast({ type: "success", title: "Link copied!", message: link });
    setShareModal(null);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-sm text-surface-500 mb-1 flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.id ?? "root"} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                <button
                  onClick={() => navigateToFolder(crumb.id)}
                  className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${
                    i === breadcrumbs.length - 1 ? "text-surface-900 dark:text-white font-medium" : ""
                  }`}
                >
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">My Files</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-surface-200 dark:border-surface-800 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600" : "text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600" : "text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={() => setShowNewFolder(true)} variant="outline" size="sm">
            <FolderPlus className="w-4 h-4" /> New Folder
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} size="sm">
            <Upload className="w-4 h-4" /> Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) uploadFiles(Array.from(e.target.files)); }}
          />
          <input
            ref={folderInputRef}
            type="file"
            className="hidden"
            {...{ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>}
            onChange={(e) => { if (e.target.files) uploadFiles(Array.from(e.target.files)); }}
          />
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 mb-6 ${
          dragOver
            ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
            : "border-surface-300 dark:border-surface-700 hover:border-surface-400 dark:hover:border-surface-600"
        }`}
      >
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
            dragOver ? "bg-brand-100 dark:bg-brand-500/20" : "bg-surface-100 dark:bg-surface-800"
          }`}>
            <Upload className={`w-8 h-8 ${dragOver ? "text-brand-600" : "text-surface-400"}`} />
          </div>
          <p className="text-lg font-medium text-surface-900 dark:text-white mb-1">
            {dragOver ? "Drop files here" : "Drop files here"}
          </p>
          <p className="text-sm text-surface-500 mb-4">or click to browse</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["PDF", "ZIP", "DOCX", "JPG", "MP4"].map((ext) => (
              <span key={ext} className="px-2 py-1 text-xs rounded-md bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                {ext}
              </span>
            ))}
          </div>
        </div>
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        />
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-surface-900 dark:text-white">
                    Uploading {uploads.length} {uploads.length === 1 ? "file" : "files"}
                  </h3>
                </div>
                <div className="space-y-2">
                  {uploads.map((task) => (
                    <div key={task.id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-surface-700 dark:text-surface-300 truncate">{task.file.name}</p>
                        <div className="h-1.5 bg-surface-200 dark:bg-surface-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              task.status === "error" ? "bg-red-500" : "bg-gradient-to-r from-brand-500 to-cyan-500"
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-surface-500 w-10 text-right">{task.progress}%</span>
                      {task.status === "complete" && <Check className="w-4 h-4 text-green-500" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {filteredFolders.length === 0 && filteredFiles.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-10 h-10 text-surface-400" />
          </div>
          <p className="text-lg font-medium text-surface-900 dark:text-white mb-1">
            {searchQuery ? "No results found" : "This folder is empty"}
          </p>
          <p className="text-sm text-surface-500">
            {searchQuery ? "Try a different search term" : "Upload files or create a folder to get started"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFolders.map((folder) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY, item: folder, type: "folder" });
              }}
            >
              <Card hover className="cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Folder className="w-6 h-6 text-white" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenu({ x: e.clientX, y: e.clientY, item: folder, type: "folder" });
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                    >
                      <MoreVertical className="w-4 h-4 text-surface-400" />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{folder.name}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{formatDate(folder.updated_at)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredFiles.map((file) => {
            const fileInfo = getFileInfo(file.mime_type, file.extension);
            const Icon = iconMap[fileInfo.icon] || File;
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY, item: file, type: "file" });
                }}
              >
                <Card hover className="cursor-pointer group">
                  <CardContent className="p-4" onClick={() => setPreviewFile(file)} role="button" tabIndex={0}>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${fileInfo.color}20` }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1">
                        {file.is_favorite && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setContextMenu({ x: e.clientX, y: e.clientY, item: file, type: "file" });
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                        >
                          <MoreVertical className="w-4 h-4 text-surface-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-surface-500 mt-0.5">{formatBytes(file.size)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase hidden sm:table-cell">Size</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase hidden md:table-cell">Modified</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredFolders.map((folder) => (
                  <tr
                    key={folder.id}
                    className="border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer"
                    onDoubleClick={() => navigateToFolder(folder.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu({ x: e.clientX, y: e.clientY, item: folder, type: "folder" });
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <Folder className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-surface-900 dark:text-white">{folder.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-500 hidden sm:table-cell">—</td>
                    <td className="px-4 py-3 text-sm text-surface-500 hidden md:table-cell">{formatDate(folder.updated_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu({ x: e.clientX, y: e.clientY, item: folder, type: "folder" });
                        }}
                        className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800"
                      >
                        <MoreVertical className="w-4 h-4 text-surface-400" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredFiles.map((file) => {
                  const fileInfo = getFileInfo(file.mime_type, file.extension);
                  const Icon = iconMap[fileInfo.icon] || File;
                  return (
                    <tr
                      key={file.id}
                      className="border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer"
                      onClick={() => setPreviewFile(file)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({ x: e.clientX, y: e.clientY, item: file, type: "file" });
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${fileInfo.color}20` }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-surface-900 dark:text-white">{file.name}</span>
                            {file.is_favorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-surface-500 hidden sm:table-cell">{formatBytes(file.size)}</td>
                      <td className="px-4 py-3 text-sm text-surface-500 hidden md:table-cell">{formatDate(file.updated_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setContextMenu({ x: e.clientX, y: e.clientY, item: file, type: "file" });
                          }}
                          className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800"
                        >
                          <MoreVertical className="w-4 h-4 text-surface-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-800 py-2 w-48"
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              <button onClick={() => handleContextAction("open")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                <FolderOpen className="w-4 h-4" /> Open
              </button>
              {contextMenu.type === "file" && (
                <>
                  <button onClick={() => handleContextAction("download")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button onClick={() => handleContextAction("share")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                  <button onClick={() => handleContextAction("favorite")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                    <Star className="w-4 h-4" /> {(contextMenu.item as FileItem).is_favorite ? "Unfavorite" : "Favorite"}
                  </button>
                  <button onClick={() => handleContextAction("move")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                    <Copy className="w-4 h-4" /> Move
                  </button>
                </>
              )}
              <div className="border-t border-surface-200 dark:border-surface-800 my-1" />
              <button onClick={() => handleContextAction("rename")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                <Edit3 className="w-4 h-4" /> Rename
              </button>
              <button onClick={() => handleContextAction("delete")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Folder Modal */}
      <Modal isOpen={showNewFolder} onClose={() => setShowNewFolder(false)} title="New Folder" size="sm">
        <div className="p-6">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            className="w-full px-4 py-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white outline-none focus:border-brand-500"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setShowNewFolder(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </div>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal isOpen={!!renameModal} onClose={() => setRenameModal(null)} title="Rename" size="sm">
        <div className="p-6">
          <input
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="w-full px-4 py-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white outline-none focus:border-brand-500"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setRenameModal(null)}>Cancel</Button>
            <Button onClick={handleRename}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal isOpen={!!shareModal} onClose={() => setShareModal(null)} title="Share File" size="sm">
        <div className="p-6">
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
            Create a shareable link for <span className="font-medium text-surface-900 dark:text-white">{shareModal?.name}</span>
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShareModal(null)}>Cancel</Button>
            <Button onClick={handleShare}>
              <Share2 className="w-4 h-4" /> Create Link
            </Button>
          </div>
        </div>
      </Modal>

      {/* Move Modal */}
      <Modal isOpen={!!moveModal} onClose={() => setMoveModal(null)} title="Move to..." size="sm">
        <div className="p-6">
          <div className="space-y-1 max-h-60 overflow-y-auto">
            <button
              onClick={async () => { if (moveModal) { await moveFile(moveModal.id, null); setMoveModal(null); } }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-left"
            >
              <Folder className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-surface-900 dark:text-white">Root (My Files)</span>
            </button>
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={async () => { if (moveModal) { await moveFile(moveModal.id, f.id); setMoveModal(null); } }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-left"
              >
                <Folder className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-surface-900 dark:text-white">{f.name}</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!previewFile} onClose={() => setPreviewFile(null)} title={previewFile?.name || ""} size="xl">
        {previewFile && (
          <div className="p-6">
            {previewFile.mime_type.startsWith("image/") ? (
              <div className="flex items-center justify-center min-h-[300px] bg-surface-100 dark:bg-surface-800 rounded-lg">
                <div className="text-center">
                  <Image className="w-16 h-16 text-surface-400 mx-auto mb-2" />
                  <p className="text-sm text-surface-500">Image preview</p>
                </div>
              </div>
            ) : previewFile.mime_type.startsWith("video/") ? (
              <div className="flex items-center justify-center min-h-[300px] bg-surface-100 dark:bg-surface-800 rounded-lg">
                <div className="text-center">
                  <Video className="w-16 h-16 text-surface-400 mx-auto mb-2" />
                  <p className="text-sm text-surface-500">Video preview</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[300px] bg-surface-100 dark:bg-surface-800 rounded-lg">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-surface-400 mx-auto mb-2" />
                  <p className="text-sm text-surface-500">Preview not available</p>
                </div>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-surface-500">
                <p>{formatBytes(previewFile.size)} • {previewFile.extension.toUpperCase()}</p>
                <p>Modified {formatDate(previewFile.updated_at)}</p>
              </div>
              <Button onClick={async () => {
                const url = await getDownloadUrl(previewFile.id);
                window.open(url, "_blank");
              }}>
                <Download className="w-4 h-4" /> Download
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
