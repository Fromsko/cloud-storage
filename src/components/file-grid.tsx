"use client";

import { Button } from "@/components/ui/button";
import { FileItem } from "@/lib/storage/types";
import { formatFileSize, isImageFile, isVideoFile } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  Calendar,
  Download,
  Eye,
  FileText,
  Grid,
  Image as ImageIcon,
  List,
  Music,
  Search,
  Trash2,
  Video,
} from "lucide-react";
import { useState } from "react";

interface FileGridProps {
  files: FileItem[];
  onRefresh: () => void;
}

export function FileGrid({ files, onRefresh }: FileGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/delete/${fileId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleDownload = async (file: FileItem) => {
    try {
      const response = await fetch(`/api/files/download/${file.id}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    if (mimeType.startsWith("video/")) return <Video className="h-5 w-5" />;
    if (mimeType.startsWith("audio/")) return <Music className="h-5 w-5" />;
    if (mimeType.includes("zip") || mimeType.includes("rar"))
      return <Archive className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const FilePreview = ({ file }: { file: FileItem }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      onClick={() => setSelectedFile(null)}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-dark-800 max-h-[90vh] max-w-4xl overflow-auto rounded-xl p-6 border border-gray-600 bg-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-black">{file.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFile(null)}
          >
            ✕
          </Button>
        </div>

        {isImageFile(file.type) && file.url && (
          <div className="text-center">
            <img
              src={file.url}
              alt={file.name}
              className="max-h-96 max-w-full rounded-lg object-contain"
            />
          </div>
        )}

        {isVideoFile(file.type) && file.url && (
          <div className="text-center">
            <video
              src={file.url}
              controls
              className="max-h-96 max-w-full rounded-lg"
            />
          </div>
        )}

        <div className="text-dark-300 mt-4 space-y-2">
          <p>
            <span className="font-medium">大小:</span>{" "}
            {formatFileSize(file.size)}
          </p>
          <p>
            <span className="font-medium">类型:</span> {file.type}
          </p>
          <p>
            <span className="font-medium">上传时间:</span>{" "}
            {new Date(file.uploadedAt).toLocaleString("zh-CN")}
          </p>
        </div>

        <div className="mt-6 flex space-x-2">
          <Button onClick={() => handleDownload(file)}>
            <Download className="mr-2 h-4 w-4" />
            下载
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              handleDelete(file.id);
              setSelectedFile(null);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            删除
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="text-dark-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <input
            type="text"
            placeholder="搜索文件..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-dark-800 border-dark-600 placeholder-dark-400 focus:ring-primary-500 w-full rounded-lg border py-2 pr-4 pl-10 text-black focus:ring-2 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* File Count */}
      <div className="text-dark-400 text-sm">
        共 {filteredFiles.length} 个文件
      </div>

      {/* Files Display */}
      {viewMode === "grid" ? (
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          layout
        >
          <AnimatePresence>
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-dark-800/50 border-dark-700 hover:border-primary-500/50 rounded-xl border p-4 backdrop-blur-sm transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                {/* File Preview */}
                <div className="bg-dark-700 mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg">
                  {isImageFile(file.type) && file.url ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-primary-400 text-4xl">
                      {getFileTypeIcon(file.type)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-2">
                  <h3
                    className="truncate font-medium text-black"
                    title={file.name}
                  >
                    {file.name}
                  </h3>
                  <div className="text-dark-400 flex items-center justify-between text-sm">
                    <span>{formatFileSize(file.size)}</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(file.uploadedAt).toLocaleDateString("zh-CN")}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(file)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(file)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.02 }}
                className="bg-dark-800/30 border-dark-700 hover:border-primary-500/50 flex items-center justify-between rounded-lg border p-4 transition-all"
              >
                <div className="flex min-w-0 flex-1 items-center space-x-4">
                  <div className="text-primary-400">
                    {getFileTypeIcon(file.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-black">
                      {file.name}
                    </h3>
                    <div className="text-dark-400 flex items-center space-x-4 text-sm">
                      <span>{formatFileSize(file.size)}</span>
                      <span>
                        {new Date(file.uploadedAt).toLocaleString("zh-CN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(file)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center"
        >
          <div className="mb-4 text-6xl">📁</div>
          <p className="text-dark-400 mb-2 text-xl">
            {searchTerm ? "未找到匹配的文件" : "暂无文件"}
          </p>
          <p className="text-dark-500">
            {searchTerm ? "尝试调整搜索条件" : "上传一些文件开始使用"}
          </p>
        </motion.div>
      )}

      {/* File Preview Modal */}
      <AnimatePresence>
        {selectedFile && <FilePreview file={selectedFile} />}
      </AnimatePresence>
    </div>
  );
}
