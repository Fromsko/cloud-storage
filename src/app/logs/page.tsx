"use client";

import { UploadLogs } from "@/components/upload-logs";
import { motion } from "framer-motion";

export default function LogsPage() {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <UploadLogs />
        </motion.div>
      </div>
    </div>
  );
}
