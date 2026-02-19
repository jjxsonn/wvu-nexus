"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Search, ChevronRight, BookOpen, Calendar, Bus, Shirt,
  CreditCard, GraduationCap, UtensilsCrossed, Shield, Ticket,
  MessageCircle, Heart, ArrowRight, CheckCircle2, Lock, Sparkles,
  ChevronLeft, ChevronDown, X, Zap, TrendingUp, Users, BarChart2,
  Brain, Layers, Server, Globe, ArrowUpRight, Play, Presentation,
  AlertTriangle, CheckCheck, DollarSign, Map, Star, Cpu, Database,
  Fingerprint, Eye, Building2, GraduationCap as GradCap
} from "lucide-react";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(0,40,85,0.2); border-radius: 4px; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; }
`;

// ─── Shared Data ──────────────────────────────────────────────────────────────
const ASSIGNMENTS = [
  { id: 1, course: "CS 445", color: "#3b6fd4", title: "Distributed Systems Lab", due: "Feb 21", daysLeft: 2, difficulty: "Hard", grade: 78, weight: 20, emoji: "💻" },
  { id: 2, course: "MKTG 301", color: "#e8973a", title: "Brand Strategy Deck", due: "Feb 24", daysLeft: 5, difficulty: "Medium", grade: 88, weight: 15, emoji: "📊" },
  { id: 3, course: "STAT 215", color: "#6b5dd3", title: "Regression Analysis", due: "Feb 26", daysLeft: 7, difficulty: "Medium", grade: 82, weight: 25, emoji: "📈" },
  { id: 4, course: "ENGL 102", color: "#3aab6e", title: "Rhetorical Analysis Essay", due: "Mar 2", daysLeft: 11, difficulty: "Easy", grade: 91, weight: 10, emoji: "✍️" },
];
const PULSE_POSTS = [
  { id: 1, area: "Evansdale Library", text: "3rd floor pods are totally open right now 🙌", mood: "positive", upvotes: 34, time: "4m ago" },
  { id: 2, area: "Mountainlair", text: "Chick-fil-A line is wrapping around the whole food court", mood: "negative", upvotes: 67, time: "11m ago" },
  { id: 3, area: "PRT Station", text: "PRT actually on time today?? Never thought I'd see the day 😂", mood: "positive", upvotes: 89, time: "22m ago" },
  { id: 4, area: "Rec Center", text: "Squat rack wait ~45 min, way better after 8pm", mood: "neutral", upvotes: 22, time: "31m ago" },
];
const QUICK_ACTIONS = [
  { label: "PRT Status", icon: Bus, color: "#1a6bc4", bg: "#e8f0fb", status: "On Time" },
  { label: "Laundry", icon: Shirt, color: "#2d9e6b", bg: "#e6f7ef", status: "2 Open" },
  { label: "GET Mobile", icon: CreditCard, color: "#e8973a", bg: "#fef3e7", status: "$42.50" },
  { label: "DegreeWorks", icon: GraduationCap, color: "#6b5dd3", bg: "#f0eeff", status: "92%" },
  { label: "STAR / Banner", icon: BookOpen, color: "#d43b6f", bg: "#fce8f0", status: "Enrolled" },
  { label: "Schedule", icon: Calendar, color: "#0ea5a0", bg: "#e6f7f7", status: "Build" },
  { label: "Grubhub", icon: UtensilsCrossed, color: "#d43b3b", bg: "#fce8e8", status: "20 min" },
  { label: "LiveSafe", icon: Shield, color: "#1a6bc4", bg: "#e8f0fb", status: "Active" },
  { label: "WVU Tickets", icon: Ticket, color: "#c49a1a", bg: "#fdf6e3", status: "2 Tix" },
];
const CAMPUS_STATUS = [
  { label: "PRT", value: "Running", ok: true },
  { label: "Mountainlair", value: "65% full", ok: true },
  { label: "Rec Center", value: "Busy", ok: false },
  { label: "Library", value: "42% full", ok: true },
];
const difficultyStyle = {
  Hard: { bg: "#fce8e8", text: "#d43b3b" },
  Medium: { bg: "#fef3e7", text: "#c47a1a" },
  Easy: { bg: "#e6f7ef", text: "#2d9e6b" },
};

// ─── Slide Data ───────────────────────────────────────────────────────────────
const SLIDES = [
  { id: 0, tag: "The Problem", title: "15 Apps.\nZero Clarity." },
  { id: 1, tag: "The Solution", title: "One OS.\nEvery Need." },
  { id: 2, tag: "Live Demo", title: "See It\nIn Action." },
  { id: 3, tag: "Campus Pulse", title: "Feel the\nCampus Heartbeat." },
  { id: 4, tag: "Technical Architecture", title: "Built to\nLast & Scale." },
  { id: 5, tag: "Business Case & ROI", title: "The Numbers\nSpeak." },
  { id: 6, tag: "Implementation Roadmap", title: "3 Phases.\n18 Months." },
  { id: 7, tag: "Why Nexus Wins", title: "The Only\nChoice." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Card({ children, className = "", style = {} }) {
  return (
    <div className={`rounded-3xl bg-white shadow-sm border border-slate-100 ${className}`} style={style}>
      {children}
    </div>
  );
}

function NudgeBanner({ assignment, onDismiss }) {
  return (
    <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", width: "92%", maxWidth: 480, zIndex: 9999 }}>
      <div style={{ borderRadius: 20, padding: 16, display: "flex", alignItems: "flex-start", gap: 12, background: "linear-gradient(135deg, #002855, #1a4a8a)", boxShadow: "0 20px 60px rgba(0,40,85,0.35)" }}>
        <span style={{ fontSize: 24 }}>🧠</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#EAAA00", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>Study Nudge</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{assignment.course}: <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.8)" }}>{assignment.title}</span></p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Due in {assignment.daysLeft} days · {assignment.difficulty} · Worth {assignment.weight}%</p>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button style={{ padding: "7px 16px", borderRadius: 12, border: "none", cursor: "pointer", background: "#EAAA00", color: "#002855", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>Start Studying</button>
            <button onClick={onDismiss} style={{ padding: "7px 16px", borderRadius: 12, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>Later</button>
          </div>
        </div>
        <button onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 20, lineHeight: 1 }}>×</button>
      </div>
    </motion.div>
  );
}

// ─── SLIDE CONTENTS ───────────────────────────────────────────────────────────
function SlideContent({ slideId, onEnterApp }) {
  const baseText = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

  if (slideId === 0) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {["Blackboard/eCampus", "STAR / Banner", "DegreeWorks", "PRT Tracker", "Speedqueen Laundry", "GETMobile", "WVU Navigate", "Grubhub", "LiveSafe", "Duo 2FA", "Office365", "WVU Tickets", "Rec Center App", "WVU Alert", "Campus Maps"].map((app, i) => (
          <motion.div key={app} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
            style={{ padding: "8px 12px", borderRadius: 12, background: i < 2 ? "rgba(234,170,0,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${i < 2 ? "rgba(234,170,0,0.3)" : "rgba(255,255,255,0.1)"}`, fontSize: 12, color: i < 2 ? "#EAAA00" : "rgba(255,255,255,0.7)", fontWeight: i < 2 ? 700 : 500, ...baseText }}>
            {app}
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{ padding: 16, borderRadius: 16, background: "rgba(234,170,0,0.1)", border: "1px solid rgba(234,170,0,0.25)" }}>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, ...baseText }}>
          The average WVU student switches between <strong style={{ color: "#EAAA00" }}>15+ separate apps</strong> per week. Each requires a separate login. None talk to each other. The result? <strong style={{ color: "#EAAA00" }}>App fatigue, missed deadlines, and unnecessary stress.</strong>
        </p>
      </motion.div>
    </div>
  );

  if (slideId === 1) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      {[
        { icon: "🎯", title: "Proactive Academic Agent", desc: "AI that nudges you 48hrs before hard deadlines — not just a calendar", color: "#3b6fd4" },
        { icon: "💬", title: "Campus Pulse (Anonymous)", desc: "Geo-fenced social layer with NLP sentiment scoring for leadership", color: "#2d9e6b" },
        { icon: "📡", title: "IoT Resource Integration", desc: "Live occupancy for study rooms, gym equipment, dining wait times", color: "#e8973a" },
        { icon: "🔐", title: "Zero-Knowledge Security", desc: "Anonymous posts with cryptographic tokens — FERPA-compliant by design", color: "#6b5dd3" },
      ].map((item, i) => (
        <motion.div key={item.title} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
          style={{ display: "flex", gap: 14, padding: 14, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3, ...baseText }}>{item.title}</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, ...baseText }}>{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (slideId === 2) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", alignItems: "center" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        style={{ width: "100%", padding: 24, borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📱</div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6, ...baseText }}>The live app is embedded in this page.</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 20, ...baseText }}>
          Click below to exit the presentation and interact with the full WVU Nexus prototype — Academic Roadmap, Campus Pulse, unified app grid and all.
        </p>
        <button onClick={onEnterApp}
          style={{ padding: "14px 32px", borderRadius: 16, border: "none", cursor: "pointer", background: "#EAAA00", color: "#002855", fontSize: 15, fontWeight: 800, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Play size={16} /> Enter the Live Demo
        </button>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, width: "100%" }}>
        {["Academic Roadmap", "Campus Pulse Feed", "Unified App Grid", "Study Nudges", "Sentiment Engine", "SSO Bridge"].map((f, i) => (
          <div key={f} style={{ padding: "8px 10px", borderRadius: 12, background: "rgba(234,170,0,0.1)", border: "1px solid rgba(234,170,0,0.2)", fontSize: 11, fontWeight: 600, color: "#EAAA00", textAlign: "center", ...baseText }}>✓ {f}</div>
        ))}
      </motion.div>
    </div>
  );

  if (slideId === 3) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[{ area: "Evansdale Library", score: 81, mood: "😊", trend: "+12%" }, { area: "Mountainlair", score: 44, mood: "😤", trend: "-8%" }, { area: "PRT Station", score: 76, mood: "😊", trend: "+5%" }, { area: "Rec Center", score: 58, mood: "😐", trend: "—" }].map((a, i) => (
          <motion.div key={a.area} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ padding: 14, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>{a.mood}</span>
              <span style={{ fontSize: 11, color: a.trend.startsWith("+") ? "#3aab6e" : a.trend.startsWith("-") ? "#d43b3b" : "#9ba3b5", fontWeight: 700, ...baseText }}>{a.trend}</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1, ...baseText }}>{a.score}<span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>/100</span></p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4, ...baseText }}>{a.area}</p>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ padding: 14, borderRadius: 16, background: "rgba(234,170,0,0.08)", border: "1px solid rgba(234,170,0,0.2)" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#EAAA00", marginBottom: 6, ...baseText }}>📊 What leadership sees in real time:</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, ...baseText }}>
          NLP aggregates anonymous posts into a live <strong style={{ color: "#fff" }}>Sentiment Dashboard</strong> — replacing lagging survey data with <strong style={{ color: "#fff" }}>continuous, quantitative student voice signals.</strong>
        </p>
      </motion.div>
    </div>
  );

  if (slideId === 4) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      {[
        { layer: "Integration Layer", icon: "🔌", tech: "API Orchestration → Blackboard, Banner (STAR), Gmail, IoT sensors", color: "#3b6fd4" },
        { layer: "AI Intelligence", icon: "🧠", tech: "LLM for tutoring nudges · NLP sentiment classification on Pulse feed", color: "#6b5dd3" },
        { layer: "Security Framework", icon: "🔐", tech: "Zero-Knowledge Proofs (ZKP) · Anonymous tokens · FERPA compliance", color: "#2d9e6b" },
        { layer: "Hosting & Scale", icon: "☁️", tech: "Cloud-native AWS/Azure · Designed for 30,000+ concurrent users", color: "#e8973a" },
        { layer: "Frontend", icon: "📱", tech: "React / Next.js · Mobile-first PWA · Single SSO session across all services", color: "#d43b6f" },
      ].map((item, i) => (
        <motion.div key={item.layer} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.09 }}
          style={{ display: "flex", gap: 12, padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 2, ...baseText }}>{item.layer}</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, ...baseText }}>{item.tech}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (slideId === 5) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { metric: "~$7,000", label: "Annual cost per dropout", sub: "WVU retains ~800 at-risk students/yr", color: "#EAAA00" },
          { metric: "30,000+", label: "Target users at launch", sub: "Full WVU student body Day 1", color: "#3b6fd4" },
          { metric: "47%", label: "Students miss deadlines", sub: "due to fragmented notifications", color: "#d43b3b" },
          { metric: "18 mo", label: "Full deployment timeline", sub: "3 phases, no new hardware needed", color: "#2d9e6b" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            style={{ padding: 16, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1, ...baseText }}>{s.metric}</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginTop: 5, ...baseText }}>{s.label}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 3, lineHeight: 1.4, ...baseText }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ padding: 14, borderRadius: 16, background: "rgba(234,170,0,0.08)", border: "1px solid rgba(234,170,0,0.2)" }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, ...baseText }}>
          Nexus leverages <strong style={{ color: "#EAAA00" }}>existing WVU infrastructure</strong> — no new hardware, no greenfield builds. The platform creates measurable ROI through improved retention and richer, real-time student satisfaction data for leadership decision-making.
        </p>
      </motion.div>
    </div>
  );

  if (slideId === 6) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
      {[
        {
          phase: "Phase 1", name: "The Nexus Hub", time: "Months 1–6", color: "#3b6fd4",
          items: ["Consolidate all .wvu.edu SSO logins", "Unified dashboard with app bridge", "PRT, laundry, dining IoT feeds", "Biometric identity verification"]
        },
        {
          phase: "Phase 2", name: "The Sentiment Engine", time: "Months 7–12", color: "#EAAA00",
          items: ["Launch anonymous Campus Pulse feed", "NLP pipeline + leadership dashboard", "ZKP anonymous token system", "Real-time area sentiment scoring"]
        },
        {
          phase: "Phase 3", name: "The Academic Agent", time: "Months 13–18", color: "#2d9e6b",
          items: ["AI study nudges + LLM tutor", "Difficulty heatmaps from eCampus", "Predictive grade modeling", "Full 30,000-user rollout"]
        },
      ].map((p, i) => (
        <motion.div key={p.phase} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
          style={{ padding: 14, borderRadius: 16, background: "rgba(255,255,255,0.04)", border: `1px solid ${p.color}40`, display: "flex", gap: 14 }}>
          <div style={{ flexShrink: 0 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: "0.1em", ...baseText }}>{p.phase}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 2, marginBottom: 2, ...baseText }}>{p.name}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", ...baseText }}>{p.time}</p>
          </div>
          <div style={{ width: 1, background: `${p.color}40`, flexShrink: 0 }} />
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
            {p.items.map(item => (
              <li key={item} style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", display: "flex", gap: 6, alignItems: "flex-start", lineHeight: 1.4, ...baseText }}>
                <span style={{ color: p.color, flexShrink: 0, marginTop: 1 }}>✓</span>{item}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );

  if (slideId === 7) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
      {[
        { icon: "🎓", title: "Solves Real Student Pain", desc: "App fatigue is measurable and documented. Nexus directly addresses the #1 friction in WVU student life.", highlight: "Student-first design" },
        { icon: "📊", title: "Gives Leadership Quantitative Data", desc: "Traditional surveys are lagging and biased. Nexus delivers a continuous, anonymous pulse of campus sentiment.", highlight: "Real-time insights" },
        { icon: "🏗️", title: "Leverages Existing Infrastructure", desc: "No new hardware. No greenfield system builds. Nexus bridges what WVU already has.", highlight: "Low implementation risk" },
        { icon: "🔐", title: "Cybersecurity-First by Design", desc: "ZKP encryption, FERPA compliance, and biometric SSO are baked in from day one.", highlight: "Trust & compliance" },
        { icon: "📈", title: "Clear Path to ROI", desc: "Retention uplift alone justifies the investment. Every phase delivers standalone value.", highlight: "Measurable impact" },
      ].map((item, i) => (
        <motion.div key={item.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 }}
          style={{ display: "flex", gap: 12, padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", ...baseText }}>{item.title}</p>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: "rgba(234,170,0,0.15)", color: "#EAAA00", ...baseText }}>{item.highlight}</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, ...baseText }}>{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return null;
}

// ─── PRESENTATION MODE ────────────────────────────────────────────────────────
function PresentationComponent({ onClose, onEnterApp }: { onClose: () => void, onEnterApp: () => void }) {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;
  const slide = SLIDES[current];
  const titleLines = slide.title.split("\n");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        setCurrent((prev) => Math.min(total - 1, prev + 1));
      } else if (e.key === "ArrowLeft") {
        setCurrent((prev) => Math.max(0, prev - 1));
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total, onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#001122", display: "flex", flexDirection: "column", fontFamily: "'Plus Jakarta Sans', sans-serif", overflowY: "auto" }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#002855,#1a4a8a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>N</div>
          <span style={{ fontFamily: "'Fraunces',serif", color: "#fff", fontSize: 16, fontWeight: 700 }}>Nexus</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>· Pitch Deck</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{current + 1} / {total}</span>
          <button onClick={onClose}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
            <X size={13} /> Close
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <motion.div animate={{ width: `${((current + 1) / total) * 100}%` }} transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ height: "100%", background: "linear-gradient(90deg, #002855, #EAAA00)" }} />
      </div>

      {/* Slide thumbnails */}
      <div style={{ display: "flex", gap: 8, padding: "12px 20px", overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        {SLIDES.map((s, i) => (
          <button key={s.id} onClick={() => setCurrent(i)}
            style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 10, border: `1px solid ${i === current ? "rgba(234,170,0,0.5)" : "rgba(255,255,255,0.08)"}`, background: i === current ? "rgba(234,170,0,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", color: i === current ? "#EAAA00" : "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: i === current ? 700 : 500, fontFamily: "inherit", whiteSpace: "nowrap" }}>
            {i + 1}. {s.tag}
          </button>
        ))}
      </div>

      {/* Main slide */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px 20px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.28 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#EAAA00", textTransform: "uppercase", letterSpacing: "0.15em" }}>{slide.tag}</span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 7vw, 48px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginTop: 6 }}>
                {titleLines.map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
              </h2>
            </div>
            <SlideContent slideId={current} onEnterApp={onEnterApp} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", cursor: current === 0 ? "not-allowed" : "pointer", color: current === 0 ? "rgba(255,255,255,0.2)" : "#fff", fontSize: 13, fontWeight: 600, fontFamily: "inherit", opacity: current === 0 ? 0.4 : 1 }}>
          <ChevronLeft size={16} /> Prev
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: i === current ? 20 : 7, height: 7, borderRadius: 4, border: "none", cursor: "pointer", background: i === current ? "#EAAA00" : "rgba(255,255,255,0.2)", transition: "all 0.3s", padding: 0 }} />
          ))}
        </div>
        {current < total - 1 ? (
          <button onClick={() => setCurrent(Math.min(total - 1, current + 1))}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 14, border: "none", background: "#EAAA00", cursor: "pointer", color: "#002855", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={onEnterApp}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 14, border: "none", background: "#EAAA00", cursor: "pointer", color: "#002855", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
            <Play size={14} /> Live Demo
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── APP DEMO ─────────────────────────────────────────────────────────────────
function AppDemo({ onBackToLanding }) {
  const [tab, setTab] = useState("home");
  const [nudge, setNudge] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    const t = setTimeout(() => setNudge(ASSIGNMENTS[0]), 2500);
    return () => clearTimeout(t);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const tabs = [
    { id: "home", label: "Home" },
    { id: "academics", label: "Academics" },
    { id: "pulse", label: "Campus Pulse" },
    { id: "apps", label: "My Apps" },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f4f6fa", minHeight: "100vh" }}>
      <AnimatePresence>
        {nudge && <NudgeBanner assignment={nudge} onDismiss={() => setNudge(null)} />}
      </AnimatePresence>

      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eef0f4", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBackToLanding} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, marginRight: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #002855, #1a4a8a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>N</div>
            <span style={{ fontFamily: "'Fraunces', serif", color: "#002855", fontSize: 20, fontWeight: 700 }}>Nexus</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 16, background: "#f4f6fa", flex: 1, maxWidth: 260 }}>
            <Search size={14} style={{ color: "#9ba3b5", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#b0b8cc" }}>Search anything…</span>
          </div>
          <button style={{ position: "relative", padding: 8, borderRadius: 12, background: "#f4f6fa", border: "none", cursor: "pointer" }}>
            <Bell size={18} style={{ color: "#002855" }} />
            <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#EAAA00", border: "2px solid #fff" }} />
          </button>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #EAAA00, #f0c030)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>A</div>
        </div>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 10px", display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ position: "relative", padding: "6px 14px", borderRadius: 12, border: "none", cursor: "pointer", background: "transparent", fontSize: 13, fontWeight: 600, color: tab === t.id ? "#002855" : "#9ba3b5", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {tab === t.id && <motion.div layoutId="app-tab" style={{ position: "absolute", inset: 0, borderRadius: 12, background: "#eef1f8" }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span style={{ position: "relative" }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 40px" }}>
        <AnimatePresence mode="wait">

          {/* HOME */}
          {tab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card style={{ overflow: "hidden" }}>
                <div style={{ padding: "20px 20px 16px", background: "linear-gradient(135deg, #002855 0%, #1a4a8a 70%, #2a5faa 100%)" }}>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{greeting()},</p>
                  <h1 style={{ fontFamily: "'Fraunces', serif", color: "#fff", fontSize: 30, fontWeight: 700, lineHeight: 1.2, marginBottom: 14 }}>Alex 👋</h1>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["⭐ GPA 3.61", "📚 81 Credits", "💡 Computer Science", "🎓 Junior"].map(chip => (
                      <span key={chip} style={{ padding: "4px 12px", borderRadius: 12, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 600 }}>{chip}</span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "10px 20px", borderTop: "1px solid #eef0f4", display: "flex", gap: 20, overflowX: "auto" }}>
                  {CAMPUS_STATUS.map(s => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.ok ? "#3aab6e" : "#e8973a" }} />
                      <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{s.label}:</span>
                      <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card style={{ padding: 16, border: "2px solid #fef3e7" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 16 }}>⚡</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#002855" }}>Coming Up</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 10, background: "#fef3e7", color: "#c47a1a" }}>4 assignments</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {ASSIGNMENTS.slice(0, 3).map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 14, background: "#f4f6fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{a.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#1e2a3a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</p>
                        <p style={{ fontSize: 12, color: "#9ba3b5" }}>{a.course} · Due {a.due}</p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 8, background: difficultyStyle[a.difficulty].bg, color: difficultyStyle[a.difficulty].text, flexShrink: 0 }}>{a.difficulty}</span>
                      {a.daysLeft <= 3 && <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 8, background: "#fce8e8", color: "#d43b3b", flexShrink: 0 }}>🔥 Soon</motion.span>}
                    </motion.div>
                  ))}
                </div>
                <button onClick={() => setTab("academics")} style={{ width: "100%", marginTop: 12, padding: "10px 0", borderRadius: 16, border: "none", cursor: "pointer", background: "#f4f6fa", color: "#002855", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}>
                  View full roadmap <ArrowRight size={14} />
                </button>
              </Card>

              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#002855", marginBottom: 10 }}>Quick Access</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {QUICK_ACTIONS.slice(0, 6).map((app, i) => (
                    <motion.button key={app.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: 12, borderRadius: 20, background: "#fff", border: "1px solid #eef0f4", cursor: "pointer", fontFamily: "inherit" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 12, background: app.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                        <app.icon size={17} style={{ color: app.color }} />
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#1e2a3a", textAlign: "left", lineHeight: 1.3 }}>{app.label}</p>
                      <p style={{ fontSize: 11, color: "#9ba3b5", marginTop: 2 }}>{app.status}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              <Card style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🗺️</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#002855" }}>Campus Pulse</span>
                  </div>
                  <button onClick={() => setTab("pulse")} style={{ fontSize: 12, color: "#1a6bc4", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>See all →</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {PULSE_POSTS.slice(0, 2).map(post => (
                    <div key={post.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 12, borderRadius: 16, background: "#f8f9fc" }}>
                      <span style={{ fontSize: 18 }}>{post.mood === "positive" ? "😊" : post.mood === "negative" ? "😤" : "😐"}</span>
                      <div>
                        <p style={{ fontSize: 11, color: "#9ba3b5", marginBottom: 3 }}>📍 {post.area} · {post.time}</p>
                        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.4 }}>{post.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 16, background: "linear-gradient(90deg, #e8f4fe, #eef1f8)", border: "1px solid #d0e4f7" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(26,107,196,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Lock size={15} style={{ color: "#1a6bc4" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#1a4a8a" }}>Zero-Knowledge Encryption Active</p>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>FERPA compliant · Your identity is always protected</p>
                </div>
                <CheckCircle2 size={16} style={{ color: "#3aab6e" }} />
              </div>
            </motion.div>
          )}

          {/* ACADEMICS */}
          {tab === "academics" && (
            <motion.div key="academics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Cumulative GPA", value: "3.61", sub: "↑ +0.04 this semester", emoji: "⭐", color: "#c49a1a", bg: "#fdf6e3" },
                  { label: "Credits Done", value: "81", sub: "of 128 to graduate", emoji: "📚", color: "#2d9e6b", bg: "#e6f7ef" },
                ].map(stat => (
                  <Card key={stat.label} style={{ padding: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 16, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>{stat.emoji}</div>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#1e2a3a", lineHeight: 1 }}>{stat.value}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginTop: 4 }}>{stat.label}</p>
                    <p style={{ fontSize: 11, color: stat.color, marginTop: 2, fontWeight: 600 }}>{stat.sub}</p>
                  </Card>
                ))}
              </div>
              <Card style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 16 }}>🗓️</span>
                  <div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#002855" }}>Your Roadmap</h2>
                    <p style={{ fontSize: 12, color: "#9ba3b5" }}>AI-ranked by difficulty & impact</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {ASSIGNMENTS.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ padding: 16, borderRadius: 20, background: "#f8f9fc", border: "1px solid #eef0f4", cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{a.emoji}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 8, background: `${a.color}15`, color: a.color }}>{a.course}</span>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 8, background: difficultyStyle[a.difficulty].bg, color: difficultyStyle[a.difficulty].text }}>{a.difficulty}</span>
                            {a.daysLeft <= 3 && <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 8, background: "#fce8e8", color: "#d43b3b" }}>🔥 Due soon</motion.span>}
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#1e2a3a" }}>{a.title}</p>
                          <p style={{ fontSize: 12, color: "#9ba3b5", marginTop: 3 }}>📅 Due {a.due} · Worth {a.weight}%</p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a" }}>{a.grade}%</p>
                          <p style={{ fontSize: 11, color: "#9ba3b5" }}>current</p>
                        </div>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: "#9ba3b5" }}>Difficulty</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: difficultyStyle[a.difficulty].text }}>{a.difficulty}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 6, background: "#eef0f4", overflow: "hidden" }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: a.difficulty === "Hard" ? "85%" : a.difficulty === "Medium" ? "55%" : "25%" }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                            style={{ height: "100%", borderRadius: 6, background: difficultyStyle[a.difficulty].text }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
              <div style={{ padding: 16, borderRadius: 24, background: "linear-gradient(135deg, #002855, #1a4a8a)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 16, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🤖</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#EAAA00", marginBottom: 6 }}>Nexus AI Recommends</p>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>Your CS 445 lab is due in <strong style={{ color: "#EAAA00" }}>2 days</strong> and rated Hard. Based on your 78% grade, dedicate <strong style={{ color: "#EAAA00" }}>3–4 hours tonight</strong> to stay ahead.</p>
                    <button style={{ marginTop: 12, padding: "8px 18px", borderRadius: 14, border: "none", cursor: "pointer", background: "#EAAA00", color: "#002855", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>Create Study Plan ✨</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PULSE */}
          {tab === "pulse" && (
            <motion.div key="pulse" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 16 }}>📊</span>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#002855" }}>Campus Mood Today</h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {[{ area: "Library", score: 81, mood: "😊" }, { area: "Mlair", score: 44, mood: "😤" }, { area: "PRT", score: 76, mood: "😊" }, { area: "Rec", score: 58, mood: "😐" }].map((area, i) => (
                    <motion.div key={area.area} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 12, borderRadius: 16, background: "#f8f9fc" }}>
                      <span style={{ fontSize: 24, marginBottom: 4 }}>{area.mood}</span>
                      <p style={{ fontSize: 17, fontWeight: 800, color: "#1e2a3a" }}>{area.score}</p>
                      <p style={{ fontSize: 11, color: "#9ba3b5", textAlign: "center" }}>{area.area}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#002855" }}>Live Feed</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 10, background: "#e6f7ef" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3aab6e" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#2d9e6b" }}>Anonymous & Encrypted</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {PULSE_POSTS.map((post, i) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                      <Card style={{ padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, background: post.mood === "positive" ? "#e6f7ef" : post.mood === "negative" ? "#fce8e8" : "#fef3e7" }}>
                            {post.mood === "positive" ? "😊" : post.mood === "negative" ? "😤" : "😐"}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 8, background: "#eef1f8", color: "#1a4a8a" }}>📍 {post.area}</span>
                              <span style={{ fontSize: 11, color: "#9ba3b5" }}>{post.time}</span>
                            </div>
                            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{post.text}</p>
                            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                              <button onClick={() => setLikedPosts(p => ({ ...p, [post.id]: !p[post.id] }))}
                                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: likedPosts[post.id] ? "#d43b6f" : "#9ba3b5", fontFamily: "inherit" }}>
                                <Heart size={14} fill={likedPosts[post.id] ? "#d43b6f" : "none"} />
                                <span style={{ fontSize: 12, fontWeight: 600 }}>{post.upvotes + (likedPosts[post.id] ? 1 : 0)}</span>
                              </button>
                              <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9ba3b5", fontFamily: "inherit" }}>
                                <MessageCircle size={14} />
                                <span style={{ fontSize: 12, fontWeight: 600 }}>Reply</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
              <Card style={{ padding: 16, border: "2px dashed #d0e4f7" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#002855", marginBottom: 10 }}>Share with campus 💬</p>
                <div style={{ padding: 12, borderRadius: 16, background: "#f8f9fc", border: "1px solid #eef0f4", fontSize: 13, color: "#b0b8cc" }}>What's happening around you? (Posted anonymously)</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  {["😊 Positive", "😐 Neutral", "😤 Frustrated"].map(mood => (
                    <button key={mood} style={{ padding: "6px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: "#f4f6fa", color: "#6b7280", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>{mood}</button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* APPS */}
          {tab === "apps" && (
            <motion.div key="apps" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card style={{ padding: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#002855" }}>🔗 All Your WVU Apps</h2>
                  <p style={{ fontSize: 12, color: "#9ba3b5", marginTop: 3 }}>One login. Every service. No more juggling 15 tabs.</p>
                </div>
                {[
                  { group: "🚌 Getting Around", items: QUICK_ACTIONS.slice(0, 3) },
                  { group: "📚 Academic Tools", items: QUICK_ACTIONS.slice(3, 6) },
                  { group: "🍕 Campus Life", items: QUICK_ACTIONS.slice(6, 9) },
                ].map((section, si) => (
                  <div key={section.group} style={{ marginTop: si > 0 ? 20 : 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#9ba3b5", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>{section.group}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {section.items.map((app, i) => (
                        <motion.div key={app.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.1 + i * 0.05 }} whileHover={{ x: 3 }}
                          style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 18, background: "#f8f9fc", cursor: "pointer" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 14, background: app.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <app.icon size={18} style={{ color: app.color }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#1e2a3a" }}>{app.label}</p>
                            <p style={{ fontSize: 12, color: "#9ba3b5" }}>Tap to open</p>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 10, background: app.bg, color: app.color }}>{app.status}</span>
                          <ChevronRight size={14} style={{ color: "#d0d5de" }} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 20, background: "linear-gradient(135deg, #002855, #1a4a8a)" }}>
                <span style={{ fontSize: 24 }}>🔐</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#EAAA00" }}>Single Sign-On Active</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>All 15 WVU apps with one secure login. No re-authentication.</p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
        <div style={{ paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Lock size={11} style={{ color: "#c0c8d8" }} />
          <span style={{ fontSize: 11, color: "#c0c8d8" }}>FERPA Compliant · ZKP Encrypted · WVU Nexus PoC v0.1</span>
        </div>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onOpenPresentation, onEnterApp }) {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Sticky nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #eef0f4" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#002855,#1a4a8a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>N</div>
            <span style={{ fontFamily: "'Fraunces',serif", color: "#002855", fontSize: 22, fontWeight: 700 }}>WVU Nexus</span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={onOpenPresentation}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 14, border: "1px solid #eef0f4", background: "#f8f9fc", cursor: "pointer", color: "#002855", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
              📽️ View Pitch Deck
            </button>
            <button onClick={onEnterApp}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#002855,#1a4a8a)", cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
              <Play size={13} /> Live Demo
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #001833 0%, #002855 50%, #1a4a8a 100%)", padding: "80px 24px 100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Soft glow */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(234,170,0,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: "rgba(234,170,0,0.12)", border: "1px solid rgba(234,170,0,0.25)", marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EAAA00", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#EAAA00", letterSpacing: "0.08em" }}>CGI CASE COMPETITION 2025 · WVU ICEV</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(40px, 9vw, 72px)", fontWeight: 800, color: "#fff", lineHeight: 1.05, marginBottom: 20 }}>
            The Predictive<br />
            <span style={{ color: "#EAAA00" }}>Student OS</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2.5vw, 19px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
            WVU Nexus unifies 15+ fragmented campus apps into one proactive, AI-powered dashboard — built for 30,000 students.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onEnterApp}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 16, border: "none", background: "#EAAA00", cursor: "pointer", color: "#002855", fontSize: 15, fontWeight: 800, fontFamily: "inherit" }}>
              <Play size={16} /> Try the Live Demo
            </button>
            <button onClick={onOpenPresentation}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)", cursor: "pointer", color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "inherit" }}>
              📽️ View Pitch Deck
            </button>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div style={{ background: "#f4f6fa", padding: "40px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {[
            { num: "15+", label: "Apps Unified", emoji: "🔗" },
            { num: "30K", label: "Target Students", emoji: "🎓" },
            { num: "47%", label: "Miss Deadlines", emoji: "⚠️" },
            { num: "18mo", label: "To Full Rollout", emoji: "🗓️" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ background: "#fff", borderRadius: 20, padding: "20px 16px", textAlign: "center", border: "1px solid #eef0f4" }}>
              <p style={{ fontSize: 28, marginBottom: 4 }}>{s.emoji}</p>
              <p style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 800, color: "#002855", lineHeight: 1 }}>{s.num}</p>
              <p style={{ fontSize: 13, color: "#9ba3b5", marginTop: 5, fontWeight: 600 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3-pillar section */}
      <div style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#EAAA00", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 10 }}>The Three Pillars</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, color: "#002855", lineHeight: 1.15 }}>Everything a student needs,<br />finally in one place.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { emoji: "🎯", title: "Proactive Academic Agent", color: "#3b6fd4", bg: "#e8f0fb", desc: "Nexus doesn't just show due dates. It reads difficulty signals, analyzes your grade standing, and nudges you into action 48 hours before it matters." },
            { emoji: "💬", title: "Campus Pulse", color: "#2d9e6b", bg: "#e6f7ef", desc: "A geo-fenced anonymous feed with NLP sentiment scoring. Students get real-time intel. Leadership gets a live satisfaction dashboard." },
            { emoji: "🔗", title: "Unified App Bridge", color: "#6b5dd3", bg: "#f0eeff", desc: "One SSO session. Every WVU service — PRT, laundry, dining, DegreeWorks, tickets — accessible from a single interface." },
          ].map((pillar, i) => (
            <motion.div key={pillar.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: 24, borderRadius: 24, background: "#fff", border: "1px solid #eef0f4", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: pillar.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>{pillar.emoji}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#002855", marginBottom: 10 }}>{pillar.title}</h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pitch deck CTA */}
      <div style={{ padding: "0 24px 60px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: 900, margin: "0 auto", borderRadius: 28, padding: "40px 36px", background: "linear-gradient(135deg, #001833, #002855, #1a4a8a)", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#EAAA00", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>📽️ Case Competition Pitch Deck</p>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>8 slides. Full strategy.<br />No fluff.</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>Problem · Solution · Architecture · Sentiment Engine · Business Case · Roadmap · Why Nexus Wins</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
            <button onClick={onOpenPresentation}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 16, border: "none", background: "#EAAA00", cursor: "pointer", color: "#002855", fontSize: 14, fontWeight: 800, fontFamily: "inherit" }}>
              📽️ Open Pitch Deck
            </button>
            <button onClick={onEnterApp}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)", cursor: "pointer", color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>
              <Play size={14} /> Live App Demo
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #eef0f4", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Lock size={12} style={{ color: "#c0c8d8" }} />
        <span style={{ fontSize: 12, color: "#c0c8d8" }}>WVU Nexus PoC · FERPA Compliant · ZKP Encrypted · CGI Case Competition 2025</span>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function WVUNexus() {
  const [view, setView] = useState("landing"); // landing | app
  const [showPresentation, setShowPresentation] = useState(false);

  return (
    <>
      <style>{fontStyle}</style>
      <AnimatePresence>
        {showPresentation && (
          <PresentationComponent
            onClose={() => setShowPresentation(false)}
            onEnterApp={() => { setShowPresentation(false); setView("app"); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage
              onOpenPresentation={() => setShowPresentation(true)}
              onEnterApp={() => setView("app")}
            />
          </motion.div>
        ) : (
          <motion.div key="app" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <AppDemo onBackToLanding={() => setView("landing")} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
