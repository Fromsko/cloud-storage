"use client";

import { motion } from "framer-motion";
import { ApiEndpoints } from "@/components/docs/api-endpoints";
import { CodeExamples } from "@/components/docs/code-examples";
import { QuickStart } from "@/components/docs/quick-start";
import { DetailedDocs } from "@/components/docs/detailed-docs";
import { Book, Code, FileText, Zap } from "lucide-react";

export default function DocsPage() {
  const sections = [
    {
      id: "quick-start",
      title: "快速开始",
      icon: Zap,
      description: "快速了解如何使用 CloudStorage API",
    },
    {
      id: "endpoints",
      title: "API 端点",
      icon: FileText,
      description: "完整的 API 端点列表和说明",
    },
    {
      id: "examples",
      title: "代码示例",
      icon: Code,
      description: "多种编程语言的调用示例",
    },
    {
      id: "api-docs",
      title: "详细文档",
      icon: Book,
      description: "完整的 API 参考文档",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-8 inline-block"
            >
              <div className="from-primary-500 to-primary-600 rounded-full bg-gradient-to-r p-6 shadow-2xl">
                <Book className="h-16 w-16 text-black" />
              </div>
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold text-black sm:text-6xl">
              <span className="from-primary-400 to-primary-600 bg-gradient-to-r bg-clip-text text-transparent">
                API 文档
              </span>
            </h1>

            <p className="text-dark-300 mx-auto mb-8 max-w-3xl text-xl">
              CloudStorage API 完整文档，包含所有端点说明、参数详情和代码示例
            </p>
          </motion.div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="bg-primary-500/20 absolute top-1/4 left-1/4 h-72 w-72 rounded-full blur-3xl filter"></div>
          <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl filter"></div>
        </div>
      </section>

      {/* Navigation Sections */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {sections.map((section, index) => (
              <motion.a
                key={section.id}
                href={`#${section.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-dark group rounded-xl p-6 transition-all hover:shadow-lg"
              >
                <div className="text-primary-400 mb-4 transition-transform group-hover:scale-110">
                  <section.icon className="h-12 w-12" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-black">
                  {section.title}
                </h3>
                <p className="text-dark-300 leading-relaxed">
                  {section.description}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-16 pb-16">
          <section id="quick-start">
            <QuickStart />
          </section>

          <section id="endpoints">
            <ApiEndpoints />
          </section>

          <section id="examples">
            <CodeExamples />
          </section>

          <section id="api-docs">
            <DetailedDocs />
          </section>
        </div>
      </div>
    </div>
  );
}