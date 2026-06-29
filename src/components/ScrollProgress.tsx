import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[200] h-[2px] origin-left bg-gradient-to-r from-[#477f0b] via-[#69b715] to-[#477f0b]"
      style={{ scaleX }}
    />
  );
}
