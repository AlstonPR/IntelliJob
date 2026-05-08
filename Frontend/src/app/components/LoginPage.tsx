import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useCursorGlow } from "./useCursorGlow";
import { Logo } from "./Logo";

// TODO: Add Firebase/Supabase/Auth backend here
// Temporary dummy login for UI testing only

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`;

// TODO: Replace with real auth validation against backend
const DUMMY_EMAIL = "demo@intellijob.ai";
const DUMMY_PASSWORD = "demo1234";

export function LoginPage() {
  const navigate = useNavigate();
  const cursor = useCursorGlow();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const shapes = [
    { size: 320, x: "8%", y: "12%", color: "#6b2d8b", delay: 0 },
    { size: 200, x: "15%", y: "55%", color: "#c4541a", delay: 1.2 },
    { size: 160, x: "45%", y: "20%", color: "#8b1a1a", delay: 0.6 },
    { size: 100, x: "30%", y: "75%", color: "#ff9d7a", delay: 1.8 },
  ];

  // TODO: Replace this entire function with real auth (Firebase/Supabase signIn)
  const handleLogin = async () => {
    setError("");
    if (!email || !pass) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    // Temporary dummy authentication — any filled credentials succeed after a short delay
    await new Promise((res) => setTimeout(res, 900));
    // TODO: Replace below with: await signInWithEmailAndPassword(auth, email, password)
    // or: await supabase.auth.signInWithPassword({ email, password })
    setLoading(false);
    navigate("/dashboard");
  };

  // TODO: Replace with real Google OAuth (Firebase Google Sign-In / Supabase Google provider)
  const handleGoogle = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden relative"
      style={{ background: "#080808", fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Cursor glow */}
      <motion.div
        className="pointer-events-none fixed z-50 rounded-full"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(107,45,139,0.15) 0%, transparent 70%)",
          left: cursor.x - 200,
          top: cursor.y - 200,
        }}
        animate={{ left: cursor.x - 200, top: cursor.y - 200 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      />

      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-40 opacity-40"
        style={{ backgroundImage: GRAIN_SVG, backgroundSize: "200px 200px" }}
      />

      {/* LEFT PANEL */}
      <div className="relative flex-1 flex flex-col justify-between p-12 overflow-hidden">
        {shapes.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{ width: s.size, height: s.size, left: s.x, top: s.y, background: s.color, filter: "blur(80px)", opacity: 0.25 }}
            animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 7 + i * 1.5, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}

        {/* Logo — UPLOAD LOGO HERE: see /src/app/components/Logo.tsx */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Logo size={30} />
          <span
            className="text-white tracking-widest uppercase text-xs"
            style={{ letterSpacing: "0.25em", fontWeight: 700 }}
          >
            IntelliJob
          </span>
        </motion.div>

        {/* Main headline */}
        <div className="space-y-6 max-w-lg">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            <h1
              className="text-white"
              style={{ fontSize: "clamp(2.5rem, 4vw, 3.8rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              Your career
              <br />
              <span style={{ color: "#ff9d7a" }}>shouldn't</span>
              <br />
              depend on luck.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ color: "#a8a8b3", fontSize: "1.05rem", lineHeight: 1.7 }}
          >
            Let AI understand who you are
            <br />
            and find where you belong.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex gap-3 flex-wrap"
          >
            {["Resume Analysis", "AI Matching", "Interview Prep", "Auto Alerts"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs"
                style={{ border: "1px solid rgba(255,157,122,0.3)", color: "#ff9d7a", background: "rgba(255,157,122,0.05)" }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(107,45,139,0.6), transparent)", transformOrigin: "left" }}
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center w-full max-w-lg p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "2.5rem" }}
        >
          <div className="mb-8">
            <h2 className="text-white mb-1" style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Welcome back
            </h2>
            <p style={{ color: "#5a5a6e", fontSize: "0.9rem" }}>Sign in to your IntelliJob account</p>
          </div>

          {/* Demo hint */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-4 px-3 py-2 rounded-lg"
            style={{ background: "rgba(255,157,122,0.06)", border: "1px solid rgba(255,157,122,0.15)" }}
          >
            <p style={{ color: "#ff9d7a", fontSize: "0.72rem", lineHeight: 1.5 }}>
              <span style={{ opacity: 0.6 }}>Demo: </span>
              Any email + password will sign you in for UI testing.
            </p>
          </motion.div>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-2 text-xs uppercase" style={{ color: "#5a5a6e", letterSpacing: "0.12em" }}>
                Email
              </label>
              <motion.input
                whileFocus={{ borderColor: "rgba(107,45,139,0.7)" }}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com"
                className="w-full outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: "0.9rem", transition: "border-color 0.2s" }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-xs uppercase" style={{ color: "#5a5a6e", letterSpacing: "0.12em" }}>
                Password
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ borderColor: "rgba(107,45,139,0.7)" }}
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => { setPass(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full outline-none pr-10"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: "0.9rem", transition: "border-color 0.2s" }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: "none", border: "none", color: "#5a5a6e", cursor: "pointer" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="flex items-center gap-2"
                  style={{ color: "#f87171", fontSize: "0.8rem" }}
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue */}
            <motion.button
              whileHover={{ scale: 1.02, background: "#e8876a" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-2"
              style={{ background: "#ff6b35", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                />
              ) : (
                <>Continue <ArrowRight size={16} /></>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <span style={{ color: "#3a3a4a", fontSize: "0.75rem" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Google — TODO: Connect real Google OAuth provider */}
            <motion.button
              whileHover={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3"
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px", color: "#a8a8b3", fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
                <path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
              </svg>
              Continue with Google
            </motion.button>
          </div>

          <p className="mt-6 text-center" style={{ color: "#3a3a4a", fontSize: "0.8rem" }}>
            No account?{" "}
            <button
              onClick={() => navigate("/")}
              style={{ color: "#ff9d7a", background: "none", border: "none", cursor: "pointer" }}
            >
              Get started free
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}