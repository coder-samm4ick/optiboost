import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Download, SlidersHorizontal, Sparkles } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/SEOHead";
import FileCard from "@/components/FileCard";
import { getFiles } from "@/lib/storage";

export default function Downloads() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "name">("newest");
  const files = getFiles();

  const filtered = useMemo(() => {
    let result = [...files];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    return result;
  }, [files, search, sortBy]);

  return (
    <PageLayout>
      <SEOHead
        title="Загрузки — NedoHub"
        description="Скачивайте актуальные версии программ, утилит и конфигураций. Удобный поиск, сортировка и красивые карточки файлов."
        keywords="загрузки, скачать, софт, программы, версии"
      />

      <section className="relative px-5 py-14 sm:py-20">
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#477f0b]/30 bg-[#477f0b]/[0.09] px-3 py-[6px] text-[12.5px] text-[#69b715]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Центр загрузок</span>
            </div>
            <h1 className="gradient-text text-[34px] font-[600] leading-tight sm:text-[48px] lg:text-[56px]">
              НАШИ ПРОГРАММЫ
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-[16px] leading-relaxed text-[#b5b5b5] sm:text-[18px]">
              Все файлы с автоматическим отображением версий, размера и даты обновления.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mb-9 flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#555]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию, описанию или тегам..."
                className="input-field !pl-11 !py-[13px]"
              />
            </div>

            <div className="relative min-w-[210px]">
              <SlidersHorizontal className="absolute left-4 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#555]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="input-field !pl-11 pr-8 appearance-none !py-[13px]"
              >
                <option value="newest">Сначала новые</option>
                <option value="popular">По популярности</option>
                <option value="name">По названию</option>
              </select>
            </div>
          </motion.div>

          {filtered.length > 0 ? (
            <div className="grid gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((file, i) => (
                <FileCard key={file.id} file={file} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-base border-gradient flex flex-col items-center justify-center p-16 text-center"
            >
              <Download className="mb-4 h-12 w-12 text-[#2e2e2e]" />
              <h3 className="mb-2 text-[20px] font-semibold text-white">Файлы не найдены</h3>
              <p className="max-w-sm text-[14px] text-[#666]">
                Попробуйте изменить запрос поиска или дождитесь публикации новых релизов.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
