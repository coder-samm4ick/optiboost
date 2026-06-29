import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, UserPlus, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/contexts/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    const result = await register(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Ошибка регистрации");
    }
  };

  return (
    <PageLayout className="flex min-h-[calc(100dvh-120px)] items-center justify-center">
      <SEOHead
        title="Регистрация — NedoHub"
        description="Создайте аккаунт NedoHub для доступа к эксклюзивным загрузкам и функциям."
        keywords="регистрация, создать аккаунт, sign up, nedohub"
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
                <UserPlus className="h-[26px] w-[26px]" />
              </div>
              <h1 className="text-[24px] font-[700] text-white">Создать аккаунт</h1>
              <p className="mt-[6px] text-[14px] text-[#777]">Зарегистрируйтесь, чтобы начать загрузки</p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-[12px] border border-red-400/20 bg-red-400/10 p-3 text-[13.5px] text-[#e06c75]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
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
                    placeholder="Минимум 6 символов"
                    className="input-field !pl-11 pr-11"
                    required
                    minLength={6}
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

              <div>
                <label className="mb-[8px] block text-[13.5px] font-[500] text-[#a0a0a0]">Подтвердите пароль</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="input-field !pl-11"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? "Регистрация..." : "Зарегистрироваться"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-[13.5px] text-[#666]">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="font-[500] text-[#69b715] hover:underline">
                Войти
              </Link>
            </p>
          </div>
        </motion.div>
      </section>
    </PageLayout>
  );
}
