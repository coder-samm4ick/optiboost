import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 160, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 160, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8.5deg", "-8.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8.5deg", "8.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const xPct = mx / rect.width - 0.5;
    const yPct = my / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(38px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}
