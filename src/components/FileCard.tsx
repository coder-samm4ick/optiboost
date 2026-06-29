import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Download, Calendar, HardDrive, FileCode, Monitor, Smartphone, Archive, File, Zap } from "lucide-react";
import type { AppFile } from "@/types";
import { formatBytes, formatDate, formatNumber, getFileIconClass } from "@/lib/utils";
import { incrementDownloadCount } from "@/lib/storage";

interface FileCardProps {
  file: AppFile;
  index?: number;
}

const iconMap: Record<string, React.ElementType> = {
  windows: Monitor,
  apple: Monitor,
  archive: Archive,
  smartphone: Smartphone,
  file: File,
};

export default function FileCard({ file, index = 0 }: FileCardProps) {
  const iconKey = getFileIconClass(file);
  const Icon = iconMap[iconKey] || FileCode;
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useSpring(x, { stiffness: 180, damping: 28 });
  const my = useSpring(y, { stiffness: 180, damping: 28 });
  const rotateX = useTransform(my, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mx, [-0.5, 0.5], ["-7deg", "7deg"]);
  const [hover, setHover] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };
  const reset = () => { x.set(0); y.set(0); setHover(false); };

  const handleDownload = () => {
    incrementDownloadCount(file.id);
    if (file.dataUrl) {
      const link = document.createElement("a");
      link.href = file.dataUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={reset}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative group"
      >
        {/* card */}
        <div className="card-base border-gradient relative flex flex-col overflow-hidden p-[26px]">
          {/* shimmer sweep */}
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(105deg, transparent 20%, rgba(105,183,21,0.08) 40%, rgba(105,183,21,0.18) 50%, rgba(105,183,21,0.08) 60%, transparent 80%)",
              transform: hover ? "translateX(0%)" : "translateX(-120%)",
              transition: "transform 900ms cubic-bezier(.16,1,.3,1), opacity 300ms",
            }}
          />

          {/* top glow */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#477f0b]/[0.065] blur-[70px] transition-opacity group-hover:opacity-100 opacity-60" />

          <div className="relative z-10 mb-4 flex items-start justify-between" style={{ transform: "translateZ(34px)" }}>
            <div className="relative flex h-13 w-13 items-center justify-center rounded-[14px] bg-[#0e1a07] ring-1 ring-[#375543]/50 text-[#69b715] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_4px_18px_rgba(71,127,11,0.14)] group-hover:ring-[#69b715]/35 transition-all">
              <Icon className="h-6 w-6" />
              <div className="absolute inset-0 rounded-[14px] opacity-0 group-hover:opacity-100 blur-md bg-[#69b715]/10 transition-opacity" />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="badge badge-green font-mono">v{file.version}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#3a3a3a]">stable</span>
            </div>
          </div>

          <h3 className="relative z-10 mb-2.5 text-[18px] font-semibold tracking-tight text-white" style={{ transform: "translateZ(26px)" }} title={file.name}>
            {file.name}
          </h3>
          <p className="relative z-10 mb-5 flex-1 text-[13.6px] leading-relaxed text-[#9a9a9a]" style={{ transform: "translateZ(18px)" }}>
            {file.description || "Описание отсутствует"}
          </p>

          <div className="relative z-10 mb-5 flex flex-wrap gap-1.5" style={{ transform: "translateZ(20px)" }}>
            {file.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-white/[0.034] px-2.5 py-[3px] text-[11px] text-[#6b6b6b] ring-1 ring-white/[0.05]">
                #{tag}
              </span>
            ))}
          </div>

          <div className="relative z-10 mb-5 grid grid-cols-3 gap-2 text-[11.5px] text-[#5a5a5a]" style={{ transform: "translateZ(16px)" }}>
            <div className="flex items-center gap-1.5">
              <HardDrive className="h-3.5 w-3.5 text-[#444]" />
              <span>{formatBytes(file.size)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#444]" />
              <span>{formatDate(file.updatedAt).split(" ").slice(0,2).join(" ")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5 text-[#444]" />
              <span>{formatNumber(file.downloadCount)}</span>
            </div>
          </div>

          <div style={{ transform: "translateZ(28px)" }} className="relative z-10">
            <button
              onClick={handleDownload}
              className="relative w-full overflow-hidden rounded-[12px] bg-[#477f0b] px-4 py-[13px] text-[13.5px] font-semibold text-white transition-all duration-200 hover:bg-[#528f12] hover:shadow-[0_0_28px_rgba(71,127,11,0.35)] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!file.dataUrl}
            >
              <Download className="h-4 w-4" />
              {file.dataUrl ? "Скачать" : "Файл недоступен"}
              <Zap className="absolute right-3 h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
