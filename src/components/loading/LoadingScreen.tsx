"use client";

import { motion } from "framer-motion";

interface LoadingScreenProps {
  message: string;
  progress: number;
}

export function LoadingScreen({ message, progress }: LoadingScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary"
      role="status"
      aria-live="polite"
      aria-label={`Loading: ${message}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8 px-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 rounded-full border-2 border-accent border-t-highlight"
        />

        <p className="font-display text-xl text-text-primary md:text-2xl">
          {message}
        </p>

        <div className="h-1 w-64 overflow-hidden rounded-full bg-accent/40">
          <motion.div
            className="h-full rounded-full bg-highlight"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-sm text-text-secondary">{progress}%</p>
      </motion.div>
    </div>
  );
}
