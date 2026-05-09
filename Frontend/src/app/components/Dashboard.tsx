/**
 * IntelliJob Dashboard
 *
 * Backend Integration Placeholders:
 * ---------------------------------------------------------------------------
 * TODO: GET  /api/health         — ping on app load to verify backend is up
 * TODO: POST /api/workflow/trigger — trigger the multi-agent LangGraph pipeline
 * TODO: GET  /api/jobs            — fetch AI-discovered jobs from Greenhouse/Lever
 * TODO: GET  /api/applications    — fetch user's application statuses
 * TODO: GET  /api/notifications   — fetch agent activity feed
 * TODO: POST /api/resume/optimize — trigger LaTeX resume tailoring
 * TODO: POST /api/apply?job_id=X  — trigger Playwright auto-apply workflow
 * TODO: POST /api/interview/questions?job_id=X — generate AI interview questions
 *
 * UPLOAD BACKEND INTEGRATION GUIDE HERE
 * Replace dummy data throughout with real API calls aligned to FRONTEND_GUIDE.md
 * ---------------------------------------------------------------------------
 */

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, ReactNode, useRef } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard, Upload, Brain, Target, Bell, Settings,
  FileText, Sparkles, Mail, Zap, TrendingUp,
  ArrowUpRight, Star, LogOut, X,
  Shield, Wand2, FileCheck, ChevronDown,
  Download, Eye, Clock, CheckCircle, GraduationCap,
  BookOpen, Activity, Cpu, AlertCircle
} from "lucide-react";
import { Logo } from "./Logo";
import { IntelliJobAPI } from "../../api/client";

// TODO: Integrate LangGraph orchestration backend here
// TODO: Connect Greenhouse API integration
// TODO: Connect Lever API integration
// TODO: Connect Gmail API for email automation

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "resume", label: "Upload Resume", icon: Upload },
  { id: "preferences", label: "AI Preferences", icon: Wand2 },
  { id: "analysis", label: "AI Analysis", icon: Brain },
  { id: "approved", label: "Approved Matches", icon: Target },
  { id: "resumes", label: "My Resumes", icon: FileCheck },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

function Sidebar({ active, setActive, user }: { active: string; setActive: (id: string) => void; user: any }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full overflow-y-auto"
      style={{ width: 228, background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem 1rem", flexShrink: 0 }}
    >
      {/* UPLOAD LOGO HERE — see /src/app/components/Logo.tsx */}
      <div
        className="flex items-center gap-3 mb-8 cursor-pointer px-1"
        onClick={() => navigate("/")}
      >
        <Logo size={30} />
        <span style={{ color: "#fff", letterSpacing: "0.15em", fontSize: "0.82rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, textTransform: "uppercase" }}>
          IntelliJob
        </span>
      </div>

      {/* Agent status */}
      {/* TODO: Replace with real LangGraph workflow status from GET /api/health */}
      <div className="flex items-center gap-2 px-2 py-2 rounded-lg mb-4" style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.12)" }}>
        <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
        <span style={{ color: "#4ade80", fontSize: "0.68rem", letterSpacing: "0.08em" }}>AI AGENT RUNNING</span>
      </div>

      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
              style={{
                background: isActive ? "rgba(255,107,53,0.12)" : "transparent",
                border: isActive ? "1px solid rgba(255,107,53,0.2)" : "1px solid transparent",
                color: isActive ? "#ff6b35" : "#3a3a4a",
                cursor: "pointer", fontSize: "0.83rem",
                fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s",
              }}
            >
              <item.icon size={15} />
              {item.label}
              {item.id === "approved" && (
                <span className="ml-auto px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(255,107,53,0.2)", color: "#ff6b35" }}>4</span>
              )}
              {item.id === "resumes" && (
                <span className="ml-auto px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>3</span>
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 px-2 pt-4 mt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #6b2d8b, #c4541a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: "#fff", fontWeight: 700, flexShrink: 0 }}>{user.name.charAt(0).toUpperCase()}</div>
        <div className="overflow-hidden">
          <div style={{ color: "#a8a8b3", fontSize: "0.8rem", fontWeight: 600 }}>{user.name}</div>
          <div style={{ color: "#3a3a4a", fontSize: "0.68rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
        </div>
        <motion.button whileHover={{ color: "#ff6b35" }} onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
          style={{ background: "none", border: "none", color: "#3a3a4a", cursor: "pointer", marginLeft: "auto", flexShrink: 0 }}>
          <LogOut size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── USER OVERVIEW PANEL (AI Profile Intelligence) ────────────────────────────
function UserOverviewPanel({ user }: { user: any }) {
  // TODO: Replace with real data from GET /api/applications and resume parser
  const profile = {
    name: user.name,
    detectedRole: "Senior Product Designer / Design Engineer",
    experience: "5 years",
    domain: "Design Systems & Frontend Engineering",
    workPreference: "Remote · Async",
    companyType: "Startup / Scale-up",
    salaryRange: "$120k – $160k",
    atsScore: 87,
    skillsMatch: 72,
    readiness: 68,
    topSkills: ["Figma", "TypeScript", "React", "Design Systems", "User Research", "Prototyping"],
    aiSummary: "Strong T-shaped designer with engineering depth. Exceptional at building design systems and bridging design-to-engineering gaps. Best fit for product-led companies with creative autonomy.",
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4" style={{ border: "1px solid rgba(255,107,53,0.3)", background: "rgba(255,107,53,0.06)", color: "#ff9d7a", letterSpacing: "0.1em" }}>
          <Activity size={11} /> AI PROFILE INTELLIGENCE
        </span>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.6rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 }}>Career Profile</h2>
        <p style={{ color: "#5a5a6e", fontSize: "0.9rem" }}>AI overview of your professional identity and readiness.</p>
      </motion.div>

      {/* Top row — identity + score ring */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Identity card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="md:col-span-2"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.5rem" }}>
          <div className="flex items-center gap-4 mb-4">
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #6b2d8b, #c4541a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", color: "#fff", fontWeight: 700, flexShrink: 0 }}>{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem", fontFamily: "'Space Grotesk', sans-serif" }}>{profile.name}</div>
              <div style={{ color: "#ff9d7a", fontSize: "0.8rem" }}>{profile.detectedRole}</div>
              <div style={{ color: "#5a5a6e", fontSize: "0.75rem" }}>{profile.experience} experience · {profile.domain}</div>
            </div>
          </div>

          {/* AI summary */}
          <div className="p-3 rounded-xl mb-4" style={{ background: "rgba(107,45,139,0.08)", border: "1px solid rgba(107,45,139,0.15)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={11} style={{ color: "#c084fc" }} />
              <span style={{ color: "#c084fc", fontSize: "0.68rem", letterSpacing: "0.1em" }}>AI SUMMARY</span>
            </div>
            <p style={{ color: "#a8a8b3", fontSize: "0.82rem", lineHeight: 1.6 }}>{profile.aiSummary}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Work Style", value: profile.workPreference, color: "#6b2d8b" },
              { label: "Company Type", value: profile.companyType, color: "#c4541a" },
              { label: "Salary Range", value: profile.salaryRange, color: "#ff9d7a" },
              { label: "Strongest Domain", value: profile.domain.split(" ")[0], color: "#c084fc" },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderLeft: `2px solid ${item.color}`, borderRadius: 10, padding: "0.75rem" }}>
                <div style={{ color: item.color, fontSize: "0.65rem", letterSpacing: "0.1em", marginBottom: 2 }}>{item.label}</div>
                <div style={{ color: "#a8a8b3", fontSize: "0.8rem", fontWeight: 500, fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Score ring */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "#5a5a6e", fontSize: "0.7rem", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>AI JOB SCORE</div>
          <div style={{ position: "relative" }}>
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <motion.circle cx="55" cy="55" r="44" fill="none" stroke="#ff6b35" strokeWidth="6" strokeLinecap="round"
                strokeDasharray="276.5"
                initial={{ strokeDashoffset: 276.5 }}
                animate={{ strokeDashoffset: 276.5 * (1 - profile.atsScore / 100) }}
                transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                style={{ transformOrigin: "55px 55px", transform: "rotate(-90deg)" }}
              />
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{profile.atsScore}</div>
              <div style={{ color: "#3a3a4a", fontSize: "0.65rem" }}>/ 100</div>
            </div>
          </div>
          <div className="w-full space-y-2 mt-2">
            {[
              { label: "ATS Score", value: profile.atsScore, color: "#4ade80" },
              { label: "Skills Match", value: profile.skillsMatch, color: "#ff9d7a" },
              { label: "Readiness", value: profile.readiness, color: "#c084fc" },
            ].map((m, i) => (
              <div key={i}>
                <div className="flex justify-between mb-0.5">
                  <span style={{ color: "#3a3a4a", fontSize: "0.65rem" }}>{m.label}</span>
                  <span style={{ color: m.color, fontSize: "0.68rem", fontWeight: 700 }}>{m.value}%</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                    style={{ height: "100%", background: m.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top skills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "1.25rem" }}>
        <div style={{ color: "#5a5a6e", fontSize: "0.7rem", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>TOP DETECTED SKILLS</div>
        <div className="flex flex-wrap gap-2">
          {profile.topSkills.map((skill, i) => (
            <motion.span key={skill} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 + i * 0.05 }}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", color: "#4ade80" }}>
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── DASHBOARD HOME ────────────────────────────────────────────────────────────
function DashboardHome({ setActive, user }: { setActive: (id: string) => void; user: any }) {
  // TODO: Fetch real stats from GET /api/applications and GET /api/jobs
  const stats = [
    { label: "Approved Matches", value: "4", delta: "from inbox", icon: Target, color: "#ff6b35" },
    { label: "ATS Score", value: "87", delta: "+5 pts", icon: Shield, color: "#4ade80" },
    { label: "Auto-Applied", value: "12", delta: "this week", icon: Zap, color: "#c084fc" },
    { label: "Resumes Ready", value: "3", delta: "AI-tailored", icon: FileCheck, color: "#ff9d7a" },
  ];

  const [approvedJobs, setApprovedJobs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const data = await IntelliJobAPI.getJobs();
        // Map backend job schema to frontend UI expectations
        const mapped = data.jobs.map((job: any) => ({
          role: job.title,
          company: job.company,
          match: 95, // AI Match Score (placeholder until ranked_jobs API is exposed)
          salary: "$130k", // Placeholder
        }));
        setApprovedJobs(mapped);
      } catch (e) {
        console.error("Failed to fetch jobs:", e);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-between items-start">
        <div>
          <div style={{ color: "#3a3a4a", fontSize: "0.75rem", letterSpacing: "0.12em", marginBottom: 4 }}>GOOD EVENING</div>
          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{user.name}.</h1>
          <p style={{ color: "#5a5a6e", fontSize: "0.95rem", marginTop: 8 }}>
            <span style={{ color: "#ff9d7a" }}>4 approved job matches</span> waiting for you. AI is hunting, applying & preparing — all in the background.
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={async () => {
            try {
              await IntelliJobAPI.triggerAgent();
              alert("Agent triggered! Check your email in a few minutes.");
            } catch (e) {
              alert("Failed to trigger agent.");
            }
          }}
          style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", borderRadius: 10, padding: "10px 20px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", display: "flex", gap: "8px", alignItems: "center" }}>
          <Sparkles size={16} /> Trigger AI Agent
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4, scale: 1.02 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "1.25rem", cursor: "default" }}>
            <div className="flex items-center justify-between mb-3">
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <span style={{ color: "#4ade80", fontSize: "0.7rem" }}>{stat.delta}</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1, marginBottom: 4 }}>{stat.value}</div>
            <div style={{ color: "#5a5a6e", fontSize: "0.8rem" }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Approved matches preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.5rem" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "1rem", fontFamily: "'Space Grotesk', sans-serif" }}>Approved Matches</h3>
            <p style={{ color: "#3a3a4a", fontSize: "0.72rem", marginTop: 2 }}>Jobs you approved from email · ready to apply & prep</p>
          </div>
          <motion.button whileHover={{ color: "#ff9d7a" }} onClick={() => setActive("approved")}
            style={{ background: "none", border: "none", color: "#3a3a4a", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'Space Grotesk', sans-serif" }}>
            View all →
          </motion.button>
        </div>
        <div className="space-y-3">
          {approvedJobs.map((job, i) => (
            <motion.div key={i} whileHover={{ x: 4, background: "rgba(255,255,255,0.04)" }}
              className="flex items-center justify-between p-3 rounded-xl cursor-pointer"
              style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex items-center gap-3">
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={14} style={{ color: "#ff6b35" }} />
                </div>
                <div>
                  <div style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 500 }}>{job.role}</div>
                  <div style={{ color: "#5a5a6e", fontSize: "0.75rem" }}>{job.company} · {job.salary}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: job.match > 94 ? "#4ade80" : "#ff9d7a", fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Space Grotesk', sans-serif" }}>{job.match}%</span>
                <ArrowUpRight size={14} style={{ color: "#3a3a4a" }} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Upload Resume", desc: "Add your latest CV", icon: Upload, panel: "resume", color: "#ff6b35" },
          { label: "AI Preferences", desc: "Tell AI what you want", icon: Wand2, panel: "preferences", color: "#c084fc" },
          { label: "Career Profile", desc: "AI overview of your identity", icon: Activity, panel: "profile", color: "#ff9d7a" },
        ].map((action, i) => (
          <motion.button key={i} whileHover={{ y: -4, borderColor: `${action.color}40` }} whileTap={{ scale: 0.97 }}
            onClick={() => setActive(action.panel)}
            className="flex items-center gap-3 p-4 rounded-xl text-left"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", transition: "all 0.3s" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${action.color}12`, border: `1px solid ${action.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <action.icon size={16} style={{ color: action.color }} />
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>{action.label}</div>
              <div style={{ color: "#3a3a4a", fontSize: "0.75rem" }}>{action.desc}</div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

// ─── RESUME UPLOAD ─────────────────────────────────────────────────────────────
function ResumePanel() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    IntelliJobAPI.getResumeStatus().then((data) => {
      if (data.uploaded) {
        setUploaded(true);
        setFileName(data.filename);
      }
    }).catch(console.error);
  }, []);

  const handleFile = async (file: File) => {
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setUploaded(false);
    setAnalyzing(true);
    try {
      const res = await IntelliJobAPI.uploadResume(file);
      setFileName(res.filename);
      setUploaded(true);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Upload failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.6rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6 }}>Upload Resume</h2>
        <p style={{ color: "#5a5a6e", fontSize: "0.9rem" }}>PDF only. AI will extract and analyze your skills, experience, and strengths.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <input 
          type="file" 
          accept="application/pdf" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          onChange={onFileChange} 
        />
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !uploaded && !analyzing && fileInputRef.current?.click()}
          whileHover={!uploaded && !analyzing ? { borderColor: "rgba(255,107,53,0.45)" } : {}}
          animate={dragging ? { scale: 1.02 } : { scale: 1 }}
          style={{
            background: dragging ? "rgba(255,107,53,0.05)" : "rgba(255,255,255,0.02)",
            border: `2px dashed ${dragging ? "rgba(255,107,53,0.55)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 20, padding: "4.5rem 2rem",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
            cursor: uploaded || analyzing ? "default" : "pointer", transition: "all 0.3s",
          }}>
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ width: 44, height: 44, border: "2px solid rgba(192,132,252,0.2)", borderTopColor: "#c084fc", borderRadius: "50%" }} />
                <span style={{ color: "#c084fc", fontSize: "0.875rem" }}>AI analyzing your resume...</span>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                <motion.div animate={{ y: dragging ? -8 : 0 }} transition={{ type: "spring", stiffness: 300 }}
                  style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Upload size={24} style={{ color: "#ff6b35" }} />
                </motion.div>
                <div className="text-center">
                  <div style={{ color: "#a8a8b3", fontSize: "0.95rem", fontWeight: 500 }}>
                    {uploaded ? "Resume uploaded ✓" : "Drop your resume here or click to browse"}
                  </div>
                  <div style={{ color: "#3a3a4a", fontSize: "0.8rem", marginTop: 4 }}>PDF only · Max 5MB</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {uploaded && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 16, padding: "1.25rem" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(74,222,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={18} style={{ color: "#4ade80" }} />
                </div>
                <div>
                  <div style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 500 }}>{fileName || "Resume.pdf"}</div>
                  <div style={{ color: "#4ade80", fontSize: "0.75rem" }}>✓ Analyzed successfully</div>
                </div>
              </div>
              {/* TODO: Connect delete/replace endpoint to remove file from storage */}
              <motion.button whileHover={{ color: "#fff" }} onClick={() => setUploaded(false)} style={{ background: "none", border: "none", color: "#5a5a6e", cursor: "pointer" }}>
                <X size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── AI PREFERENCES ────────────────────────────────────────────────────────────
function PreferencesPanel({ user }: { user: any }) {
  const [text, setText] = useState(user.preferences || "");
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(!user.preferences);
  const [keywords, setKeywords] = useState<string[]>(user.preferences_keywords || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user.preferences) {
      IntelliJobAPI.getResumeAnalysis().then((data) => {
        if (data.status === "completed") {
          const roles = data.suggested_roles?.slice(0, 2).join(" or ") || "Software Engineer";
          const skills = data.extracted_skills?.slice(0, 4).join(", ") || "my core technologies";
          setText(`I am looking for ${roles} positions. I am highly skilled in ${skills}. I prefer remote roles with good work-life balance, creative teams, and strong growth opportunities. Salary range $120k–$160k. I value culture over brand name.`);
        } else {
          setText("I want remote startup jobs with flexible timings, creative teams, good work-life balance, and strong growth opportunities. Salary range $120k–$160k. I value culture over brand name.");
        }
      }).catch(console.error);
    }
  }, [user.preferences]);

  const tagColors = [
    "#6b2d8b", "#c4541a", "#ff6b35", "#ff9d7a", "#8b1a1a", "#c084fc", "#4ade80"
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await IntelliJobAPI.updatePreferences(text);
      user.preferences = text;
      user.preferences_keywords = res.keywords || [];
      setKeywords(res.keywords || []);
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error("Failed to save preferences:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4" style={{ border: "1px solid rgba(192,132,252,0.3)", background: "rgba(192,132,252,0.06)", color: "#c084fc", letterSpacing: "0.1em" }}>
          <Wand2 size={11} /> AI PREFERENCE ENGINE
        </span>
        <div className="flex items-center justify-between">
          <div>
            <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.6rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6 }}>AI Preferences</h2>
            <p style={{ color: "#5a5a6e", fontSize: "0.9rem" }}>Write naturally. Tell the AI exactly what you want from your next role.</p>
          </div>
          {!isEditing && (
            <motion.button whileHover={{ borderColor: "rgba(192,132,252,0.5)", color: "#c084fc" }} onClick={() => setIsEditing(true)}
              style={{ background: "rgba(192,132,252,0.1)", border: "1px solid rgba(192,132,252,0.2)", color: "#a8a8b3", borderRadius: 8, padding: "6px 14px", fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}>
              Edit Preferences
            </motion.button>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.75rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "radial-gradient(circle, rgba(192,132,252,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="flex items-center gap-2 mb-4">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Sparkles size={14} style={{ color: "#c084fc" }} />
          </motion.div>
          <span style={{ color: "#c084fc", fontSize: "0.72rem", letterSpacing: "0.12em" }}>DESCRIBE YOUR IDEAL JOB NATURALLY</span>
        </div>
        
        {isEditing ? (
          <textarea value={text} onChange={(e) => { setText(e.target.value); setSaved(false); }} rows={6} placeholder="I want remote startup jobs with creative teams..."
            style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1rem", color: "#d4c4b0", fontSize: "0.95rem", lineHeight: 1.75, resize: "none", outline: "none", fontFamily: "'Inter', sans-serif", transition: "border-color 0.2s" }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(192,132,252,0.4)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
          />
        ) : (
          <div style={{ padding: "1rem", background: "rgba(192,132,252,0.02)", border: "1px solid rgba(192,132,252,0.1)", borderRadius: 12, color: "#d4c4b0", fontSize: "0.95rem", lineHeight: 1.75, fontFamily: "'Inter', sans-serif", whiteSpace: "pre-wrap" }}>
            {text}
          </div>
        )}
        
        <div className="mt-4">
          <div style={{ color: "#3a3a4a", fontSize: "0.7rem", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>AI EXTRACTED SIGNALS</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {keywords.length > 0 ? keywords.map((tag, i) => {
              const color = tagColors[i % tagColors.length];
              return (
                <motion.span key={tag} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                  whileHover={{ scale: 1.05 }} className="px-2.5 py-1 rounded-lg text-xs cursor-default"
                  style={{ background: `${color}12`, border: `1px solid ${color}30`, color: color }}>
                  ✦ {tag}
                </motion.span>
              );
            }) : (
              <span style={{ color: "#5a5a6e", fontSize: "0.8rem", fontStyle: "italic" }}>No signals extracted yet. Save preferences to analyze.</span>
            )}
          </div>
        </div>
        
        {isEditing && (
          <div className="flex items-center justify-between">
            <p style={{ color: "#3a3a4a", fontSize: "0.75rem" }}>{text.length} chars · AI updates matches on save</p>
            <motion.button whileHover={{ scale: 1.04, background: saved ? "#22c55e" : "#e8876a" }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
              style={{ background: saved ? "#22c55e" : "#ff6b35", color: "#fff", border: "none", borderRadius: 10, padding: "9px 22px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.3s", display: "flex", alignItems: "center", gap: "6px", opacity: saving ? 0.7 : 1 }}>
              {saved ? <><CheckCircle size={14} /> Saved</> : saving ? "Saving..." : "Save Preferences"}
            </motion.button>
          </div>
        )}
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: "Work Style", value: "Remote / Async", color: "#6b2d8b", icon: "🌐" },
          { label: "Company Type", value: "Startup / Scale-up", color: "#c4541a", icon: "🚀" },
          { label: "Salary Range", value: "$120k – $160k", color: "#ff9d7a", icon: "💰" },
          { label: "Culture Fit", value: "Creative, Growth-focused", color: "#c084fc", icon: "✨" },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `2px solid ${item.color}`, borderRadius: 12, padding: "1rem" }}>
            <div style={{ color: item.color, fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: 4 }}>{item.icon} {item.label}</div>
            <div style={{ color: "#a8a8b3", fontSize: "0.875rem", fontWeight: 500, fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── AI ANALYSIS ───────────────────────────────────────────────────────────────
function AnalysisPanel() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [gapData, setGapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: any;
    const fetchAnalysis = async () => {
      try {
        const data = await IntelliJobAPI.getResumeAnalysis();
        if (data.status === "completed") {
          setAnalysis(data);
          setLoading(false);
          if (interval) clearInterval(interval);
          
          // Fetch gap analysis once resume analysis is ready
          const gaps = await IntelliJobAPI.getGapAnalysis();
          if (gaps && gaps.missing_skills) {
            setGapData(gaps);
          }
        } else {
          // Keep polling if it's pending (i.e. currently analyzing)
          setLoading(true);
        }
      } catch (e) {
        console.error("Failed to fetch analysis:", e);
        setLoading(false);
        if (interval) clearInterval(interval);
      }
    };
    fetchAnalysis();
    // Poll every 3 seconds while analyzing
    interval = setInterval(fetchAnalysis, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: 44, height: 44, border: "2px solid rgba(192,132,252,0.2)", borderTopColor: "#c084fc", borderRadius: "50%" }} />
        <span style={{ color: "#c084fc", fontSize: "0.875rem", marginTop: 12 }}>Fetching AI Analysis...</span>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.6rem", fontFamily: "'Space Grotesk', sans-serif" }}>No Analysis Available</h2>
        <p style={{ color: "#5a5a6e", fontSize: "0.9rem", marginTop: 8 }}>Please upload a resume in the Upload Resume tab to see your AI insights.</p>
      </div>
    );
  }

  const skills = analysis.extracted_skills || [];
  const weakAreas = analysis.weak_areas || [];
  const roles = analysis.suggested_roles || [];
  const metrics = [
    { label: "ATS Score", value: analysis.ats_score, color: "#4ade80" },
    { label: "Skills Match", value: analysis.skills_match, color: "#ff9d7a" },
    { label: "Experience Level", value: analysis.experience_level, color: "#c084fc" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.6rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6 }}>AI Analysis</h2>
        <p style={{ color: "#5a5a6e", fontSize: "0.9rem" }}>Deep insights extracted from your uploaded resume.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.5rem" }}>
          <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1.25rem" }}>Score Breakdown</h3>
          <div className="space-y-5">
            {metrics.map((m, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span style={{ color: "#a8a8b3", fontSize: "0.8rem" }}>{m.label}</span>
                  <span style={{ color: m.color, fontSize: "0.85rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{m.value}%</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                    style={{ height: "100%", background: m.color, borderRadius: 8 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.5rem" }}>
          <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1.25rem" }}>Suggested Roles</h3>
          <div className="space-y-2">
            {roles.map((role, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ x: 4 }}
                className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-2">
                  <Star size={12} style={{ color: "#ff9d7a" }} />
                  <span style={{ color: "#a8a8b3", fontSize: "0.85rem" }}>{role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.5rem" }}>
        <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1rem" }}>Extracted Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, i: number) => (
            <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", color: "#4ade80" }}>
              {skill}
            </motion.span>
          ))}
          {weakAreas.map((area: string, i: number) => (
            <motion.span key={area} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.05 }}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ background: "rgba(139,26,26,0.1)", border: "1px solid rgba(139,26,26,0.25)", color: "#f87171" }}>
              {area}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {gapData && gapData.missing_skills && gapData.missing_skills.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ background: "rgba(220,38,38,0.03)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 20, padding: "1.5rem" }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} style={{ color: "#ef4444" }} />
            <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif" }}>Skill Gaps & Demands</h3>
          </div>
          <p style={{ color: "#a8a8b3", fontSize: "0.85rem", marginBottom: "1rem" }}>
            The AI detected that you are requesting jobs requiring the following skills, but they are missing from your uploaded resume. Consider adding them to improve your matches:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {gapData.missing_skills.map((skill: string, i: number) => (
              <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#fca5a5" }}>
                {skill}
              </span>
            ))}
          </div>
          {gapData.suggestions && gapData.suggestions.length > 0 && (
            <div className="space-y-2 mt-4" style={{ borderTop: "1px solid rgba(220,38,38,0.1)", paddingTop: "1rem" }}>
              <div style={{ color: "#fca5a5", fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: 8 }}>AI SUGGESTIONS</div>
              {gapData.suggestions.map((suggestion: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#ef4444", marginTop: 8, flexShrink: 0 }} />
                  <span style={{ color: "#a8a8b3", fontSize: "0.8rem", lineHeight: 1.5 }}>{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── APPROVED JOB MATCHES (with inline Interview Prep) ────────────────────────

function ApprovedJobsPanel() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("technical");
  const [prepData, setPrepData] = useState<Record<number, any>>({});
  const [loadingPrep, setLoadingPrep] = useState<Record<number, boolean>>({});

  const [jobs, setJobs] = useState<any[]>([]);

  const toggleCard = async (i: number, jobId: number) => {
    if (expandedCard === i) {
      setExpandedCard(null);
      return;
    }
    setExpandedCard(i);
    setExpandedSection("technical");
    
    if (!prepData[jobId]) {
      setLoadingPrep(prev => ({ ...prev, [jobId]: true }));
      try {
        const data = await IntelliJobAPI.getInterviewQuestions(jobId);
        setPrepData(prev => ({ ...prev, [jobId]: data }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPrep(prev => ({ ...prev, [jobId]: false }));
      }
    }
  };


  useEffect(() => {
    async function fetchJobsData() {
      try {
        const data = await IntelliJobAPI.getJobs();
        const mapped = data.jobs.map((job: any, index: number) => {
          const colors = ["#6b2d8b", "#ff6b35", "#c4541a", "#8b1a1a"];
          return {
            role: job.title,
            company: job.company,
            salary: job.salary_range || "Salary undisclosed",
            match: 95, // AI Score placeholder
            location: job.location || "Remote",
            status: "Ready to Apply",
            color: colors[index % colors.length],
            appliedAt: null,
            id: job.id
          };
        });
        setJobs(mapped);
      } catch (e) {
        console.error("Failed to fetch applications:", e);
      }
    }
    fetchJobsData();
  }, []);

  const statusConfig: Record<string, { color: string; bg: string }> = {
    "Ready to Apply": { color: "#ff6b35", bg: "rgba(255,107,53,0.1)" },
    "Applied": { color: "#ff9d7a", bg: "rgba(255,157,122,0.08)" },
    "Interview Scheduled": { color: "#4ade80", bg: "rgba(74,222,128,0.08)" },
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.6rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6 }}>Approved Matches</h2>
            <p style={{ color: "#5a5a6e", fontSize: "0.9rem" }}>
              Jobs you approved from email alerts — AI has already tailored your resume for each.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", color: "#ff9d7a", whiteSpace: "nowrap" }}>
            4 active
          </div>
        </div>
        {/* Workflow context */}
        <div className="flex items-center gap-2 mt-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <AlertCircle size={12} style={{ color: "#5a5a6e", flexShrink: 0 }} />
          <p style={{ color: "#3a3a4a", fontSize: "0.75rem", lineHeight: 1.5 }}>
            These jobs were sent to your email first. You approved them → they appear here with AI prep materials attached.
          </p>
        </div>
      </motion.div>

      <div className="space-y-4">
        {jobs.map((job, i) => {
          const prep = prepData[job.id];
          const isLoading = loadingPrep[job.id];
          const isOpen = expandedCard === i;
          const sc = statusConfig[job.status];

          const prepSections = [
            { id: "technical", label: "Technical Questions", count: prep?.technical?.length || 0, color: "#ff6b35" },
            { id: "hr", label: "HR Questions", count: prep?.hr?.length || 0, color: "#c084fc" },
            { id: "behavioral", label: "Behavioral", count: prep?.behavioral?.length || 0, color: "#ff9d7a" },
            { id: "tips", label: "Company Tips", count: prep?.tips?.length || 0, color: "#4ade80" },
            { id: "skills", label: "Skills to Revise", count: prep?.skills?.length || 0, color: "#ff6b35" },
          ];

          const sectionData: Record<string, string[]> = {
            technical: prep?.technical || [], hr: prep?.hr || [],
            behavioral: prep?.behavioral || [], tips: prep?.tips || [], skills: prep?.skills || [],
          };

          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{
                background: "rgba(255,255,255,0.03)",
                borderTop: `2px solid ${job.color}`,
                borderRight: "1px solid rgba(255,255,255,0.07)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                borderLeft: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, overflow: "hidden",
                boxShadow: isOpen ? `0 20px 50px rgba(0,0,0,0.4)` : "none",
                transition: "box-shadow 0.3s",
              }}>
              {/* Card header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${job.color}15`, border: `1px solid ${job.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Zap size={16} style={{ color: job.color }} />
                    </div>
                    <div>
                      <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif" }}>{job.role}</h3>
                      <div style={{ color: "#5a5a6e", fontSize: "0.78rem" }}>{job.company} · {job.salary} · {job.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.4rem", fontWeight: 700, color: job.match > 94 ? "#4ade80" : "#ff9d7a", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{job.match}%</div>
                      <div style={{ color: "#3a3a4a", fontSize: "0.65rem" }}>match</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Status badge */}
                    <span className="px-2.5 py-1 rounded-lg text-xs" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}>
                      {job.status}
                    </span>
                    {job.appliedAt && <span style={{ color: "#3a3a4a", fontSize: "0.7rem" }}>Applied {job.appliedAt}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* TODO: POST /api/apply?job_id to trigger Playwright auto-apply */}
                    {job.status === "Ready to Apply" && (
                      <motion.button whileHover={{ background: job.color, color: "#fff" }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                        style={{ background: `${job.color}12`, border: `1px solid ${job.color}25`, color: job.color, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif" }}>
                        <Zap size={11} /> Auto Apply
                      </motion.button>
                    )}
                    {/* Inline Interview Prep toggle */}
                    <motion.button whileHover={{ borderColor: "rgba(192,132,252,0.4)", color: "#c084fc" }} whileTap={{ scale: 0.96 }}
                      onClick={() => toggleCard(i, job.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                      style={{ background: isOpen ? "rgba(192,132,252,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${isOpen ? "rgba(192,132,252,0.3)" : "rgba(255,255,255,0.07)"}`, color: isOpen ? "#c084fc" : "#5a5a6e", cursor: "pointer", transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif" }}>
                      <GraduationCap size={11} />
                      Interview Prep
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} style={{ display: "inline-flex" }}>
                        <ChevronDown size={10} />
                      </motion.span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Inline Interview Prep — expandable */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: "hidden" }}>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      {/* Prep header */}
                      <div className="flex items-center gap-3 px-5 py-3" style={{ background: "rgba(192,132,252,0.04)" }}>
                        <GraduationCap size={14} style={{ color: "#c084fc" }} />
                        <span style={{ color: "#c084fc", fontSize: "0.78rem", letterSpacing: "0.08em" }}>AI INTERVIEW PREPARATION — {job.role} @ {job.company}</span>
                      </div>
                      {isLoading ? (
                        <div className="flex justify-center p-8">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{ width: 24, height: 24, border: "2px solid rgba(192,132,252,0.2)", borderTopColor: "#c084fc", borderRadius: "50%" }} />
                        </div>
                      ) : (
                        prepSections.map((section) => (
                        <div key={section.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                          <motion.button whileHover={{ background: "rgba(255,255,255,0.02)" }}
                            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                            className="w-full flex items-center justify-between px-5 py-3.5"
                            style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <div className="flex items-center gap-3">
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: section.color }} />
                              <span style={{ color: "#a8a8b3", fontSize: "0.83rem", fontWeight: 500, fontFamily: "'Space Grotesk', sans-serif" }}>{section.label}</span>
                              <span className="px-2 py-0.5 rounded text-xs" style={{ background: `${section.color}15`, color: section.color, border: `1px solid ${section.color}25` }}>{section.count}</span>
                            </div>
                            <motion.div animate={{ rotate: expandedSection === section.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronDown size={13} style={{ color: "#3a3a4a" }} />
                            </motion.div>
                          </motion.button>
                          <AnimatePresence>
                            {expandedSection === section.id && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                                <div style={{ padding: "0 1.5rem 1rem" }}>
                                  {section.id === "skills" ? (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                      {sectionData[section.id].map((item, idx) => (
                                        <motion.span key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                                          className="px-3 py-1 rounded-lg text-xs"
                                          style={{ background: `${section.color}10`, border: `1px solid ${section.color}25`, color: section.color }}>
                                          {item}
                                        </motion.span>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="space-y-2 pt-1">
                                      {sectionData[section.id].map((item, idx) => (
                                        <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}
                                          className="flex items-start gap-3 p-2.5 rounded-xl"
                                          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: section.color, marginTop: 6, flexShrink: 0 }} />
                                          <span style={{ color: "#a8a8b3", fontSize: "0.82rem", lineHeight: 1.6 }}>{item}</span>
                                        </motion.div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PERSONALIZED RESUMES ──────────────────────────────────────────────────────
function PersonalizedResumesPanel() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    IntelliJobAPI.getTailoredResumes()
      .then((data) => {
        const colors = ["#6b2d8b", "#ff6b35", "#c4541a", "#8b1a1a"];
        const mapped = data.resumes.map((r: any, idx: number) => ({
          ...r,
          color: colors[idx % colors.length]
        }));
        setResumes(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "#fff", padding: 20 }}>Loading resumes...</div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4" style={{ border: "1px solid rgba(74,222,128,0.25)", background: "rgba(74,222,128,0.05)", color: "#4ade80", letterSpacing: "0.1em" }}>
          <FileCheck size={11} /> AI-PERSONALIZED RESUMES
        </span>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.6rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6 }}>My Resumes</h2>
        <p style={{ color: "#5a5a6e", fontSize: "0.9rem" }}>AI-tailored resumes generated for each approved role.</p>
      </motion.div>
      <div className="space-y-4">
        {resumes.length === 0 && <div style={{ color: "#5a5a6e", padding: 20 }}>No tailored resumes yet. Approve a job match to generate one.</div>}
        {resumes.map((resume, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -2 }}
            style={{ background: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${resume.color}`, borderTop: "1px solid rgba(255,255,255,0.07)", borderRight: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", transition: "all 0.3s" }}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${resume.color}15`, border: `1px solid ${resume.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileCheck size={18} style={{ color: resume.color }} />
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif" }}>Resume for {resume.job_title}</div>
                    <div style={{ color: "#5a5a6e", fontSize: "0.78rem" }}>@ {resume.company}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
                  <span style={{ color: "#4ade80", fontSize: "0.7rem" }}>Ready</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5" style={{ color: "#3a3a4a", fontSize: "0.72rem" }}>
                  <Clock size={11} />{resume.created_at}
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ background: resume.color, color: "#fff" }}
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(`http://localhost:8000/api/resumes/${resume.id}/pdf`, {
                          headers: { "Authorization": `Bearer ${token}` }
                        });
                        if (!res.ok) throw new Error("Failed to download");
                        const blob = await res.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `tailored_resume_${resume.id}.pdf`;
                        a.click();
                      } catch (e) {
                        console.error(e);
                        alert("Failed to download PDF");
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: `${resume.color}15`, border: `1px solid ${resume.color}30`, color: resume.color, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif" }}>
                    <Download size={12} /> Download PDF
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── ALERTS ────────────────────────────────────────────────────────────────────
function AlertsPanel() {
  const [frequency, setFrequency] = useState("Every 3 days");
  const [active, setActive] = useState(true);
  const freqOptions = ["Daily", "Every 2 days", "Every 3 days", "Weekly"];
  // TODO: Fetch notification history from GET /api/notifications
  const history = [
    { date: "Today, 9:00 AM", text: "3 matches sent — Product Designer at Arc, ML Engineer at Vercel..." },
    { date: "May 5, 9:00 AM", text: "5 matches sent — Design Engineer at Linear, UX Lead at Figma..." },
    { date: "May 2, 9:00 AM", text: "4 matches sent — Creative Technologist at Adobe..." },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.6rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6 }}>Email Alerts</h2>
        <p style={{ color: "#5a5a6e", fontSize: "0.9rem" }}>AI curates matches and sends them to your inbox. You approve → they appear in dashboard.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.5rem" }}>
          <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1.25rem" }}>Alert Settings</h3>
          {/* TODO: POST /api/notifications preferences to backend */}
          {[{ label: "Email", value: "alex@example.com" }, { label: "Send Time", value: "9:00 AM" }, { label: "Jobs per Email", value: "5 jobs" }].map((field, i) => (
            <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ color: "#5a5a6e", fontSize: "0.85rem" }}>{field.label}</span>
              <span style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#a8a8b3", fontSize: "0.8rem", padding: "4px 10px", borderRadius: 8 }}>{field.value}</span>
            </div>
          ))}
          <div className="py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ color: "#5a5a6e", fontSize: "0.85rem", display: "block", marginBottom: 8 }}>Frequency</span>
            <div className="flex flex-wrap gap-2">
              {freqOptions.map((opt) => (
                <motion.button key={opt} whileTap={{ scale: 0.95 }} onClick={() => setFrequency(opt)}
                  style={{ background: frequency === opt ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${frequency === opt ? "rgba(255,107,53,0.4)" : "rgba(255,255,255,0.06)"}`, color: frequency === opt ? "#ff6b35" : "#5a5a6e", borderRadius: 8, padding: "6px 12px", fontSize: "0.75rem", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s" }}>
                  {opt}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span style={{ color: "#5a5a6e", fontSize: "0.85rem" }}>Automation</span>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setActive(!active)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: active ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${active ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.08)"}`, cursor: "pointer", transition: "all 0.3s" }}>
              <motion.div animate={{ scale: active ? [1, 1.3, 1] : 1 }} transition={{ duration: 2, repeat: active ? Infinity : 0 }}
                style={{ width: 8, height: 8, borderRadius: "50%", background: active ? "#4ade80" : "#3a3a4a", transition: "background 0.3s" }} />
              <span style={{ color: active ? "#4ade80" : "#5a5a6e", fontSize: "0.8rem", fontFamily: "'Space Grotesk', sans-serif" }}>{active ? "Running" : "Paused"}</span>
            </motion.button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.5rem" }}>
          <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1.25rem" }}>Alert History</h3>
          <div className="space-y-4">
            {history.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff9d7a", flexShrink: 0, marginTop: 4 }} />
                  {i < history.length - 1 && <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.05)", marginTop: 4 }} />}
                </div>
                <div style={{ paddingBottom: "1rem" }}>
                  <div style={{ color: "#3a3a4a", fontSize: "0.7rem", marginBottom: 3 }}>{item.date}</div>
                  <div style={{ color: "#a8a8b3", fontSize: "0.8rem", lineHeight: 1.5 }}>{item.text}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── SETTINGS ──────────────────────────────────────────────────────────────────
function SettingsPanel() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);

  // TODO: POST user notification preferences to backend
  // TODO: Add account settings (change email, password, delete account)

  const Toggle = ({ on, onToggle, color = "#4ade80" }: { on: boolean; onToggle: () => void; color?: string }) => (
    <motion.button whileTap={{ scale: 0.95 }} onClick={onToggle}
      style={{ width: 40, height: 22, borderRadius: 11, background: on ? `${color}30` : "rgba(255,255,255,0.06)", border: `1px solid ${on ? `${color}50` : "rgba(255,255,255,0.1)"}`, cursor: "pointer", transition: "all 0.3s", position: "relative" as const, display: "flex", alignItems: "center", padding: "0 3px" }}>
      <motion.div animate={{ x: on ? 18 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ width: 14, height: 14, borderRadius: "50%", background: on ? color : "#3a3a4a" }} />
    </motion.button>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.6rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 6 }}>Settings</h2>
        <p style={{ color: "#5a5a6e", fontSize: "0.9rem" }}>Notification preferences and account configuration.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.5rem" }}>
        <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1.25rem" }}>Notifications</h3>
        {[
          { label: "Email Notifications", desc: "Receive job alerts and updates via email", on: emailNotif, toggle: () => setEmailNotif(!emailNotif) },
          { label: "Weekly Digest", desc: "Summary of top matches every week", on: weeklyDigest, toggle: () => setWeeklyDigest(!weeklyDigest) },
          { label: "High-Match Alerts (>90%)", desc: "Instant notification for top-tier matches", on: matchAlerts, toggle: () => setMatchAlerts(!matchAlerts) },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-3.5" style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <div>
              <div style={{ color: "#a8a8b3", fontSize: "0.875rem", fontWeight: 500, fontFamily: "'Space Grotesk', sans-serif" }}>{item.label}</div>
              <div style={{ color: "#3a3a4a", fontSize: "0.75rem", marginTop: 2 }}>{item.desc}</div>
            </div>
            <Toggle on={item.on} onToggle={item.toggle} />
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.5rem" }}>
        <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1.25rem" }}>Recommendation Settings</h3>
        {[
          { label: "Recommendations per Alert", value: "5 jobs" },
          { label: "Minimum Match Score", value: "75%" },
          { label: "Alert Send Time", value: "9:00 AM" },
          { label: "Frequency", value: "Every 3 days" },
        ].map((field, i) => (
          <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <span style={{ color: "#5a5a6e", fontSize: "0.85rem" }}>{field.label}</span>
            <span style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#a8a8b3", fontSize: "0.8rem", padding: "4px 10px", borderRadius: 8 }}>{field.value}</span>
          </div>
        ))}
      </motion.div>

      {/* Theme placeholder */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "1.5rem" }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif" }}>Theme & Appearance</h3>
            <p style={{ color: "#3a3a4a", fontSize: "0.78rem", marginTop: 3 }}>Dark mode only — more themes coming soon</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs" style={{ background: "rgba(107,45,139,0.15)", border: "1px solid rgba(107,45,139,0.3)", color: "#c084fc" }}>Soon</span>
        </div>
      </motion.div>

      {/* Developer Integration Placeholder */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 20, padding: "1.5rem" }}>
        <div className="flex items-center gap-2 mb-3">
          <Cpu size={14} style={{ color: "#3a3a4a" }} />
          <span style={{ color: "#3a3a4a", fontSize: "0.7rem", letterSpacing: "0.12em" }}>DEVELOPER INTEGRATION GUIDE</span>
        </div>
        {/* UPLOAD BACKEND INTEGRATION GUIDE HERE */}
        {/* TODO: Render uploaded backend guide document / API config here */}
        <p style={{ color: "#2a2a3a", fontSize: "0.8rem", lineHeight: 1.6 }}>
          Backend integration guide placeholder. Upload your integration documentation here to connect:
          Greenhouse API · Lever API · Gmail API · Telegram Notifications · LangGraph Orchestration · Browser Automation Workflows
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Greenhouse", "Lever", "Gmail", "Telegram", "LangGraph", "Playwright"].map((api) => (
            <span key={api} className="px-2 py-1 rounded text-xs" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "#2a2a3a" }}>
              {api}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function JobApprovalModal({ jobId, onClose, onApprove }: { jobId: number; onClose: () => void; onApprove: () => void }) {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    IntelliJobAPI.getJobDetails(jobId).then((data) => {
      setJob(data);
      setLoading(false);
    }).catch(console.error);
  }, [jobId]);

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ width: 44, height: 44, border: "2px solid rgba(192,132,252,0.2)", borderTopColor: "#c084fc", borderRadius: "50%" }} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ background: "rgba(20,20,25,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, width: "100%", maxWidth: 600, overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
        
        <div className="p-6 pb-4 border-b border-white/5 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} style={{ color: "#c084fc" }} />
              <span style={{ color: "#c084fc", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>New AI Match</span>
            </div>
            <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.4rem", fontFamily: "'Space Grotesk', sans-serif" }}>{job.title}</h2>
            <div style={{ color: "#a8a8b3", fontSize: "0.9rem", marginTop: 4 }}>{job.company} · {job.location} · {job.salary_range || "Salary undisclosed"}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#5a5a6e", cursor: "pointer" }}><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ color: "#d4c4b0", fontSize: "0.9rem", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "'Inter', sans-serif" }}>
          {job.description}
        </div>

        <div className="p-6 pt-4 border-t border-white/5 flex gap-3 justify-end bg-black/20">
          <button onClick={onClose} style={{ background: "transparent", color: "#a8a8b3", border: "none", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontSize: "0.9rem", fontWeight: 500 }}>Decline</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={approving}
            onClick={async () => {
              setApproving(true);
              try {
                await IntelliJobAPI.approveJob(jobId);
                onApprove();
              } catch (e) {
                console.error(e);
              } finally {
                setApproving(false);
              }
            }}
            style={{ background: "#c084fc", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 10, cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, display: "flex", gap: "8px", alignItems: "center", opacity: approving ? 0.7 : 1 }}>
            {approving ? "Generating Tailored Resume..." : "Approve & Generate Resume"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── MAIN DASHBOARD EXPORT ─────────────────────────────────────────────────────
export function Dashboard() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState("dashboard");
  const [user, setUser] = useState<any>(null);
  const [approvalJobId, setApprovalJobId] = useState<number | null>(null);

  useEffect(() => {
    IntelliJobAPI.getUser()
      .then(setUser)
      .catch((e) => {
        console.error(e);
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "approve" && params.get("job_id")) {
      setApprovalJobId(Number(params.get("job_id")));
    }
  }, []);

  if (!user) {
    return <div className="h-screen w-screen flex items-center justify-center text-white" style={{ background: "#080808" }}>Loading...</div>;
  }

  const staticPanels: Record<string, ReactNode> = {
    resume: <ResumePanel />,
    preferences: <PreferencesPanel user={user} />,
    analysis: <AnalysisPanel />,
    approved: <ApprovedJobsPanel />,
    resumes: <PersonalizedResumesPanel />,
    alerts: <AlertsPanel />,
    settings: <SettingsPanel />,
    profile: <UserOverviewPanel user={user} />,
  };

  const renderPanel = () => {
    if (activePanel === "dashboard") return <DashboardHome setActive={setActivePanel} user={user} />;
    return staticPanels[activePanel] ?? <DashboardHome setActive={setActivePanel} user={user} />;
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: "#080808", fontFamily: "'Space Grotesk', sans-serif" }}>
      <div className="pointer-events-none fixed inset-0 z-40" style={{ backgroundImage: GRAIN_SVG, backgroundSize: "200px 200px" }} />
      <div className="pointer-events-none fixed" style={{ width: 500, height: 500, top: -100, left: -100, background: "radial-gradient(circle, rgba(107,45,139,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <Sidebar active={activePanel} setActive={setActivePanel} user={user} />

      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-5xl mx-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderPanel()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <AnimatePresence>
        {approvalJobId && (
          <JobApprovalModal 
            jobId={approvalJobId} 
            onClose={() => {
              setApprovalJobId(null);
              navigate("/dashboard", { replace: true });
            }}
            onApprove={() => {
              setApprovalJobId(null);
              setActivePanel("approved");
              navigate("/dashboard", { replace: true });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
