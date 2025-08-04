"use client";

import { FileGrid } from "@/components/file-grid";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { FileItem } from "@/lib/storage/types";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/files/upload");
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 select-none sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-black">文件管理</h1>
              <p className="text-dark-400">上传、管理和预览您的文件</p>
            </div>
            <Button
              variant="outline"
              onClick={fetchFiles}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>刷新</span>
            </Button>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <FileUpload onUploadComplete={fetchFiles} />
        </motion.div>

        {/* Files Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <RefreshCw className="text-primary-400 h-6 w-6 animate-spin" />
                <span className="text-dark-300 text-lg">加载中...</span>
              </div>
            </div>
          ) : (
            <FileGrid files={files} onRefresh={fetchFiles} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
