"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, File, Upload, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";

interface FileUploadProps {
  onUploadComplete?: () => void;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
  apiUrl?: string;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const uploadFile = async (file: File) => {
    // 检查文件大小限制 (100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      toast.error(`文件 "${file.name}" 超过100MB大小限制，无法上传`);
      return;
    }

    const id = Math.random().toString(36).substring(7);
    const uploadingFile: UploadingFile = {
      id,
      file,
      progress: 0,
      status: "uploading",
    };

    setUploadingFiles((prev) => [...prev, uploadingFile]);
    toast.loading(`正在上传 "${file.name}"...`, { id: `upload-${id}` });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, progress: 100, status: "success", apiUrl: result.file.url }
            : f,
        ),
      );

      toast.success(`文件 "${file.name}" 上传成功！`, { id: `upload-${id}` });
      onUploadComplete?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status: "error",
                error: errorMessage,
              }
            : f,
        ),
      );

      toast.error(`文件 "${file.name}" 上传失败：${errorMessage}`, { id: `upload-${id}` });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(uploadFile);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadFile);
    e.target.value = "";
  };

  const removeUploadingFile = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-4">
      <motion.div
        className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          isDragOver
            ? "border-primary-400 bg-primary-400/10"
            : "border-dark-600 hover:border-dark-500"
        } `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />

        <motion.div
          animate={{ y: isDragOver ? -10 : 0 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{
              scale: isDragOver ? 1.2 : 1,
              rotate: isDragOver ? 360 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="bg-primary-500/20 rounded-full p-4"
          >
            <Upload className="text-primary-400 h-8 w-8" />
          </motion.div>

          <div>
            <p className="mb-2 text-lg font-medium text-black">
              {isDragOver ? "释放文件开始上传" : "拖拽文件或点击上传"}
            </p>
            <p className="text-dark-400 text-sm">
              支持所有文件格式，单个文件最大 100MB
            </p>
          </div>

          <Button variant="outline" size="lg">
            选择文件
          </Button>
        </motion.div>
      </motion.div>

      {/* Uploading Files */}
      <AnimatePresence>
        {uploadingFiles.map((uploadingFile) => (
          <motion.div
            key={uploadingFile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-dark-800/50 border-dark-700 rounded-lg border p-4 backdrop-blur-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="text-primary-400 h-5 w-5" />
                <div>
                  <p className="max-w-xs truncate font-medium text-black">
                    {uploadingFile.file.name}
                  </p>
                  <p className="text-dark-400 text-sm">
                    {formatFileSize(uploadingFile.file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {uploadingFile.status === "success" && (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-400"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.div>
                    {uploadingFile.apiUrl && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          readOnly
                          value={uploadingFile.apiUrl}
                          className="w-48 rounded-md border bg-gray-800 px-2 py-1 text-xs text-gray-300"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(uploadingFile.apiUrl || '')}
                        >
                          Copy
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {uploadingFile.status === "error" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-red-400"
                  >
                    <AlertCircle className="h-5 w-5" />
                  </motion.div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUploadingFile(uploadingFile.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {uploadingFile.status === "uploading" && (
              <Progress value={uploadingFile.progress} className="h-2" />
            )}

            {uploadingFile.status === "error" && uploadingFile.error && (
              <p className="mt-2 text-sm text-red-400">{uploadingFile.error}</p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
