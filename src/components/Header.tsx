import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/downloads", label: "Наши программы" },
  { to: "/changelog", label: "Changelog" },
];

export default function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  return (
    <header id="site-header" className="relative z-[100] border-b border-white/[0.045] bg-black/70 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-5 py-[20px] lg:py-[30px] max-w-[1280px]">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="NedoHub" className="h-9 w-9 sm:h-10 sm:w-10" />
          <span className="text-[18px] sm:text-[20px] font-[650] tracking-tight text-white">
            Nedo<span className="text-[#69b715]">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-[2rem] md:flex">
          <a
            href="#"
            onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'})}}
            className="text-[15.5px] font-[500] text-[#d8d8d8] hover:text-[#69b715] transition-colors"
          >
            Майнкрафт сервер
          </a>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-[15.5px] font-[500] transition-colors ${
                  isActive ? "text-[#69b715]" : "text-[#d8d8d8] hover:text-[#69b715]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="ml-2 flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-[14px] font-[500] text-[#a8d46f] hover:text-[#69b715] transition-colors flex items-center gap-1.5"
                  >
                    <Shield className="h-4 w-4" />
                    Админ
                  </Link>
                )}
                <button
                  onClick={() => navigate(isAdmin ? "/admin" : "/downloads")}
                  className="flex items-center gap-2 text-[14px] text-[#d2d2d2] hover:text-white transition-colors"
                  title={user?.email}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] ring-1 ring-white/10 text-[#69b715] text-[13px] font-bold">
                    {(user?.email?.[0] || "?").toUpperCase()}
                  </div>
                  <span className="hidden lg:inline max-w-[120px] truncate">{user?.email?.split("@")[0]}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-[#777] hover:text-[#e06c75] transition-colors"
                  aria-label="Выйти"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-[15px] font-[500] text-[#d8d8d8] hover:text-[#69b715] transition-colors"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="rounded-[7px] bg-[#47800b] px-[15px] py-[10px] text-[14.5px] font-[600] text-[#f5f5f5] transition-colors hover:bg-[#2e5307]"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </nav>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden hover:bg-white/[0.06] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[999] bg-black lg:hidden"
            style={{ height: "100dvh" }}
          >
            <div className="container px-5 py-[20px]">
              <div className="mb-[30px] flex items-center justify-between">
                <Link to="/" onClick={() => setMobileOpen(false)}>
                  <img src="/logo.svg" alt="logo" className="h-9 w-9" />
                </Link>
                <button onClick={() => setMobileOpen(false)} className="text-white">
                  <X size={28} />
                </button>
              </div>

              <ul className="flex flex-col gap-[22px]">
                <li className="text-[28px] font-[500]">
                  <a href="#" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#69b715]">Майнкрафт сервер</a>
                </li>
                <li className="text-[28px] font-[500]">
                  <Link to="/downloads" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#69b715]">Наши программы</Link>
                </li>
                <li className="text-[28px] font-[500]">
                  <Link to="/changelog" onClick={() => setMobileOpen(false)} className="text-white hover:text-[#69b715]">Changelog</Link>
                </li>
              </ul>

              <div className="mt-10">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[20px] text-white">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1f1f] text-[#69b715] font-bold">
                        {(user?.email?.[0] || "?").toUpperCase()}
                      </div>
                      <span>{user?.email}</span>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="text-[22px] text-[#69b715]"
                      >
                        Админ панель
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-left text-[22px] text-[#e06c75]"
                    >
                      Выйти
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="text-[24px] font-[500] text-white"
                    >
                      Войти
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="inline-block rounded-[7px] bg-[#47800b] px-5 py-3 text-[22px] font-[600] text-white text-center max-w-[300px]"
                    >
                      Регистрация
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
