"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useAccessibility";

export function HeartCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [reducedMotion]);

  if (reducedMotion || !visible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[9999] text-highlight"
      style={{ left: pos.x - 8, top: pos.y - 8 }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      aria-hidden="true"
    >
      ♥
    </motion.div>
  );
}
