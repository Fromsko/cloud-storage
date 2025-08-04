"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadLog } from "@/lib/storage/types";
import { formatFileSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

export function UploadLogs() {
  const [logs, setLogs] = useState<UploadLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/logs");
      const data = await response.json();
      setLogs(data.logs);
      
      // 同步检查文件是否还存在
      await syncLogsWithFiles(data.logs);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncLogsWithFiles = async (currentLogs: UploadLog[]) => {
    try {
      // 获取当前文件列表
      const filesResponse = await fetch("/api/files/upload");
      const filesData = await filesResponse.json();
      const existingFiles = filesData.files || [];
      
      // 检查每个成功上传的日志对应的文件是否还存在
      const updatedLogs = currentLogs.map(log => {
        if (log.status === 'success' && log.apiUrl) {
          // 通过文件名或URL检查文件是否存在
          const fileExists = existingFiles.some((file: any) => 
            file.name === log.fileName || file.url === log.apiUrl
          );
          
          if (!fileExists) {
            // 文件不存在，更新日志状态为error
            return {
              ...log,
              status: 'error' as const,
              error: '文件已被删除'
            };
          }
        }
        return log;
      });
      
      // 如果有状态变化，更新日志
      const hasChanges = updatedLogs.some((log, index) => 
        log.status !== currentLogs[index].status || log.error !== currentLogs[index].error
      );
      
      if (hasChanges) {
        setLogs(updatedLogs);
        // 可选：将更新后的日志保存到服务器
        await updateLogsOnServer(updatedLogs);
      }
    } catch (error) {
      console.error("Failed to sync logs with files:", error);
    }
  };

  const updateLogsOnServer = async (updatedLogs: UploadLog[]) => {
    try {
      await fetch("/api/logs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logs: updatedLogs }),
      });
    } catch (error) {
      console.error("Failed to update logs on server:", error);
    }
  };

  const clearLogs = async () => {
    try {
      await fetch("/api/logs", { method: "DELETE" });
      setLogs([]);
    } catch (error) {
      console.error("Failed to clear logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Auto refresh every 5 seconds
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: UploadLog["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case "uploading":
        return <Clock className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: UploadLog["status"]) => {
    switch (status) {
      case "success":
        return "border-green-500/50 bg-green-500/10";
      case "error":
        return "border-red-500/50 bg-red-500/10";
      case "uploading":
        return "border-yellow-500/50 bg-yellow-500/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">上传日志</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchLogs}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearLogs}
            disabled={logs.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            清空日志
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800/50 border-dark-700 rounded-lg border p-4 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-black">
                {logs.filter((log) => log.status === "success").length}
              </p>
              <p className="text-dark-400 text-sm">成功上传</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-800/50 border-dark-700 rounded-lg border p-4 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-black">
                {logs.filter((log) => log.status === "uploading").length}
              </p>
              <p className="text-dark-400 text-sm">上传中</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800/50 border-dark-700 rounded-lg border p-4 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-black">
                {logs.filter((log) => log.status === "error").length}
              </p>
              <p className="text-dark-400 text-sm">上传失败</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-lg border p-4 ${getStatusColor(log.status)} backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(log.status)}
                  <div>
                    <h3 className="max-w-xs truncate font-medium text-black">
                      {log.fileName}
                    </h3>
                    <p className="text-dark-400 text-sm">
                      {formatFileSize(log.fileSize)} •{" "}
                      {new Date(log.uploadedAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium text-black capitalize">
                    {log.status === "success" && "上传成功"}
                    {log.status === "error" && "上传失败"}
                    {log.status === "uploading" && "上传中"}
                  </div>
                  {log.apiUrl && (
                    <div className="mt-1 flex items-center justify-end space-x-2">
                      <input
                        type="text"
                        readOnly
                        value={log.apiUrl}
                        className="w-48 rounded-md border bg-gray-800 px-2 py-1 text-xs text-gray-300"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigator.clipboard.writeText(log.apiUrl || "")
                        }
                      >
                        Copy
                      </Button>
                    </div>
                  )}
                  {log.status === "uploading" && (
                    <p className="text-dark-400 text-sm">{log.progress}%</p>
                  )}
                </div>
              </div>

              {log.status === "uploading" && (
                <Progress value={log.progress} className="mb-2 h-2" />
              )}

              {log.status === "error" && log.error && (
                <p className="mt-2 text-sm text-red-400">{log.error}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {logs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center"
        >
          <div className="mb-4 text-6xl">📋</div>
          <p className="text-dark-400 mb-2 text-xl">暂无上传日志</p>
          <p className="text-dark-500">上传文件后将显示相关日志</p>
        </motion.div>
      )}
    </div>
  );
}
