import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Mail, MessageSquare, Twitter } from "lucide-react";

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`;

export function ContactPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#080808", fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="pointer-events-none fixed inset-0 z-10" style={{ backgroundImage: GRAIN_SVG, backgroundSize: "200px 200px" }} />

      <div className="pointer-events-none absolute inset-0">
        <div style={{ position: "absolute", width: 600, height: 600, top: "20%", right: "10%", background: "radial-gradient(circle, rgba(196,84,26,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 400, height: 400, bottom: "10%", left: "10%", background: "radial-gradient(circle, rgba(107,45,139,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />
      </div>

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 z-20"
        style={{ background: "none", border: "none", color: "#5a5a6e", cursor: "pointer", fontSize: "0.85rem" }}
        whileHover={{ color: "#ff9d7a" }}
      >
        ← IntelliJob
      </motion.button>

      <div className="relative z-20 text-center max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10"
          style={{ border: "1px solid rgba(255,107,53,0.3)", background: "rgba(255,107,53,0.06)", color: "#ff9d7a", fontSize: "0.72rem", letterSpacing: "0.18em" }}
        >
          ◈ COMING SOON
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.5rem" }}
        >
          Get in
          <br />
          <span style={{ background: "linear-gradient(135deg, #ff6b35, #ff9d7a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            touch.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ color: "#3a3a4a", fontSize: "1rem", lineHeight: 1.7, marginBottom: "3rem", fontFamily: "'Inter', sans-serif" }}
        >
          A proper contact form is being built. In the meantime, feel free to reach out directly.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,107,53,0.5), rgba(107,45,139,0.5), transparent)", transformOrigin: "center", marginBottom: "3rem" }}
        />

        {/* Placeholder contact items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col gap-3 items-center"
        >
          {[
            { icon: Mail, label: "hello@intellijob.ai", color: "#ff9d7a" },
            { icon: Twitter, label: "@intellijob", color: "#c084fc" },
            { icon: MessageSquare, label: "Live chat — coming soon", color: "#5a5a6e" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: item.color, fontSize: "0.875rem" }}
            >
              <item.icon size={15} style={{ color: item.color }} />
              {item.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}