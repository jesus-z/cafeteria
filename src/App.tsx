import { useEffect, useMemo, useState, useCallback } from "react";
import { createClient, type Session } from "@supabase/supabase-js";
import { Mail, Lock, Coffee, ArrowRight, Loader2, ShieldCheck, LogOut, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

/* ===========================
   SUPABASE CLIENT
=========================== */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
if (!supabaseUrl || !supabaseAnonKey) {
  // Evita errores silenciosos si faltan las env vars
  console.warn("Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY");
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ===========================
   UI PRIMITIVES
=========================== */
type IconType = React.ComponentType<{ className?: string }>;

type FieldProps = {
  id?: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  Icon?: IconType;
};
function Field({ id, label, type = "text", value, onChange, placeholder, autoComplete, Icon }: FieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label htmlFor={inputId} className="block text-left">
      <span className="text-sm font-medium text-white/85 mb-2.5 block">{label}</span>
      <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 focus-within:border-white/40 focus-within:ring-2 focus-within:ring-white/20 transition backdrop-blur-sm">
        {Icon && <Icon className="h-5 w-5 text-white/70" aria-hidden="true" />}
        <input
          id={inputId}
          className="w-full bg-transparent text-white placeholder-white/40 outline-none text-sm"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
        />
      </div>
    </label>
  );
}

type BtnProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  loading?: boolean;
  variant?: "primary" | "ghost" | "danger";
  icon?: IconType;
};
function Btn({ children, onClick, type = "button", loading, variant = "primary", icon: Icon }: BtnProps) {
  const styles: Record<string, string> = {
    primary: "bg-white text-indigo-600 hover:bg-white/90 shadow-lg shadow-white/20",
    ghost: "bg-white/15 text-white border border-white/30 hover:bg-white/20 backdrop-blur-sm",
    danger: "bg-red-500/90 text-white hover:bg-red-600",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed w-full ${styles[variant]}`}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      {loading ? "Procesando…" : children}
    </button>
  );
}

function Divider({ text = "o" }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 text-white/60" role="separator" aria-label={text}>
      <div className="h-px flex-1 bg-white/20" />
      <span className="text-xs uppercase tracking-widest font-medium">{text}</span>
      <div className="h-px flex-1 bg-white/20" />
    </div>
  );
}

/* ===========================
   DASHBOARD
=========================== */
function Dashboard({ session }: { session: Session }) {
  const [stats] = useState([
    { label: "Pedidos Hoy", value: "24", icon: "📦" },
    { label: "Ingresos", value: "$1,240", icon: "💰" },
    { label: "Clientes", value: "142", icon: "👥" },
  ]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute right-20 top-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/10 backdrop-blur-xl bg-black/20"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-lg">
                <Coffee className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-black text-white">Cafetería</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Salir</span>
            </button>
          </div>
        </motion.header>

        {/* Main */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Welcome */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-black text-white mb-2">Bienvenido, {session.user.email}</h2>
            <p className="text-white/70">Este es tu panel principal</p>
          </motion.section>

          {/* Stats */}
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, i) => (
                <motion.article
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="group rounded-2xl border border-white/20 bg-white/10 p-6 hover:border-white/40 transition backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl" aria-hidden="true">{stat.icon}</span>
                    <TrendingUp className="h-5 w-5 text-white/40 opacity-0 group-hover:opacity-100 transition" aria-hidden="true" />
                  </div>
                  <p className="text-white/70 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                </motion.article>
              ))}
            </div>
          </motion.section>

          {/* Features */}
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Gestión de Pedidos", desc: "Control de pedidos en tiempo real", icon: "📋" },
                { title: "Inventario", desc: "Monitorea stock y mermas", icon: "📦" },
                { title: "Promociones", desc: "Crea y gestiona ofertas", icon: "🎉" },
                { title: "Reportes", desc: "Tendencias de ventas diarias", icon: "📊" },
              ].map((card) => (
                <motion.article
                  key={card.title}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm hover:border-white/40 transition"
                >
                  <div className="text-3xl mb-3" aria-hidden="true">{card.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-white/70 text-sm">{card.desc}</p>
                </motion.article>
              ))}
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}

/* ===========================
   AUTH / LOGIN
=========================== */
type Mode = "signin" | "signup" | "reset";

export default function App() {
  const [mode, setMode] = useState<Mode>("signin");
  const [session, setSession] = useState<Session | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Session bootstrap + listener
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess));
    return () => listener.subscription.unsubscribe();
  }, []);

  const title = useMemo(
    () => (mode === "signin" ? "Iniciar sesión" : mode === "signup" ? "Crear cuenta" : "Recuperar contraseña"),
    [mode]
  );

  const resetFeedback = () => {
    setError("");
    setMessage("");
  };

  const handleSignIn = useCallback(async () => {
    resetFeedback();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  }, [email, password]);

  const handleSignUp = useCallback(async () => {
    resetFeedback();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setMessage("Revisa tu correo para confirmar tu cuenta ✉️");
  }, [email, password]);

  const handleReset = useCallback(async () => {
    resetFeedback();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/#/update-password",
    });
    setLoading(false);
    if (error) setError(error.message);
    else setMessage("Si el correo existe, te enviamos un enlace de recuperación ✉️");
  }, [email]);

  const signInWithProvider = useCallback(async (provider: "google" | "github") => {
    resetFeedback();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) setError(error.message);
  }, []);

  // Si hay sesión → Dashboard
  if (session) return <Dashboard session={session} />;

  /* ---------- LOGIN LAYOUT ---------- */
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Orbes animados */}
      <div className="absolute -left-40 -top-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute right-40 top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <section className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <header className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white flex items-center justify-center shadow-lg"
              >
                <Coffee className="h-8 w-8 text-indigo-600" aria-hidden="true" />
              </motion.div>
              <h1 className="text-3xl font-black text-white mb-2">Cafetería</h1>
              <p className="text-white/75 text-sm font-medium">{title}</p>
            </header>

            {/* FORM */}
            {mode !== "reset" ? (
              <form
                className="space-y-4 mb-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  mode === "signin" ? handleSignIn() : handleSignUp();
                }}
              >
                <Field
                  id="email"
                  label="Correo"
                  value={email}
                  onChange={setEmail}
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                  Icon={Mail}
                />
                <Field
                  id="password"
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  Icon={Lock}
                />
                <Btn loading={loading} icon={ArrowRight} variant="primary" type="submit">
                  {mode === "signin" ? "Entrar a tu cuenta" : "Crear mi cuenta"}
                </Btn>
              </form>
            ) : (
              <form
                className="space-y-4 mb-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleReset();
                }}
              >
                <Field
                  id="email"
                  label="Correo"
                  value={email}
                  onChange={setEmail}
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                  Icon={Mail}
                />
                <Btn loading={loading} icon={ArrowRight} variant="primary" type="submit">
                  Enviar enlace
                </Btn>
              </form>
            )}

            {/* Divider + OAuth */}
            <div className="my-6"><Divider text="o continúa con" /></div>
            <div className="mb-6">
              <Btn variant="ghost" onClick={() => signInWithProvider("google")}>
                🔐 Continuar con Google
              </Btn>
            </div>

            {/* Feedback */}
            {error && (
              <motion.div
                role="alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-lg bg-red-500/20 px-4 py-3 text-sm text-white border border-red-500/30 backdrop-blur-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}
            {message && (
              <motion.div
                role="status"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-lg bg-emerald-500/20 px-4 py-3 text-sm text-white border border-emerald-500/30 backdrop-blur-sm"
              >
                ✅ {message}
              </motion.div>
            )}

            {/* Links */}
            <footer className="space-y-3 text-center text-sm text-white/75">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs">Protegido por Supabase Auth</span>
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t border-white/20">
                {mode !== "reset" ? (
                  <button onClick={() => setMode("reset")} className="hover:text-white transition font-medium text-xs">
                    ¿Olvidaste tu contraseña?
                  </button>
                ) : (
                  <button onClick={() => setMode("signin")} className="hover:text-white transition font-medium text-xs">
                    ← Volver a iniciar sesión
                  </button>
                )}
                <button
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="hover:text-white transition font-medium text-xs"
                >
                  {mode === "signin" ? "¿No tienes cuenta? Crear una →" : "¿Ya tienes cuenta? Iniciar sesión →"}
                </button>
              </div>
            </footer>
          </section>

          <p className="text-center text-xs text-white/60 mt-6">React + Vite + Supabase · 2024</p>
        </motion.div>
      </div>
    </div>
  );
}
