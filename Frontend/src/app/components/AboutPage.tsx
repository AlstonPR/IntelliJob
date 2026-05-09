import { motion } from "motion/react";
import { useNavigate } from "react-router";

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`;

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#080808", fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Grain */}
      <div className="pointer-events-none fixed inset-0 z-10" style={{ backgroundImage: GRAIN_SVG, backgroundSize: "200px 200px" }} />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div style={{ position: "absolute", width: 600, height: 600, top: "20%", left: "20%", background: "radial-gradient(circle, rgba(107,45,139,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 400, height: 400, bottom: "10%", right: "15%", background: "radial-gradient(circle, rgba(196,84,26,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />
      </div>

      {/* Back nav */}
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
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10"
          style={{ border: "1px solid rgba(107,45,139,0.35)", background: "rgba(107,45,139,0.08)", color: "#c084fc", fontSize: "0.72rem", letterSpacing: "0.18em" }}
        >
          ◈ COMING SOON
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1.5rem" }}
        >
          About
          <br />
          <span style={{ background: "linear-gradient(135deg, #c084fc, #6b2d8b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            IntelliJob
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ color: "#3a3a4a", fontSize: "1rem", lineHeight: 1.7, marginBottom: "3rem", fontFamily: "'Inter', sans-serif" }}
        >
          We're crafting something meaningful. The story behind IntelliJob — our mission, team, and vision — will be here soon.
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(107,45,139,0.5), rgba(196,84,26,0.5), transparent)", transformOrigin: "center", marginBottom: "3rem" }}
        />

        {/* Placeholder blocks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-3 gap-4"
        >
          {["Our Mission", "The Team", "Our Story"].map((label, i) => (
            <motion.div
              key={label}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "1.5rem 1rem", color: "#3a3a4a", fontSize: "0.8rem" }}
            >
              {label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
