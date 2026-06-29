import { Link } from "react-router-dom";
import { Code2, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#010101]">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="NedoHub" className="h-9 w-9" />
              <span className="text-lg font-bold">Nedo<span className="text-[#69b715]">Hub</span></span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#555]">
              Современная платформа загрузок ПО с автоматическим отображением версий, админ-панелью и адаптивным дизайном.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#a0a0a0]">Разделы</h4>
            <ul className="space-y-2 text-sm text-[#555]">
              <li><Link to="/" className="hover:text-[#69b715] transition-colors">Главная</Link></li>
              <li><Link to="/downloads" className="hover:text-[#69b715] transition-colors">Загрузки</Link></li>
              <li><Link to="/changelog" className="hover:text-[#69b715] transition-colors">Список изменений</Link></li>
              <li><Link to="/login" className="hover:text-[#69b715] transition-colors">Вход</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#a0a0a0]">Контакты</h4>
            <div className="flex gap-3">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-[#a0a0a0] transition-colors hover:border-[#477f0b]/50 hover:text-[#69b715]">
                <Code2 className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-[#a0a0a0] transition-colors hover:border-[#477f0b]/50 hover:text-[#69b715]">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="mailto:hello@nedohub.ru" className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-[#a0a0a0] transition-colors hover:border-[#477f0b]/50 hover:text-[#69b715]">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-sm text-[#555] sm:flex-row">
          <p>© {year} NedoHub. Все права защищены.</p>
          <p>Сделано с вдохновением от Недохакеров</p>
        </div>
      </div>
    </footer>
  );
}
