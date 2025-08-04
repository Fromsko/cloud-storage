"use client";

import { motion } from "framer-motion";
import { BarChart3, BookOpen, Cloud, Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const navigation = [
    { name: "首页", href: "/", icon: Home },
    { name: "文件管理", href: "/files", icon: Settings },
    { name: "上传日志", href: "/logs", icon: BarChart3 },
    { name: "文档", href: "/docs", icon: BookOpen },
  ];

  return (
    <nav className="border-dark-700 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="from-primary-500 to-primary-600 rounded-lg bg-gradient-to-r p-2"
            >
              <Cloud className="h-6 w-6 text-black" />
            </motion.div>
            <span className="text-xl font-bold text-black">CloudStorage</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${
                      isActive
                        ? "bg-primary-600 text-black"
                        : "text-dark-300 hover:bg-dark-800 hover:text-black"
                    } `}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden sm:block">{item.name}</span>

                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="bg-primary-600 absolute inset-0 -z-10 rounded-lg"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
