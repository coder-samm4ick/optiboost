import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 850);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-[4px] border-[#2a2a2a] border-t-[#477f0b]" />
              <div className="absolute inset-0 rounded-full blur-xl opacity-40 bg-[#477f0b]/30" />
            </div>
            <div className="text-sm font-medium tracking-widest text-[#777]">
              NEDO<span className="text-[#69b715]">HUB</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
