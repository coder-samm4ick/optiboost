import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import BackgroundEffects from "./BackgroundEffects";
import ScrollProgress from "./ScrollProgress";
import Preloader from "./Preloader";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  disableEffects?: boolean;
}

export default function PageLayout({ children, className = "", disableEffects = false }: PageLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-black">
      <Preloader />
      <ScrollProgress />
      {!disableEffects && <BackgroundEffects />}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <motion.main
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className={`flex-1 ${className}`}
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </div>
  );
}
