import { motion, useScroll, useTransform, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Upload, Cpu, Sparkles, Send, FileText, Bell, ArrowRight,
  ChevronRight, Zap, Brain, Target, Mail, Star, TrendingUp,
  CheckCircle, Play, Menu, X
} from "lucide-react";
import { useCursorGlow } from "./useCursorGlow";
import { Logo } from "./Logo";

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`;

function FadeIn({ children, delay = 0, className = "" }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(8,8,8,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      {/* UPLOAD LOGO HERE — see /src/app/components/Logo.tsx */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Logo size={32} />
        <span
          className="text-white tracking-widest uppercase"
          style={{ letterSpacing: "0.2em", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", fontWeight: 700 }}
        >
          IntelliJob
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {["Features", "Workflow", "About", "Contact"].map((item) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase()}`}
            whileHover={{ color: "#ff9d7a" }}
            className="text-sm cursor-pointer transition-colors"
            style={{ color: "#5a5a6e", textDecoration: "none", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {item}
          </motion.a>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-3">
        <motion.button
          whileHover={{ color: "#fff" }}
          onClick={() => navigate("/login")}
          style={{
            background: "none",
            border: "none",
            color: "#5a5a6e",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Login
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04, background: "#e8876a" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/login")}
          className="flex items-center gap-2"
          style={{
            background: "#ff6b35",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px 28px",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            transition: "background 0.2s",
          }}
        >
          Start Free <ArrowRight size={16} />
        </motion.button>
      </div>

      <button
        className="md:hidden"
        style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 p-6 flex flex-col gap-4"
            style={{ background: "rgba(8,8,8,0.95)", backdropFilter: "blur(20px)" }}
          >
            {["Features", "Workflow", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                style={{ color: "#a8a8b3", textDecoration: "none", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item}
              </a>
            ))}
            <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "#ff9d7a", textAlign: "left", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>Login</button>
            <button onClick={() => navigate("/login")} style={{ background: "#ff6b35", color: "#fff", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>Get Started</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  const cursor = useCursorGlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMouseOffset({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const jobs = [
    { role: "Senior Product Designer", company: "Linear", match: 97, salary: "$140k" },
    { role: "AI/ML Engineer", company: "Vercel", match: 91, salary: "$175k" },
    { role: "UX Lead", company: "Figma", match: 88, salary: "$155k" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: "80px" }}
    >
      {/* BG gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ x: mouseOffset.x * -20, y: mouseOffset.y * -20 }}
          className="absolute"
          animate={{ x: mouseOffset.x * -20, y: mouseOffset.y * -20 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
        >
          <div
            style={{
              position: "absolute",
              width: 700,
              height: 700,
              left: -100,
              top: -100,
              background: "radial-gradient(circle, rgba(107,45,139,0.2) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </motion.div>
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            right: 200,
            bottom: 100,
            background: "radial-gradient(circle, rgba(196,84,26,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Cursor glow */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)",
            left: cursor.x - 250,
            top: cursor.y - 250,
          }}
          animate={{ left: cursor.x - 250, top: cursor.y - 250 }}
          transition={{ type: "spring", stiffness: 100, damping: 25 }}
        />
      </div>

      {/* Giant BG text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ opacity: 0.04 }}
      >
        <span
          style={{
            fontSize: "22vw",
            fontWeight: 900,
            color: "#fff",
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "-0.05em",
            whiteSpace: "nowrap",
          }}
        >
          INTELLIJOB
        </span>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <motion.div style={{ y, opacity }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8"
            style={{
              border: "1px solid rgba(255,157,122,0.3)",
              background: "rgba(255,157,122,0.05)",
            }}
          >
            <span style={{ color: "#ff9d7a", fontSize: "0.75rem" }}>◈</span>
            <span style={{ color: "#ff9d7a", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
              AI-POWERED CAREER ENGINE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#fff",
              fontFamily: "'Space Grotesk', sans-serif",
              marginBottom: "1.5rem",
            }}
          >
            AI that hunts,
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #ff6b35, #ff9d7a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              prepares & lands.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            style={{
              color: "#5a5a6e",
              fontSize: "1.1rem",
              lineHeight: 1.7,
              maxWidth: 480,
              marginBottom: "2.5rem",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Upload your resume. Tell us what you actually want. IntelliJob's AI autonomously
            discovers opportunities, tailors your resume per role, auto-applies, and
            coaches you through every interview — so you show up ready to win.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, background: "#e8876a" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="flex items-center gap-2"
              style={{
                background: "#ff6b35",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "14px 28px",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                transition: "background 0.2s",
              }}
            >
              Start Free <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
              className="flex items-center gap-2"
              style={{
                background: "transparent",
                color: "#5a5a6e",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "14px 28px",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                transition: "all 0.2s",
              }}
            >
              <Play size={15} /> Watch Demo
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-6 mt-10"
          >
            {[
              { val: "50K+", label: "Jobs analyzed daily" },
              { val: "94%", label: "Match accuracy" },
              { val: "3x", label: "Faster job search" },
            ].map((stat) => (
              <div key={stat.val}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.3rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.val}
                </div>
                <div style={{ color: "#3a3a4a", fontSize: "0.75rem" }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — floating dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, x: 60, rotateY: 15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:block relative"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "1.5rem",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* ATS Score */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ color: "#5a5a6e", fontSize: "0.7rem", letterSpacing: "0.12em" }}>
                  ATS SCORE
                </div>
                <div
                  style={{
                    color: "#4ade80",
                    fontSize: "2rem",
                    fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  87
                  <span style={{ color: "#3a3a4a", fontSize: "1rem" }}>/100</span>
                </div>
              </div>
              <div className="relative">
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <motion.circle
                    cx="30" cy="30" r="24"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="150.8"
                    initial={{ strokeDashoffset: 150.8 }}
                    animate={{ strokeDashoffset: 150.8 * 0.13 }}
                    transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                    style={{ transformOrigin: "30px 30px", transform: "rotate(-90deg)" }}
                  />
                </svg>
              </div>
            </div>

            {/* Job cards */}
            <div className="space-y-3 mb-4">
              {jobs.map((job, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.15 }}
                  whileHover={{ x: 4, background: "rgba(255,255,255,0.06)" }}
                  className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div>
                    <div style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600 }}>
                      {job.role}
                    </div>
                    <div style={{ color: "#5a5a6e", fontSize: "0.7rem" }}>
                      {job.company} · {job.salary}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      style={{
                        color: job.match > 94 ? "#4ade80" : job.match > 88 ? "#ff9d7a" : "#a8a8b3",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {job.match}%
                    </div>
                    <div style={{ color: "#3a3a4a", fontSize: "0.65rem" }}>match</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Alert badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                background: "rgba(255,157,122,0.08)",
                border: "1px solid rgba(255,157,122,0.2)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff9d7a" }}
              />
              <span style={{ color: "#ff9d7a", fontSize: "0.75rem" }}>
                12 new matches since yesterday
              </span>
            </motion.div>
          </motion.div>

          {/* Floating chip */}
          <motion.div
            animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute -top-6 -left-8 px-3 py-2 rounded-lg flex items-center gap-2"
            style={{
              background: "rgba(107,45,139,0.3)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(107,45,139,0.4)",
            }}
          >
            <Brain size={14} style={{ color: "#c084fc" }} />
            <span style={{ color: "#c084fc", fontSize: "0.75rem" }}>AI Analyzing...</span>
          </motion.div>

          {/* Floating email badge */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -bottom-4 -right-6 px-3 py-2 rounded-lg flex items-center gap-2"
            style={{
              background: "rgba(196,84,26,0.25)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(196,84,26,0.4)",
            }}
          >
            <Mail size={14} style={{ color: "#ff9d7a" }} />
            <span style={{ color: "#ff9d7a", fontSize: "0.75rem" }}>Alert sent!</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  const steps = [
    { icon: Upload, title: "Upload Resume PDF", desc: "Drop your resume and let AI parse every detail.", color: "#6b2d8b" },
    { icon: Cpu, title: "AI Extracts Skills", desc: "Advanced NLP maps your skills, experience, and strengths.", color: "#8b1a1a" },
    { icon: FileText, title: "Write Your Preferences", desc: "Describe your dream role naturally — the AI understands context.", color: "#c4541a" },
    { icon: Target, title: "AI Finds Matching Jobs", desc: "Real-time scanning across thousands of job boards.", color: "#ff6b35" },
    { icon: Sparkles, title: "AI Rewrites Resume", desc: "Tailored resumes generated for each opportunity.", color: "#ff9d7a" },
    { icon: Bell, title: "Automated Alerts Sent", desc: "Get curated matches delivered to your inbox automatically.", color: "#d4c4b0" },
  ];

  return (
    <section id="workflow" className="py-32 relative" style={{ overflow: "hidden" }}>
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="text-center mb-20">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs mb-4"
              style={{
                border: "1px solid rgba(255,157,122,0.25)",
                color: "#ff9d7a",
                background: "rgba(255,157,122,0.05)",
                letterSpacing: "0.12em",
              }}
            >
              HOW IT WORKS
            </span>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Six steps to your
              <br />
              <span style={{ color: "#ff9d7a" }}>perfect career.</span>
            </h2>
          </div>
        </FadeIn>

        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px pointer-events-none hidden md:block"
            style={{ background: "linear-gradient(180deg, transparent, rgba(107,45,139,0.4), rgba(255,107,53,0.4), transparent)" }}
          />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`flex items-center gap-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  {/* Card */}
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="flex-1 p-6 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid rgba(255,255,255,0.07)`,
                      borderLeft: `2px solid ${step.color}`,
                      cursor: "default",
                      transition: "all 0.3s",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex items-center justify-center rounded-xl"
                        style={{
                          width: 44,
                          height: 44,
                          background: `${step.color}20`,
                          border: `1px solid ${step.color}40`,
                          flexShrink: 0,
                        }}
                      >
                        <step.icon size={20} style={{ color: step.color }} />
                      </div>
                      <div>
                        <div style={{ color: step.color, fontSize: "0.7rem", letterSpacing: "0.15em", marginBottom: 4 }}>
                          STEP {String(i + 1).padStart(2, "0")}
                        </div>
                        <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "1.05rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 }}>
                          {step.title}
                        </h3>
                        <p style={{ color: "#5a5a6e", fontSize: "0.875rem", lineHeight: 1.6 }}>{step.desc}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Center dot */}
                  <div className="hidden md:flex items-center justify-center w-12 flex-shrink-0">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: step.color,
                        boxShadow: `0 0 20px ${step.color}`,
                      }}
                    />
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PreferencesSection() {
  const tags = [
    { label: "Remote Work", color: "#6b2d8b", x: -160, y: -60 },
    { label: "Startup Culture", color: "#c4541a", x: 160, y: -40 },
    { label: "Flexible Hours", color: "#8b1a1a", x: -140, y: 60 },
    { label: "High Growth", color: "#ff6b35", x: 170, y: 55 },
    { label: "Creative Team", color: "#6b2d8b", x: 0, y: -80 },
  ];

  return (
    <section id="features" className="py-32 relative" style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(107,45,139,0.08) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs mb-6"
              style={{
                border: "1px solid rgba(107,45,139,0.3)",
                color: "#c084fc",
                background: "rgba(107,45,139,0.08)",
                letterSpacing: "0.12em",
              }}
            >
              PREFERENCE ENGINE
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
                fontFamily: "'Space Grotesk', sans-serif",
                lineHeight: 1.15,
                marginBottom: "1rem",
              }}
            >
              The AI understands
              <br />
              more than just
              <br />
              <span style={{ color: "#c084fc" }}>your resume.</span>
            </h2>
            <p style={{ color: "#5a5a6e", lineHeight: 1.7, fontSize: "0.95rem", fontFamily: "'Inter', sans-serif" }}>
              Write naturally. Describe what you actually want in a job. Our AI extracts
              culture preferences, work style, salary expectations, and growth goals — all
              from plain language.
            </p>

            <div className="mt-8 space-y-3">
              {["Preferred culture & company type", "Work style & location preferences", "Salary expectations & growth goals"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={16} style={{ color: "#ff9d7a", flexShrink: 0 }} />
                  <span style={{ color: "#a8a8b3", fontSize: "0.875rem" }}>{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="relative">
              {/* Text area mockup */}
              <motion.div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16,
                  padding: "1.5rem",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  className="flex items-center gap-2 mb-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.75rem" }}
                >
                  <Sparkles size={14} style={{ color: "#c084fc" }} />
                  <span style={{ color: "#5a5a6e", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
                    TELL US WHAT YOU WANT
                  </span>
                </div>
                <p style={{ color: "#a8a8b3", fontSize: "0.875rem", lineHeight: 1.8 }}>
                  I want remote jobs, preferably at startups or innovative companies.
                  I love creative teams and need flexible timings because I work best
                  between 10am–7pm. Looking for growth opportunities and a good
                  salary band around{" "}
                  <span style={{ color: "#ff9d7a" }}>$120k–$160k</span>. Culture matters
                  more than brand name to me.
                </p>
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 16,
                    background: "#c084fc",
                    verticalAlign: "middle",
                    marginLeft: 2,
                  }}
                />
              </motion.div>

              {/* Floating AI tags */}
              {tags.map((tag, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  animate={{ y: [0, -5, 0] }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(calc(-50% + ${tag.x}px), calc(-50% + ${tag.y}px))`,
                    zIndex: 3,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
                    className="px-3 py-1 rounded-full text-xs whitespace-nowrap"
                    style={{
                      background: `${tag.color}20`,
                      border: `1px solid ${tag.color}50`,
                      color: tag.color,
                    }}
                  >
                    ✦ {tag.label}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function MatchingSection() {
  const jobCards = [
    {
      role: "Product Designer",
      company: "Arc Browser",
      salary: "$130k–$155k",
      match: 97,
      tags: ["Remote", "Series B", "Design Systems"],
      color: "#6b2d8b",
    },
    {
      role: "Senior ML Engineer",
      company: "Vercel",
      salary: "$170k–$200k",
      match: 93,
      tags: ["Hybrid", "AI/ML", "Scale"],
      color: "#ff6b35",
    },
    {
      role: "UX Research Lead",
      company: "Notion",
      salary: "$140k–$165k",
      match: 89,
      tags: ["Remote", "B2B SaaS", "0→1"],
      color: "#8b1a1a",
    },
    {
      role: "Design Engineer",
      company: "Linear",
      salary: "$155k–$185k",
      match: 86,
      tags: ["Remote", "Tools", "React"],
      color: "#c4541a",
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="text-center mb-16">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs mb-4"
              style={{
                border: "1px solid rgba(255,107,53,0.25)",
                color: "#ff6b35",
                background: "rgba(255,107,53,0.05)",
                letterSpacing: "0.12em",
              }}
            >
              AI MATCHING
            </span>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Jobs ranked by
              <br />
              <span style={{ color: "#ff6b35" }}>compatibility.</span>
            </h2>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {jobCards.map((card, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderTop: `2px solid ${card.color}`,
                  borderRadius: 16,
                  padding: "1.25rem",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  height: "100%",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: `${card.color}20`,
                      border: `1px solid ${card.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Zap size={16} style={{ color: card.color }} />
                  </div>
                  <div className="text-right">
                    <div
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: card.match > 94 ? "#4ade80" : card.match > 88 ? "#ff9d7a" : "#a8a8b3",
                        fontFamily: "'Space Grotesk', sans-serif",
                        lineHeight: 1,
                      }}
                    >
                      {card.match}%
                    </div>
                    <div style={{ color: "#3a3a4a", fontSize: "0.65rem" }}>match</div>
                  </div>
                </div>

                <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem", marginBottom: 4, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {card.role}
                </h3>
                <div style={{ color: "#5a5a6e", fontSize: "0.8rem", marginBottom: 8 }}>{card.company}</div>
                <div style={{ color: "#ff9d7a", fontSize: "0.8rem", marginBottom: 12 }}>{card.salary}</div>

                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "#5a5a6e",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <motion.button
                  whileHover={{ background: card.color, color: "#fff" }}
                  className="w-full mt-4 py-2 rounded-lg text-xs font-medium"
                  style={{
                    background: `${card.color}15`,
                    border: `1px solid ${card.color}30`,
                    color: card.color,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Apply Now
                </motion.button>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmailAlertsSection() {
  const notifications = [
    { time: "Now", text: "3 new matches found — Senior Product Designer at Arc" },
    { time: "3d ago", text: "Resume tailored for Vercel ML Engineer role" },
    { time: "6d ago", text: "Your weekly digest: 12 new opportunities" },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 70% 50%, rgba(196,84,26,0.07) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left — settings mockup */}
          <FadeIn>
            <motion.div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "2rem",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Bell size={16} style={{ color: "#ff9d7a" }} />
                <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                  Alert Settings
                </span>
              </div>

              {[
                { label: "Email Address", value: "alex@example.com", type: "text" },
                { label: "Frequency", value: "Every 3 days", type: "select" },
                { label: "Send Time", value: "9:00 AM", type: "time" },
                { label: "Recommendations per Email", value: "5 jobs", type: "select" },
              ].map((field, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between py-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <span style={{ color: "#5a5a6e", fontSize: "0.85rem" }}>{field.label}</span>
                  <span
                    className="px-3 py-1 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#a8a8b3",
                      fontSize: "0.8rem",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {field.value}
                  </span>
                </motion.div>
              ))}

              <div className="flex items-center justify-between mt-4">
                <span style={{ color: "#5a5a6e", fontSize: "0.85rem" }}>Automation Active</span>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer"
                  style={{
                    background: "rgba(74,222,128,0.12)",
                    border: "1px solid rgba(74,222,128,0.25)",
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }}
                  />
                  <span style={{ color: "#4ade80", fontSize: "0.8rem" }}>Running</span>
                </motion.div>
              </div>
            </motion.div>
          </FadeIn>

          {/* Right — notifications */}
          <FadeIn delay={0.2}>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs mb-6"
              style={{
                border: "1px solid rgba(255,157,122,0.25)",
                color: "#ff9d7a",
                background: "rgba(255,157,122,0.05)",
                letterSpacing: "0.12em",
              }}
            >
              AUTOMATION
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
                fontFamily: "'Space Grotesk', sans-serif",
                lineHeight: 1.15,
                marginBottom: "1.5rem",
              }}
            >
              Jobs come to
              <br />
              <span style={{ color: "#ff9d7a" }}>your inbox.</span>
            </h2>
            <p style={{ color: "#5a5a6e", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "2rem", fontFamily: "'Inter', sans-serif" }}>
              Set your schedule. AI continuously scans the market and delivers the best
              matches directly to you — with personalized resumes attached.
            </p>

            <div className="space-y-3">
              {notifications.map((n, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#ff9d7a",
                      marginTop: 5,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#a8a8b3", fontSize: "0.8rem", lineHeight: 1.5 }}>{n.text}</p>
                    <span style={{ color: "#3a3a4a", fontSize: "0.7rem" }}>{n.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const navigate = useNavigate();
  const cursor = useCursorGlow();

  return (
    <section id="contact" className="py-40 relative flex items-center justify-center overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(107,45,139,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)",
            left: cursor.x - 200,
            top: cursor.y - 200,
          }}
          animate={{ left: cursor.x - 200, top: cursor.y - 200 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        <FadeIn>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.03em",
              fontFamily: "'Space Grotesk', sans-serif",
              lineHeight: 1.05,
              marginBottom: "1rem",
            }}
          >
            Stop searching
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #ff6b35, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              endlessly.
            </span>
          </h2>
          <p
            style={{
              color: "#5a5a6e",
              fontSize: "1.15rem",
              marginBottom: "3rem",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Let AI search for you.
          </p>

          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 20px 60px rgba(255,107,53,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #ff6b35, #c4541a)",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "18px 48px",
              fontSize: "1.1rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: "0 8px 32px rgba(255,107,53,0.25)",
            }}
          >
            Get Started Free <ArrowRight size={20} />
          </motion.button>

          <p style={{ color: "#3a3a4a", fontSize: "0.8rem", marginTop: "1rem" }}>
            No credit card required · Free forever plan
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#080808", fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        style={{ backgroundImage: GRAIN_SVG, backgroundSize: "200px 200px" }}
      />

      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <PreferencesSection />
      <MatchingSection />
      <EmailAlertsSection />
      <CTASection />

      {/* Footer */}
      <footer
        className="py-12 px-8 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span style={{ color: "#3a3a4a", fontSize: "0.8rem" }}>
          © 2025 IntelliJob · Built for ambitious humans.
        </span>
      </footer>
    </div>
  );
}