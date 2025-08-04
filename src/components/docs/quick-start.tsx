"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

export function QuickStart() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const steps = [
    {
      title: "获取 API 基础地址",
      description: "CloudStorage API 的基础地址",
      code: "http://localhost:3000/api",
      language: "url",
    },
    {
      title: "上传文件",
      description: "使用 POST 请求上传文件",
      code: `curl -X POST \\
  http://localhost:3000/api/files/upload \\
  -F "file=@example.txt"`,
      language: "bash",
    },
    {
      title: "获取文件列表",
      description: "使用 GET 请求获取所有文件",
      code: `curl -X GET \\
  http://localhost:3000/api/files/upload`,
      language: "bash",
    },
    {
      title: "下载文件",
      description: "使用文件 ID 下载文件",
      code: `curl -X GET \\
  http://localhost:3000/api/files/download/{fileId} \\
  -o downloaded-file.txt`,
      language: "bash",
    },
  ];

  const copyToClipboard = async (text: string, stepIndex: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(stepIndex);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-black">快速开始</h2>
        <p className="text-dark-300 text-lg">
          通过以下步骤快速了解如何使用 CloudStorage API
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="glass-dark border-dark-700 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-600 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-black">
                      {index + 1}
                    </div>
                    <CardTitle className="text-black">{step.title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(step.code, index)}
                    className="h-8 w-8 p-0"
                  >
                    {copiedStep === index ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardDescription className="text-dark-400">
                  {step.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-dark-900 rounded-lg p-4">
                  <pre className="overflow-x-auto text-sm">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <Card className="glass-dark border-dark-700">
          <CardContent className="p-6">
            <h3 className="mb-4 text-xl font-semibold text-black">
              需要更多帮助？
            </h3>
            <p className="text-dark-300 mb-4">
              查看完整的 API 文档和更多代码示例
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" className="group">
                查看完整文档
                <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
