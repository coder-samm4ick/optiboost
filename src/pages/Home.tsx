import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Download, Shield, Zap, Layers, Sparkles, TrendingUp, Cpu, Terminal, FileCheck } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import FileCard from "@/components/FileCard";
import { getFiles, getChangelog } from "@/lib/storage";
import { formatNumber } from "@/lib/utils";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const end = value;
    const duration = 1400;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return <span ref={ref}>{formatNumber(display)}{suffix}</span>;
}

function TypewriterText({ texts, speed = 55 }: { texts: string[]; speed?: number }) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) setCharIndex(c => c + 1);
        else setTimeout(() => setDeleting(true), 1200);
      } else {
        if (charIndex > 0) setCharIndex(c => c - 1);
        else {
          setDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, deleting ? speed / 1.8 : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts, speed]);

  const current = texts[textIndex].slice(0, charIndex);
  return (
    <span className="relative">
      {current}
      <span className="ml-[2px] inline-block h-[1.05em] w-[2px] translate-y-[5px] bg-[#69b715] animate-pulse" />
    </span>
  );
}

const features = [
  {
    icon: Zap,
    title: "Мгновенные загрузки",
    desc: "Файлы доступны сразу после публикации через админ-панель. CDN-кеш и автовесификация.",
  },
  {
    icon: Shield,
    title: "Безопасность",
    desc: "Контроль целостности, проверка версий и защищённая админ-сессия.",
  },
  {
    icon: Layers,
    title: "Версионирование",
    desc: "Авто-отображение версии прямо на карточке. История в changelog.",
  },
];

const rubrics = [
  {
    icon: "/svg/ssn.svg",
    fallback: Terminal,
    title: "NedoLauncher",
    description:
      "Лёгкий оффлайн-лаунчер. Автообновления, проверка хешей, минимальные системные требования. Поддержка Windows/macOS.",
  },
  {
    icon: "/svg/tssn.svg",
    fallback: Cpu,
    title: "NedoTools Pro",
    description:
      "Продвинутая сборка утилит для инженеров: скрипты автоматизации, мониторинг и безопасные патчи.",
    featured: true,
  },
  {
    icon: "/svg/hx.svg",
    fallback: FileCheck,
    title: "Конфиги / HX",
    description:
      "Архивы конфигураций и пресетов. Проверяются вручную перед публикацией. Полная обратная связь в changelog.",
  },
];

export default function Home() {
  const files = getFiles();
  const latestFiles = files.slice(0, 3);
  const totalDownloads = files.reduce((s, f) => s + f.downloadCount, 0);
  const changelog = getChangelog();

  return (
    <PageLayout>
      <SEOHead
        title="NedoHub — Загрузки и версии ПО"
        description="Современная платформа загрузок программного обеспечения с автоматическим отображением версий, админ-панелью и адаптивным дизайном."
        keywords="загрузки, софт, программы, версии, changelog, nedohub"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "NedoHub",
          url: "https://nedohub.ru",
          description: "Современная платформа загрузок ПО с автоматическим отображением версий.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://nedohub.ru/downloads?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />

      {/* HERO - nedohackers style */}
      <section className="relative px-5 pt-14 pb-20 sm:pt-24 sm:pb-28">
        <div className="relative z-10 mx-auto max-w-[1105px]">
          <div className="flex min-h-[58dvh] flex-col items-center justify-center text-center gap-[22px] lg:gap-[30px]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#477f0b]/30 bg-[#477f0b]/[0.09] px-4 py-[7px] text-[13px] text-[#69b715]"
            >
              <Sparkles className="h-[15px] w-[15px]" />
              <span className="font-medium">Платформа загрузок нового поколения</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="gradient-text max-w-[980px] text-center text-[40px] font-[600] leading-tight tracking-[-0.02em] sm:text-[56px] lg:text-[72px]"
              style={{ fontWeight: 600 }}
            >
              ЗАГРУЗКИ, ВЕРСИИ, CHANGELOG
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="max-w-[990px] text-center text-[17px] leading-relaxed text-[#b9b9b9] sm:text-[19px] md:text-[22px]"
            >
              Мы ведём <strong className="text-white font-semibold">NedoHub</strong> — современную площадку для дистрибуции ПО.
              Автоматическое отображение <strong className="text-white font-semibold">версий</strong>, красивые карточки файлов,
              админ-панель для мгновенной публикации и полный <Link to="/changelog" className="text-[#69b715] hover:underline">changelog</Link>.
              <br className="hidden sm:block" />
              Быстро. Безопасно. В стиле Недохакеров.
              <div className="mt-3 text-[15px] text-[#8e8e8e] font-mono">
                <TypewriterText texts={[
                  "npx nedohub install latest",
                  "curl -fsSL nedohub.ru/get | sh",
                  "winget install nedohub.launcher"
                ]} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mt-[8px] flex flex-col items-center gap-[14px] sm:flex-row"
            >
              <Link
                to="/downloads"
                className="group inline-flex items-center gap-2 rounded-[10px] bg-[#477f0b] px-[22px] py-[13px] text-[15px] font-[600] text-white transition-all hover:bg-[#528f12] hover:shadow-[0_0_28px_rgba(71,127,11,0.28)]"
              >
                <Download className="h-[17px] w-[17px]" />
                Перейти к загрузкам
              </Link>
              <Link
                to="/changelog"
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#0b0b0b] px-[22px] py-[13px] text-[15px] font-[500] text-[#d9d9d9] ring-1 ring-white/[0.07] transition-colors hover:bg-[#111] hover:text-white"
              >
                Список изменений
                <ArrowRight className="h-[16px] w-[16px] transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {/* cards like nedohackers */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="mt-5 flex flex-wrap items-center justify-center gap-[28px]"
            >
              {/* card 1 */}
              <div className="relative z-[1] flex min-w-[210px] flex-col items-center justify-center rounded-[9px] bg-[#010101]/80 px-[30px] py-[16px]" style={{ boxShadow: "inset 0 0 0 1.5px transparent" }}>
                <div
                  className="pointer-events-none absolute inset-0 rounded-[9px]"
                  style={{
                    padding: "1.5px",
                    background: "linear-gradient(135deg, transparent 20%, #477f0b 160%)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                <div className="text-[13px] tracking-wide text-[#9d9d9d]">Проверено релизов</div>
                <div className="bg-gradient-to-r from-white to-[#467f0a] bg-clip-text text-[30px] font-[700] leading-tight text-transparent">
                  +{files.length || 12} 
                </div>
              </div>

              {/* card 2 */}
              <div className="relative z-[1] flex min-w-[210px] flex-col items-center justify-center rounded-[9px] bg-[#010101]/80 px-[30px] py-[16px]">
                <div
                  className="pointer-events-none absolute inset-0 rounded-[9px]"
                  style={{
                    padding: "1.5px",
                    background: "linear-gradient(135deg, transparent 20%, #477f0b 160%)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                <div className="text-[13px] tracking-wide text-[#9d9d9d]">Всего загрузок</div>
                <div className="bg-gradient-to-r from-white to-[#467f0a] bg-clip-text text-[30px] font-[700] leading-tight text-transparent">
                  <AnimatedCounter value={totalDownloads || 2536} suffix="+" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* RUBRICS - "В какие рубрики можно попасть?" */}
      <section className="relative px-5 py-[78px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 text-center">
            <h2 className="gradient-text text-[34px] font-[600] leading-tight sm:text-[44px] lg:text-[56px]">
              В какие разделы можно попасть?
            </h2>
          </div>

          <div className="grid gap-[28px] sm:grid-cols-2 lg:grid-cols-3">
            {rubrics.map((r, i) => {
              const Icon = r.fallback;
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className={`relative rounded-[15px] bg-[#010101] p-[30px] flex flex-col ${
                    r.featured ? "ring-1 ring-[#375543] shadow-[0_0_28px_rgba(55,85,67,0.23)]" : ""
                  }`}
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(255,255,255,0) 60%), #010101",
                  }}
                >
                  {/* gradient border */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[15px]"
                    style={{
                      padding: "1.5px",
                      background: r.featured
                        ? "linear-gradient(90deg, #375543, #477f0b)"
                        : "linear-gradient(180deg, rgba(55,85,67,0.08), rgba(55,85,67,0.9))",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      borderRadius: "15px",
                    }}
                  />
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f1710] ring-1 ring-[#2b3b27]">
                    <Icon className="h-6 w-6 text-[#69b715]" />
                  </div>
                  <h3 className="text-[22px] font-[600] text-white">{r.title}</h3>
                  <p className="mt-[10px] text-[15.5px] leading-relaxed text-[#ADADAE]">
                    {r.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-[30px] font-bold text-white sm:text-[40px]">Почему NedoHub?</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#9d9d9d]">
              Всё необходимое для публикации и загрузки программ в одном сервисе.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card-base border-gradient border-gradient-thin p-[26px]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#0f1a07] text-[#69b715] ring-1 ring-[#2d3f1f]">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-[17px] font-semibold text-white">{f.title}</h3>
                <p className="text-[13.8px] leading-relaxed text-[#9a9a9a]">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest downloads */}
      <section className="px-5 py-[70px]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-[30px] font-bold text-white sm:text-[38px]">Последние релизы</h2>
              <p className="max-w-xl text-[#9a9a9a]">
                Актуальные версии программ с автоматическим отображением данных.
              </p>
            </div>
            <Link to="/downloads" className="btn-secondary">
              Все загрузки
              <TrendingUp className="h-4 w-4" />
            </Link>
          </div>

          {latestFiles.length > 0 ? (
            <div className="grid gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
              {latestFiles.map((file, i) => (
                <FileCard key={file.id} file={file} index={i} />
              ))}
            </div>
          ) : (
            <div className="card-base border-gradient p-10 text-center text-[#666]">
              Пока нет опубликованных файлов. Зайдите в админ-панель, чтобы добавить первый релиз.
            </div>
          )}
        </div>
      </section>

      {/* changelog teaser */}
      {changelog.length > 0 && (
        <section className="px-5 pb-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-[30px] font-bold text-white sm:text-[36px]">
              Последние изменения
            </h2>
            <div className="space-y-3">
              {changelog.slice(0, 2).map((c) => (
                <div key={c.id} className="card-base border-gradient border-gradient-thin px-5 py-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="badge badge-green">v{c.version}</span>
                      <span className="text-[12px] text-[#555]">{new Date(c.date).toLocaleDateString("ru-RU")}</span>
                    </div>
                    <div className="font-medium text-white text-[15px]">{c.title}</div>
                  </div>
                  <Link to="/changelog" className="text-[#69b715] text-sm hover:underline shrink-0">Подробнее →</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
