import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function BackgroundEffects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const { scrollYProgress } = useScroll();
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.06, 0.035, 0.02]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: "#000" }}
    >
      {/* Grid overlay - exact nedohackers style */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: gridOpacity,
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
        }}
      />

      {/* Animated glow orbs - nedohackers style */}
      <motion.div
        className="absolute"
        style={{
          width: 602,
          height: 477,
          left: "50%",
          top: "-6%",
          x: "-50%",
          y: 0,
          translateX: (mouse.x - 0.5) * -30,
          translateY: (mouse.y - 0.5) * -20,
        }}
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.22, 0.32, 0.22],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="h-full w-full rounded-[600px]"
          style={{
            background: "#477f0b",
            filter: "blur(180px)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute opacity-50"
        style={{
          width: 759,
          height: 629,
          right: "-10%",
          top: "32%",
          translateX: (mouse.x - 0.5) * 25,
          translateY: (mouse.y - 0.5) * 18,
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.15, 0.26, 0.15],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        <div
          className="h-full w-full rounded-[600px]"
          style={{
            background: "#477f0b",
            filter: "blur(210px)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute opacity-40"
        style={{
          width: 520,
          height: 500,
          left: "-8%",
          top: "62%",
          translateX: (mouse.x - 0.5) * -22,
          translateY: (mouse.y - 0.5) * 14,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      >
        <div
          className="h-full w-full rounded-[600px]"
          style={{
            background: "#477f0b",
            filter: "blur(170px)",
          }}
        />
      </motion.div>

      {/* Mouse spotlight - subtle */}
      <div
        className="absolute h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.065] blur-[140px] transition-transform duration-700 ease-out"
        style={{
          left: `${mouse.x * 100}%`,
          top: `${mouse.y * 100}%`,
          background: "radial-gradient(circle, #477f0b 0%, transparent 70%)",
        }}
      />

      {/* Top vignette */}
      <div
        className="absolute inset-x-0 top-0 h-[34vh]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
        }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0 h-[28vh]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
        }}
      />

      {/* subtle scanlines */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.035) 2px, rgba(255,255,255,0.035) 3px)",
        }}
      />
    </div>
  );
}
