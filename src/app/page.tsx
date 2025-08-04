"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Cloud, Download, Shield, Upload, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: Upload,
      title: "快速上传",
      description: "支持拖拽上传，多文件同时上传，实时显示上传进度",
    },
    {
      icon: Download,
      title: "便捷下载",
      description: "一键下载文件，支持批量下载，保持原始文件名",
    },
    {
      icon: Shield,
      title: "安全存储",
      description: "多种存储策略支持，数据安全可靠，支持本地和云端存储",
    },
    {
      icon: Zap,
      title: "极速体验",
      description: "现代化界面设计，流畅的交互动画，响应式布局",
    },
  ];

  const stats = [
    { label: "存储类型", value: "3+" },
    { label: "文件格式", value: "全部" },
    { label: "上传速度", value: "极快" },
    { label: "界面体验", value: "优雅" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
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
                  <Cloud className="h-16 w-16 text-black" />
                </div>
              </motion.div>

              <h1 className="mb-6 text-5xl font-bold text-black sm:text-6xl lg:text-7xl">
                <span className="from-primary-400 to-primary-600 bg-gradient-to-r bg-clip-text text-transparent">
                  CloudStorage
                </span>
              </h1>

              <p className="text-dark-300 mx-auto mb-8 max-w-3xl text-xl sm:text-2xl">
                现代化的云盘系统，让文件存储和管理变得简单优雅
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/admin">
                  <Button size="lg" className="group px-8 py-4 text-lg">
                    开始使用
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg group"
                  >
                    了解更多
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 gap-8 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="glass-dark rounded-xl p-6">
                  <p className="text-primary-400 mb-2 text-3xl font-bold">
                    {stat.value}
                  </p>
                  <p className="text-dark-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="bg-primary-500/20 absolute top-1/4 left-1/4 h-72 w-72 rounded-full blur-3xl filter"></div>
          <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-green-500/20 blur-3xl filter"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl">
              强大的功能特性
            </h2>
            <p className="text-dark-300 mx-auto max-w-2xl text-lg">
              集成多种存储策略，提供完整的文件管理解决方案
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="glass-dark group rounded-xl p-6"
              >
                <div className="text-primary-400 mb-4 transition-transform group-hover:scale-110">
                  <feature.icon className="h-12 w-12" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-black">
                  {feature.title}
                </h3>
                <p className="text-dark-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-dark rounded-2xl p-8 text-center sm:p-12"
          >
            <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl">
              准备开始使用？
            </h2>
            <p className="text-dark-300 mx-auto mb-8 max-w-2xl text-lg">
              立即体验现代化的云盘系统，享受简单、快速、安全的文件管理服务
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/admin">
                <Button size="lg" className="group px-8 py-4 text-lg">
                  立即开始
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/logs">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  查看日志
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
