import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/SEOHead";

export default function NotFound() {
  return (
    <PageLayout className="flex items-center justify-center">
      <SEOHead
        title="Страница не найдена — NedoHub"
        description="Запрашиваемая страница не существует."
      />

      <section className="flex flex-col items-center justify-center px-5 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card-base border-gradient p-10 sm:p-16"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-400/10 text-[#e06c75]">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h1 className="mb-4 text-6xl font-extrabold text-white sm:text-8xl">404</h1>
          <p className="mb-8 text-lg text-[#a0a0a0]">Страница не найдена или была удалена.</p>
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" />
            На главную
          </Link>
        </motion.div>
      </section>
    </PageLayout>
  );
}
