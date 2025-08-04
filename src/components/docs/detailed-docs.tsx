"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  Info,
  Lock,
  Shield,
  Zap,
} from "lucide-react";

export function DetailedDocs() {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "安全可靠",
      description: "支持多种存储后端，数据安全有保障",
      details: [
        "支持本地存储、Supabase、PocketBase",
        "文件上传进度实时跟踪",
        "完整的错误处理机制",
        "文件元数据完整保存",
      ],
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "高性能",
      description: "优化的文件处理和传输机制",
      details: ["流式文件上传", "并发请求支持", "智能缓存策略", "压缩传输优化"],
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "易于集成",
      description: "RESTful API 设计，支持多种编程语言",
      details: [
        "标准 HTTP 协议",
        "JSON 格式响应",
        "详细的错误码说明",
        "完整的 API 文档",
      ],
    },
  ];

  const errorCodes = [
    {
      code: 200,
      status: "OK",
      description: "请求成功",
      type: "success",
    },
    {
      code: 400,
      status: "Bad Request",
      description: "请求参数错误或缺失",
      type: "error",
    },
    {
      code: 404,
      status: "Not Found",
      description: "请求的资源不存在",
      type: "error",
    },
    {
      code: 413,
      status: "Payload Too Large",
      description: "上传文件过大",
      type: "error",
    },
    {
      code: 415,
      status: "Unsupported Media Type",
      description: "不支持的文件类型",
      type: "error",
    },
    {
      code: 500,
      status: "Internal Server Error",
      description: "服务器内部错误",
      type: "error",
    },
  ];

  const bestPractices = [
    {
      icon: <Clock className="h-5 w-5" />,
      title: "请求超时处理",
      description: "建议设置合理的请求超时时间，特别是对于大文件上传",
      code: `// JavaScript 示例
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

fetch('/api/files/upload', {
  method: 'POST',
  body: formData,
  signal: controller.signal
}).finally(() => {
  clearTimeout(timeoutId);
});`,
    },
    {
      icon: <AlertCircle className="h-5 w-5" />,
      title: "错误重试机制",
      description: "实现指数退避的重试策略，提高上传成功率",
      code: `// Python 示例
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504]
)
adapter = HTTPAdapter(max_retries=retry_strategy)
session.mount("http://", adapter)
session.mount("https://", adapter)`,
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "文件大小限制",
      description: "在客户端预先检查文件大小，避免无效请求",
      code: `// JavaScript 示例
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('文件大小不能超过 10MB');
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'text/plain'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('不支持的文件类型');
  }
  
  return true;
}`,
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "安全考虑",
      description: "实施适当的安全措施保护您的 API",
      code: `// 安全建议
1. 使用 HTTPS 加密传输
2. 实施速率限制防止滥用
3. 验证文件类型和内容
4. 设置合理的文件大小限制
5. 记录和监控 API 使用情况
6. 定期清理过期文件`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* 系统特性 */}
      <div>
        <h2 className="mb-6 text-3xl font-bold text-black">系统特性</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-dark border-dark-700 h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-600 flex h-12 w-12 items-center justify-center rounded-lg text-black">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-black">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-dark-400">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="text-dark-300 flex items-center space-x-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* HTTP 状态码 */}
      <div>
        <h2 className="mb-6 text-3xl font-bold text-black">HTTP 状态码</h2>
        <Card className="glass-dark border-dark-700">
          <CardHeader>
            <CardTitle className="text-black">API 响应状态码说明</CardTitle>
            <CardDescription className="text-dark-400">
              了解不同状态码的含义，便于错误处理和调试
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {errorCodes.map((error, index) => (
                <motion.div
                  key={error.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-dark-800 rounded-lg p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          error.type === "success"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {error.code}
                      </Badge>
                      <span className="font-medium text-black">
                        {error.status}
                      </span>
                    </div>
                    {error.type === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-dark-300 text-sm">{error.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最佳实践 */}
      <div>
        <h2 className="mb-6 text-3xl font-bold text-black">最佳实践</h2>
        <div className="space-y-6">
          {bestPractices.map((practice, index) => (
            <motion.div
              key={practice.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-dark border-dark-700">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg text-black">
                      {practice.icon}
                    </div>
                    <div>
                      <CardTitle className="text-black">
                        {practice.title}
                      </CardTitle>
                      <CardDescription className="text-dark-400">
                        {practice.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-dark-900 rounded-lg p-4">
                    <pre className="overflow-x-auto text-sm">
                      <code>{practice.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 技术支持 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Card className="glass-dark border-dark-700">
          <CardContent className="p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-primary-600 flex h-16 w-16 items-center justify-center rounded-full text-black">
                <Info className="h-8 w-8" />
              </div>
            </div>
            <h3 className="mb-4 text-2xl font-semibold text-black">
              需要技术支持？
            </h3>
            <p className="text-dark-300 mb-6 text-lg">
              如果您在使用过程中遇到问题，或需要更多技术支持，请随时联系我
            </p>
            <div className="text-dark-400 flex flex-col space-y-2 text-sm">
              <p>
                📧 邮箱支持：
                <a
                  href="mailto:hnkong666@gmail.com"
                  className="hover:underline"
                >
                  hnkong666@gmail.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
