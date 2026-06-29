import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldAlert } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Ошибка входа");
    }
  };

  return (
    <PageLayout className="flex min-h-[calc(100dvh-120px)] items-center justify-center">
      <SEOHead
        title="Вход — NedoHub"
        description="Войдите в аккаунт NedoHub для доступа к загрузкам и админ-панели."
        keywords="вход, авторизация, логин, nedohub"
      />

      <section className="relative flex w-full items-center justify-center px-5 py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="card-base border-gradient p-7 sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#0f1a07] text-[#69b715] ring-1 ring-[#2d3f1f]">
                <Mail className="h-[26px] w-[26px]" />
              </div>
              <h1 className="text-[24px] font-[700] text-white">С возвращением</h1>
              <p className="mt-[6px] text-[14px] text-[#777]">Войдите, чтобы получить доступ к загрузкам</p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-[12px] border border-red-400/20 bg-red-400/10 p-3 text-[13.5px] text-[#e06c75]">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-[8px] block text-[13.5px] font-[500] text-[#a0a0a0]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field !pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-[8px] block text-[13.5px] font-[500] text-[#a0a0a0]">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field !pl-11 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#575757] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? "Вход..." : "Войти"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-[13.5px] text-[#666]">
              Ещё нет аккаунта?{" "}
              <Link to="/register" className="font-[500] text-[#69b715] hover:underline">
                Зарегистрироваться
              </Link>
            </p>

            <div className="mt-6 rounded-[12px] border border-[#477f0b]/25 bg-[#477f0b]/[0.09] p-3 text-[12.5px] text-[#7dc636]">
              <p className="font-[600]">Демо-доступ:</p>
              <p className="font-mono">admin@nedohub.ru / admin123</p>
            </div>
          </div>
        </motion.div>
      </section>
    </PageLayout>
  );
}
