"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Code,
  Copy,
  Download,
  FileText,
  List,
  Terminal,
  Trash2,
  Upload,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface CodeExample {
  language: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  examples: {
    upload: string;
    list: string;
    download: string;
    delete: string;
  };
}

export function CodeExamples() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState("curl");
  const [activeExample, setActiveExample] = useState("upload");

  const codeExamples: CodeExample[] = [
    {
      language: "curl",
      title: "cURL",
      description: "命令行工具",
      icon: <Terminal className="h-5 w-5" />,
      examples: {
        upload: `# 上传文件
curl -X POST \\
  http://localhost:3000/api/files/upload \\
  -F "file=@example.txt" \\
  -H "Content-Type: multipart/form-data"

# 响应示例
{
  "success": true,
  "fileId": "abc123",
  "filename": "example.txt",
  "size": 1024,
  "uploadedAt": "2024-01-01T00:00:00Z"
}`,
        list: `# 获取文件列表
curl -X GET \\
  http://localhost:3000/api/files/upload \\
  -H "Accept: application/json"

# 响应示例
{
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
        download: `# 下载文件
curl -X GET \\
  http://localhost:3000/api/files/download/abc123 \\
  -o downloaded-file.txt \\
  -L

# 文件将保存为 downloaded-file.txt`,
        delete: `# 删除文件
curl -X DELETE \\
  http://localhost:3000/api/files/abc123 \\
  -H "Accept: application/json"

# 响应示例
{
  "success": true,
  "message": "File deleted successfully"
}`,
      },
    },
    {
      language: "python",
      title: "Python",
      description: "使用 requests 库",
      icon: <Code className="h-5 w-5" />,
      examples: {
        upload: `import requests

# 上传文件
url = "http://localhost:3000/api/files/upload"
files = {'file': open('example.txt', 'rb')}

response = requests.post(url, files=files)
result = response.json()

if result['success']:
    print(f"文件上传成功: {result['fileId']}")
    print(f"文件名: {result['filename']}")
    print(f"文件大小: {result['size']} bytes")
else:
    print(f"上传失败: {result['error']}")`,
        list: `import requests

# 获取文件列表
url = "http://localhost:3000/api/files/upload"
response = requests.get(url)
result = response.json()

if result['success']:
    print(f"共有 {len(result['files'])} 个文件:")
    for file in result['files']:
        print(f"- {file['filename']} ({file['size']} bytes)")
else:
    print(f"获取列表失败: {result['error']}")`,
        download: `import requests

# 下载文件
file_id = "abc123"
url = f"http://localhost:3000/api/files/download/{file_id}"

response = requests.get(url)

if response.status_code == 200:
    # 从响应头获取文件名
    filename = response.headers.get('Content-Disposition', '').split('filename=')[-1].strip('"')
    
    with open(filename or 'downloaded_file', 'wb') as f:
        f.write(response.content)
    print(f"文件下载成功: {filename}")
else:
    print(f"下载失败: {response.status_code}")`,
        delete: `import requests

# 删除文件
file_id = "abc123"
url = f"http://localhost:3000/api/files/{file_id}"

response = requests.delete(url)
result = response.json()

if result['success']:
    print("文件删除成功")
else:
    print(f"删除失败: {result['error']}")`,
      },
    },
    {
      language: "javascript",
      title: "Node.js",
      description: "使用 fetch API",
      icon: <Zap className="h-5 w-5" />,
      examples: {
        upload: `const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// 上传文件
async function uploadFile() {
  const form = new FormData();
  form.append('file', fs.createReadStream('example.txt'));

  try {
    const response = await fetch('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: form
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(\`文件上传成功: \${result.fileId}\`);
      console.log(\`文件名: \${result.filename}\`);
      console.log(\`文件大小: \${result.size} bytes\`);
    } else {
      console.log(\`上传失败: \${result.error}\`);
    }
  } catch (error) {
    console.error('上传错误:', error);
  }
}

uploadFile();`,
        list: `const fetch = require('node-fetch');

// 获取文件列表
async function getFileList() {
  try {
    const response = await fetch('http://localhost:3000/api/files/upload');
    const result = await response.json();
    
    if (result.success) {
      console.log(\`共有 \${result.files.length} 个文件:\`);
      result.files.forEach(file => {
        console.log(\`- \${file.filename} (\${file.size} bytes)\`);
      });
    } else {
      console.log(\`获取列表失败: \${result.error}\`);
    }
  } catch (error) {
    console.error('请求错误:', error);
  }
}

getFileList();`,
        download: `const fetch = require('node-fetch');
const fs = require('fs');

// 下载文件
async function downloadFile(fileId) {
  try {
    const response = await fetch(\`http://localhost:3000/api/files/download/\${fileId}\`);
    
    if (response.ok) {
      // 从响应头获取文件名
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition ? 
        contentDisposition.split('filename=')[1].replace(/"/g, '') : 
        'downloaded_file';
      
      const buffer = await response.buffer();
      fs.writeFileSync(filename, buffer);
      console.log(\`文件下载成功: \${filename}\`);
    } else {
      console.log(\`下载失败: \${response.status}\`);
    }
  } catch (error) {
    console.error('下载错误:', error);
  }
}

downloadFile('abc123');`,
        delete: `const fetch = require('node-fetch');

// 删除文件
async function deleteFile(fileId) {
  try {
    const response = await fetch(\`http://localhost:3000/api/files/\${fileId}\`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('文件删除成功');
    } else {
      console.log(\`删除失败: \${result.error}\`);
    }
  } catch (error) {
    console.error('删除错误:', error);
  }
}

deleteFile('abc123');`,
      },
    },
    {
      language: "go",
      title: "Go",
      description: "使用标准库",
      icon: <FileText className="h-5 w-5" />,
      examples: {
        upload: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
    "os"
)

type UploadResponse struct {
    Success    bool   \`json:"success"\`
    FileID     string \`json:"fileId"\`
    Filename   string \`json:"filename"\`
    Size       int64  \`json:"size"\`
    UploadedAt string \`json:"uploadedAt"\`
    Error      string \`json:"error,omitempty"\`
}

func uploadFile() {
    file, err := os.Open("example.txt")
    if err != nil {
        fmt.Printf("打开文件失败: %v\\n", err)
        return
    }
    defer file.Close()

    var buf bytes.Buffer
    writer := multipart.NewWriter(&buf)
    
    part, err := writer.CreateFormFile("file", "example.txt")
    if err != nil {
        fmt.Printf("创建表单失败: %v\\n", err)
        return
    }
    
    io.Copy(part, file)
    writer.Close()

    resp, err := http.Post("http://localhost:3000/api/files/upload", 
        writer.FormDataContentType(), &buf)
    if err != nil {
        fmt.Printf("上传失败: %v\\n", err)
        return
    }
    defer resp.Body.Close()

    var result UploadResponse
    json.NewDecoder(resp.Body).Decode(&result)

    if result.Success {
        fmt.Printf("文件上传成功: %s\\n", result.FileID)
        fmt.Printf("文件名: %s\\n", result.Filename)
        fmt.Printf("文件大小: %d bytes\\n", result.Size)
    } else {
        fmt.Printf("上传失败: %s\\n", result.Error)
    }
}`,
        list: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type FileInfo struct {
    ID         string \`json:"id"\`
    Filename   string \`json:"filename"\`
    Size       int64  \`json:"size"\`
    UploadedAt string \`json:"uploadedAt"\`
}

type ListResponse struct {
    Success bool       \`json:"success"\`
    Files   []FileInfo \`json:"files"\`
    Error   string     \`json:"error,omitempty"\`
}

func getFileList() {
    resp, err := http.Get("http://localhost:3000/api/files/upload")
    if err != nil {
        fmt.Printf("请求失败: %v\\n", err)
        return
    }
    defer resp.Body.Close()

    var result ListResponse
    json.NewDecoder(resp.Body).Decode(&result)

    if result.Success {
        fmt.Printf("共有 %d 个文件:\\n", len(result.Files))
        for _, file := range result.Files {
            fmt.Printf("- %s (%d bytes)\\n", file.Filename, file.Size)
        }
    } else {
        fmt.Printf("获取列表失败: %s\\n", result.Error)
    }
}`,
        download: `package main

import (
    "fmt"
    "io"
    "net/http"
    "os"
    "strings"
)

func downloadFile(fileID string) {
    url := fmt.Sprintf("http://localhost:3000/api/files/download/%s", fileID)
    
    resp, err := http.Get(url)
    if err != nil {
        fmt.Printf("下载失败: %v\\n", err)
        return
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        fmt.Printf("下载失败: %d\\n", resp.StatusCode)
        return
    }

    // 从响应头获取文件名
    contentDisposition := resp.Header.Get("Content-Disposition")
    filename := "downloaded_file"
    if contentDisposition != "" {
        parts := strings.Split(contentDisposition, "filename=")
        if len(parts) > 1 {
            filename = strings.Trim(parts[1], "\"")
        }
    }

    file, err := os.Create(filename)
    if err != nil {
        fmt.Printf("创建文件失败: %v\\n", err)
        return
    }
    defer file.Close()

    _, err = io.Copy(file, resp.Body)
    if err != nil {
        fmt.Printf("保存文件失败: %v\\n", err)
        return
    }

    fmt.Printf("文件下载成功: %s\\n", filename)
}`,
        delete: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type DeleteResponse struct {
    Success bool   \`json:"success"\`
    Message string \`json:"message"\`
    Error   string \`json:"error,omitempty"\`
}

func deleteFile(fileID string) {
    url := fmt.Sprintf("http://localhost:3000/api/files/%s", fileID)
    
    req, err := http.NewRequest("DELETE", url, nil)
    if err != nil {
        fmt.Printf("创建请求失败: %v\\n", err)
        return
    }

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Printf("删除失败: %v\\n", err)
        return
    }
    defer resp.Body.Close()

    var result DeleteResponse
    json.NewDecoder(resp.Body).Decode(&result)

    if result.Success {
        fmt.Println("文件删除成功")
    } else {
        fmt.Printf("删除失败: %s\\n", result.Error)
    }
}`,
      },
    },
  ];

  const exampleTypes = [
    { key: "upload", label: "上传文件", icon: <Upload className="h-4 w-4" /> },
    { key: "list", label: "文件列表", icon: <List className="h-4 w-4" /> },
    {
      key: "download",
      label: "下载文件",
      icon: <Download className="h-4 w-4" />,
    },
    { key: "delete", label: "删除文件", icon: <Trash2 className="h-4 w-4" /> },
  ];

  const copyToClipboard = async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const currentExample = codeExamples.find(
    (ex) => ex.language === activeLanguage,
  );
  const currentCode =
    currentExample?.examples[
      activeExample as keyof typeof currentExample.examples
    ] || "";
  const codeId = `${activeLanguage}-${activeExample}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-black">代码示例</h2>
        <p className="text-dark-300 text-lg">多种编程语言的完整调用示例</p>
      </div>

      <Card className="glass-dark border-dark-700">
        <CardHeader>
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            {/* Language Tabs */}
            <div className="flex flex-wrap gap-2">
              {codeExamples.map((example) => (
                <Button
                  key={example.language}
                  variant={
                    activeLanguage === example.language ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setActiveLanguage(example.language)}
                  className="flex items-center space-x-2"
                >
                  {example.icon}
                  <span>{example.title}</span>
                </Button>
              ))}
            </div>

            {/* Copy Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(currentCode, codeId)}
              className="flex items-center space-x-2"
            >
              {copiedCode === codeId ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span>{copiedCode === codeId ? "已复制" : "复制代码"}</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Example Type Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {exampleTypes.map((type) => (
              <Button
                key={type.key}
                variant={activeExample === type.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveExample(type.key)}
                className="flex items-center space-x-2"
              >
                {type.icon}
                <span>{type.label}</span>
              </Button>
            ))}
          </div>

          {/* Code Display */}
          <div className="bg-dark-900 rounded-lg p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-500 text-black">
                  {currentExample?.title}
                </Badge>
                <span className="text-sm text-gray-600">
                  {currentExample?.description}
                </span>
              </div>
            </div>
            <pre className="overflow-x-auto text-sm">
              <code>{currentCode}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
