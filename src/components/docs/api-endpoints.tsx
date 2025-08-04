"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Copy,
  Download,
  List,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";

interface Endpoint {
  method: string;
  path: string;
  description: string;
  icon: React.ReactNode;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  responses: {
    success: {
      code: number;
      description: string;
      example: string;
    };
    error: {
      code: number;
      description: string;
      example: string;
    };
  };
}

export function ApiEndpoints() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const endpoints: Endpoint[] = [
    {
      method: "POST",
      path: "/api/files/upload",
      description: "上传文件到云存储",
      icon: <Upload className="h-5 w-5" />,
      parameters: [
        {
          name: "file",
          type: "File",
          required: true,
          description: "要上传的文件",
        },
      ],
      responses: {
        success: {
          code: 200,
          description: "文件上传成功",
          example: `{
  "success": true,
  "fileId": "abc123",
  "filename": "example.txt",
  "size": 1024,
  "uploadedAt": "2024-01-01T00:00:00Z"
}`,
        },
        error: {
          code: 400,
          description: "上传失败",
          example: `{
  "success": false,
  "error": "No file provided"
}`,
        },
      },
    },
    {
      method: "GET",
      path: "/api/files/upload",
      description: "获取所有已上传的文件列表",
      icon: <List className="h-5 w-5" />,
      responses: {
        success: {
          code: 200,
          description: "成功获取文件列表",
          example: `{
  "success": true,
  "files": [
    {
      "id": "abc123",
      "filename": "example.txt",
      "size": 1024,
      "uploadedAt": "2024-01-01T00:00:00Z"
    }
  ]
}`,
        },
        error: {
          code: 500,
          description: "服务器错误",
          example: `{
  "success": false,
  "error": "Internal server error"
}`,
        },
      },
    },
    {
      method: "GET",
      path: "/api/files/download/{fileId}",
      description: "下载指定的文件",
      icon: <Download className="h-5 w-5" />,
      parameters: [
        {
          name: "fileId",
          type: "string",
          required: true,
          description: "文件的唯一标识符",
        },
      ],
      responses: {
        success: {
          code: 200,
          description: "文件下载成功",
          example: "Binary file content with proper headers",
        },
        error: {
          code: 404,
          description: "文件未找到",
          example: `{
  "success": false,
  "error": "File not found"
}`,
        },
      },
    },
    {
      method: "DELETE",
      path: "/api/files/{fileId}",
      description: "删除指定的文件",
      icon: <Trash2 className="h-5 w-5" />,
      parameters: [
        {
          name: "fileId",
          type: "string",
          required: true,
          description: "要删除文件的唯一标识符",
        },
      ],
      responses: {
        success: {
          code: 200,
          description: "文件删除成功",
          example: `{
  "success": true,
  "message": "File deleted successfully"
}`,
        },
        error: {
          code: 404,
          description: "文件未找到",
          example: `{
  "success": false,
  "error": "File not found"
}`,
        },
      },
    },
  ];

  const copyToClipboard = async (text: string, endpointPath: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(endpointPath);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500";
      case "POST":
        return "bg-blue-500";
      case "PUT":
        return "bg-yellow-500";
      case "DELETE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-black">API 端点</h2>
        <p className="text-dark-300 text-lg">
          CloudStorage 提供的所有 API 端点详细说明
        </p>
      </div>

      <div className="space-y-6">
        {endpoints.map((endpoint, index) => (
          <motion.div
            key={`${endpoint.method}-${endpoint.path}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="glass-dark border-dark-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {endpoint.icon}
                      <Badge
                        className={`${getMethodColor(endpoint.method)} text-white`}
                      >
                        {endpoint.method}
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-black">
                        {endpoint.path}
                      </CardTitle>
                      <CardDescription className="text-dark-400">
                        {endpoint.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(endpoint.path, endpoint.path)
                    }
                    className="h-8 w-8 p-0"
                  >
                    {copiedEndpoint === endpoint.path ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Parameters */}
                {endpoint.parameters && (
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-black">
                      参数
                    </h4>
                    <div className="space-y-2">
                      {endpoint.parameters.map((param) => (
                        <div
                          key={param.name}
                          className="bg-dark-800 rounded-lg p-3"
                        >
                          <div className="flex items-center space-x-2">
                            <code className="text-primary-400 font-mono text-sm">
                              {param.name}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {param.type}
                            </Badge>
                            {param.required && (
                              <Badge variant="destructive" className="text-xs">
                                必需
                              </Badge>
                            )}
                          </div>
                          <p className="text-dark-300 mt-1 text-sm">
                            {param.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responses */}
                <div>
                  <h4 className="mb-3 text-lg font-semibold text-black">
                    响应
                  </h4>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Success Response */}
                    <div>
                      <div className="mb-2 flex items-center space-x-2">
                        <Badge className="bg-green-500 text-white">
                          {endpoint.responses.success.code}
                        </Badge>
                        <span className="text-sm font-medium text-black">
                          {endpoint.responses.success.description}
                        </span>
                      </div>
                      <div className="bg-dark-900 rounded-lg p-3">
                        <pre className="overflow-x-auto text-xs">
                          <code>{endpoint.responses.success.example}</code>
                        </pre>
                      </div>
                    </div>

                    {/* Error Response */}
                    <div>
                      <div className="mb-2 flex items-center space-x-2">
                        <Badge className="bg-red-500 text-white">
                          {endpoint.responses.error.code}
                        </Badge>
                        <span className="text-sm font-medium text-black">
                          {endpoint.responses.error.description}
                        </span>
                      </div>
                      <div className="bg-dark-900 rounded-lg p-3">
                        <pre className="overflow-x-auto text-xs">
                          <code>{endpoint.responses.error.example}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
