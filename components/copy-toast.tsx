"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface CopyToastProps {
  show: boolean;
  message?: string;
}

export function CopyToast({ show, message = "Copied to clipboard!" }: CopyToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-2xl backdrop-blur-xl ring-1 ring-white/10"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          </div>
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
