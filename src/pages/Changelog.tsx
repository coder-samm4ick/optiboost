import { motion } from "framer-motion";
import { Calendar, Tag, ChevronRight, Rocket, Wrench, Bug } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/SEOHead";
import { getChangelog } from "@/lib/storage";
import { formatDate } from "@/lib/utils";

const typeConfig = {
  major: { label: "Major", icon: Rocket, badge: "badge-red" },
  minor: { label: "Minor", icon: Wrench, badge: "badge-amber" },
  patch: { label: "Patch", icon: Bug, badge: "badge-green" },
};

export default function Changelog() {
  const entries = getChangelog();

  return (
    <PageLayout>
      <SEOHead
        title="Список изменений — NedoHub"
        description="История обновлений, новые функции и исправления ошибок. Следите за развитием проекта."
        keywords="changelog, изменения, обновления, версии, история"
      />

      <section className="relative px-5 py-14 sm:py-20">
        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="gradient-text text-[34px] font-[600] leading-tight sm:text-[48px] lg:text-[54px]">
              ИСТОРИЯ ИЗМЕНЕНИЙ
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-[16px] text-[#b5b5b5] sm:text-[18px]">
              Следите за развитием проекта: новые функции, улучшения и исправления.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#477f0b]/55 via-[#375543]/30 to-transparent sm:left-8" />

            {entries.length > 0 ? (
              entries.map((entry, i) => {
                const config = typeConfig[entry.type];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                    className="relative mb-7 pl-16 sm:pl-24"
                  >
                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-[#375543]/60 bg-[#0b0b0b] text-[#69b715] shadow-[0_0_18px_rgba(71,127,11,0.14)] sm:h-16 sm:w-16">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div className="card-base border-gradient p-5 sm:p-7">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className={`badge ${config.badge}`}>{config.label}</span>
                        <span className="badge badge-green">v{entry.version}</span>
                        <span className="flex items-center gap-1.5 text-xs text-[#666]">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(entry.date)}
                        </span>
                      </div>

                      <h3 className="mb-3 text-[20px] font-semibold text-white sm:text-[22px]">{entry.title}</h3>

                      <ul className="space-y-[7px]">
                        {entry.changes.map((change, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[13.8px] leading-relaxed text-[#a6a6a6]">
                            <ChevronRight className="mt-[2px] h-4 w-4 shrink-0 text-[#477f0b]" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-base border-gradient p-10 text-center text-[#666]"
              >
                <Tag className="mx-auto mb-3 h-10 w-10" />
                <p>История изменений пока пуста.</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
