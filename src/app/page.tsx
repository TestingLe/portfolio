"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { HiArrowUpRight, HiEnvelope, HiPhone } from "react-icons/hi2";
import dynamic from "next/dynamic";

const World = dynamic(() => import("@/components/world/World"), { ssr: false });
const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false });
import {
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobelightroom,
  SiCanva,
  SiPython,
  SiHtml5,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiJavascript,
  SiVercel,
  SiTypescript,
} from "react-icons/si";
import { FaFigma, FaPaintBrush, FaLaptopCode, FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { BsMicrosoft } from "react-icons/bs";

/* ───────────────────── NAV ───────────────────── */
const navItems = ["About", "Skills", "Projects", "Education", "Awards", "Contact"];

function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems.map((n) => document.getElementById(n.toLowerCase()));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.35 }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/5" : ""
        }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="text-xl font-bold tracking-tight">
          <span className="text-accent">JR</span>
          <span className="text-foreground/60">.</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${active === item.toLowerCase()
                ? "text-accent"
                : "text-foreground/50 hover:text-foreground"
                }`}
            >
              {active === item.toLowerCase() && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-accent/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item}</span>
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-[2px] bg-foreground"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-5 h-[2px] bg-foreground"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-[2px] bg-foreground"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-2">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-foreground/60 hover:text-foreground py-2 text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ───────────────────── CURSOR GLOW ───────────────────── */
function CursorGlow() {
  const [pos, setPos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return <div className="cursor-glow hidden md:block" style={{ left: pos.x, top: pos.y }} />;
}

/* ───────────────────── HERO ───────────────────── */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.9]);

  const roles = ["Full Stack Developer", "Graphic Designer", "UI Designer"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: NodeJS.Timeout;
    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 80);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex]);

  /* Split-letter animation variants */
  const nameLetters = "Rich".split("");
  const letterVariants = {
    hidden: { opacity: 0, y: 80, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1, y: 0, rotateX: 0,
      transition: { delay: 0.4 + i * 0.08, duration: 0.8, ease: "easeOut" as const },
    }),
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background Scene */}
      <HeroScene />

      {/* Aurora gradient overlay */}
      <div className="absolute inset-0 aurora-bg opacity-50" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/6 w-[600px] h-[600px] rounded-full morph-blob"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/6 w-[500px] h-[500px] rounded-full morph-blob"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, 40, -10, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-1/3 w-[400px] h-[400px] rounded-full morph-blob"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)" }}
        />
      </div>

      {/* Orbiting decorative elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]">
          <div className="orbit-1 absolute w-2 h-2 bg-accent/40 rounded-full blur-[1px]" />
          <div className="orbit-2 absolute w-1.5 h-1.5 bg-purple-400/30 rounded-full blur-[1px]" />
          <div className="orbit-3 absolute w-1 h-1 bg-pink-400/30 rounded-full blur-[1px]" />
        </div>
      </div>

      <motion.div style={{ y, opacity, scale }} className="relative z-10 text-center px-6 max-w-5xl">
        {/* Profile Photo with enhanced glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-accent via-purple-500 to-pink-500 animate-spin-slow opacity-50 blur-md" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent via-purple-500 to-accent animate-spin-slow opacity-70 blur-sm" />
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-white/20 bg-surface glow-pulse">
              <img src="/profile.jfif" alt="Rich" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-[#050505]">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-50" />
            </div>
          </div>
        </motion.div>

        {/* Glassmorphism status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-xs font-medium text-foreground/70 tracking-wide">Available for opportunities</span>
        </motion.div>

        {/* Split-letter animated name */}
        <motion.h1
          className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-tighter leading-[0.9]"
          style={{ perspective: "1000px" }}
        >
          {nameLetters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="inline-block gradient-text"
              style={{ textShadow: "0 0 80px rgba(99,102,241,0.3)" }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-xl sm:text-2xl font-mono text-foreground/40"
        >
          <span className="text-accent/60">{"< "}</span>
          <span className="type-cursor text-foreground/70">{text}</span>
          <span className="text-accent/60">{" />"}</span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-6 text-foreground/40 max-w-lg mx-auto text-base sm:text-lg leading-relaxed"
        >
          Creating visually appealing and user-friendly digital solutions
          through design and code.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="group relative px-7 py-3.5 bg-accent text-white text-sm font-medium rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent via-purple-500 to-accent bg-[length:200%_100%] animate-[aurora_4s_ease_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
              View Projects
              <HiArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </a>
          <a
            href="#contact"
            className="px-7 py-3.5 text-foreground/60 text-sm font-medium rounded-full border border-white/10 hover:border-accent/30 hover:text-foreground hover:bg-accent/5 transition-all hover:scale-105 active:scale-95"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/20">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-white/15 flex justify-center pt-1.5">
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-1 h-2 bg-accent/50 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}


/* ───────────────────── SKILLS MARQUEE ───────────────────── */
function SkillsMarquee() {
  const skills = [
    "GRAPHIC DESIGN",
    "UI/UX DESIGN",
    "WEB DEVELOPMENT",
    "ADOBE PHOTOSHOP",
    "ILLUSTRATOR",
    "CANVA",
    "HTML/CSS",
    "PYTHON",
    "FIGMA",
  ];

  return (
    <div className="py-6 border-y border-white/5 overflow-hidden">
      <div className="marquee flex whitespace-nowrap">
        {[...skills, ...skills].map((skill, i) => (
          <span key={i} className="mx-8 text-sm font-medium text-foreground/20 tracking-widest">
            {skill}
            <span className="mx-8 text-accent/30">*</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── SECTION HEADER ───────────────────── */
function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="mb-16"
    >
      <span className="text-accent font-mono text-sm tracking-wider">{label}</span>
      <h2 className="text-3xl sm:text-5xl font-bold mt-2 tracking-tight gradient-text">{title}</h2>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="h-[2px] bg-gradient-to-r from-accent to-purple-500 mt-4"
      />
    </motion.div>
  );
}

/* ───────────────────── ABOUT ───────────────────── */
function About() {
  const stats = [
    { value: "18", label: "Years Old" },
    { value: "3+", label: "Projects Built" },
    { value: "ICT", label: "Specialization" },
  ];

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="// 01" title="About Me" />

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-foreground/60 leading-relaxed text-lg">
              I&apos;m a passionate student from the Philippines specializing in{" "}
              <span className="text-foreground font-medium">Information and Communications Technology</span>.
              My goal is to apply my skills in Graphic Design, UI Design, and coding to create
              meaningful digital experiences.
            </p>
            <p className="text-foreground/60 leading-relaxed text-lg mt-4">
              Currently studying at{" "}
              <span className="text-foreground font-medium">National Christian Life College</span>,
              I&apos;m continuously learning and adapting to new technologies and design trends.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center md:text-left"
                >
                  <div className="text-3xl font-bold text-accent">{stat.value}</div>
                  <div className="text-xs text-foreground/40 mt-1 tracking-wider uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            {[
              { icon: <FaPaintBrush />, title: "Graphic Design", desc: "Adobe Photoshop, Illustrator, Canva, Lightroom" },
              { icon: <FaFigma />, title: "UI Design", desc: "User-centered interfaces with modern aesthetics" },
              { icon: <FaLaptopCode />, title: "Web Development", desc: "HTML, CSS, Python, modern web technologies" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group p-6 rounded-2xl glass holographic-shimmer card-hover cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent text-lg group-hover:bg-accent group-hover:text-white transition-all group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-foreground/40 mt-1">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── SKILLS ───────────────────── */
function Skills() {
  const skillCategories = [
    {
      title: "Design Tools",
      skills: [
        { name: "Adobe Photoshop", icon: <SiAdobephotoshop />, level: 85 },
        { name: "Adobe Illustrator", icon: <SiAdobeillustrator />, level: 80 },
        { name: "Adobe Lightroom", icon: <SiAdobelightroom />, level: 75 },
        { name: "Canva", icon: <SiCanva />, level: 90 },
      ],
    },
    {
      title: "Development",
      skills: [
        { name: "React", icon: <SiReact />, level: 85 },
        { name: "Next.js", icon: <SiNextdotjs />, level: 80 },
        { name: "JavaScript", icon: <SiJavascript />, level: 85 },
        { name: "TypeScript", icon: <SiTypescript />, level: 75 },
        { name: "Tailwind CSS", icon: <SiTailwindcss />, level: 90 },
        { name: "HTML/CSS", icon: <SiHtml5 />, level: 90 },
        { name: "Python", icon: <SiPython />, level: 65 },
        { name: "Vercel", icon: <SiVercel />, level: 85 },
      ],
    },
  ];

  return (
    <section id="skills" className="py-32 px-6 bg-surface/50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="// 02" title="Skills & Tools" />

        <div className="grid md:grid-cols-2 gap-12">
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-6 text-foreground/80">{cat.title}</h3>
              <div className="space-y-5">
                {cat.skills.map((skill, si) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.2 + si * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-accent text-lg">{skill.icon}</span>
                        <span className="text-sm font-medium text-foreground/70">{skill.name}</span>
                      </div>
                      <span className="text-xs text-foreground/30 font-mono">{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: ci * 0.2 + si * 0.1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Soft skills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-lg font-semibold mb-6 text-foreground/80">Soft Skills</h3>
          <div className="flex flex-wrap gap-3">
            {["Time Management", "Adaptability", "Continuous Learning", "Computer Literate", "Creative Problem Solving"].map(
              (skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 text-sm text-foreground/50 bg-surface border border-white/5 rounded-full hover:border-accent/30 hover:text-accent transition-colors cursor-default"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────── PROJECTS ───────────────────── */
function Projects() {
  const [loadedIframes, setLoadedIframes] = useState<{ [key: string]: boolean }>({});

  const projects: Array<{
    title: string;
    description: string;
    url?: string;
    video?: string;
    tags: string[];
    color: string;
    accentColor: string;
  }> = [
      {
        title: "Project Tony Stark",
        description:
          "An innovative video demonstration showcasing advanced concepts and futuristic design elements inspired by Tony Stark.",
        video: "/projecttonystark.mp4",
        tags: ["Video", "Innovation", "Design"],
        color: "from-red-500/20 to-orange-500/20",
        accentColor: "#ef4444",
      },
      {
        title: "Travel and Tours",
        description:
          "A comprehensive travel and tours website offering seamless booking experiences and exploring beautiful destinations.",
        url: "https://travelandtourjhonrichdemo.vercel.app",
        tags: ["Web App", "Travel", "UI/UX"],
        color: "from-blue-500/20 to-cyan-500/20",
        accentColor: "#06b6d4",
      },
      {
        title: "StudyFlow Learn",
        description:
          "An interactive learning platform designed to help students organize and optimize their study sessions with smart tools and resources.",
        url: "https://studyflowlearn.vercel.app",
        tags: ["Web App", "Education", "UI Design"],
        color: "from-indigo-500/20 to-purple-500/20",
        accentColor: "#6366f1",
      },
      {
        title: "Regret Minimizer",
        description:
          "A decision-making tool that helps users evaluate choices through a structured framework, minimizing future regret.",
        url: "https://regretminimizerv1.vercel.app",
        tags: ["Web App", "Productivity", "Development"],
        color: "from-purple-500/20 to-pink-500/20",
        accentColor: "#a855f7",
      },
      {
        title: "AI Study",
        description:
          "An AI-powered study companion that leverages artificial intelligence to enhance the learning experience with smart features.",
        url: "https://aistudy-lilac.vercel.app",
        tags: ["AI", "Education", "Web App"],
        color: "from-emerald-500/20 to-teal-500/20",
        accentColor: "#10b981",
      },
    ];

  const handleIframeLoad = (title: string) => {
    setLoadedIframes((prev: { [key: string]: boolean }) => ({ ...prev, [title]: true }));
  };

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="// 03" title="Featured Projects" />

        <div className="grid gap-20">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 lg:gap-16 items-center group`}
            >
              {/* Project Media */}
              <div className="w-full lg:w-3/5 relative">
                <div className="relative rounded-2xl bg-surface border border-white/10 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                  {/* Gradient blob */}
                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br ${project.color} rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
                  />

                  {/* Browser Frame Preview */}
                  <div className="relative z-10 bg-black/40 backdrop-blur-sm">
                    {/* Browser Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border-b border-white/10">
                      {/* Traffic Lights */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      {/* URL Bar */}
                      <div className="flex-1 mx-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/40 border border-white/10">
                          <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-foreground/40 font-mono truncate">
                            {project.url || "local://project-tony-stark.mp4"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Media Container */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-black/60">
                      {project.video ? (
                        <video
                          src={project.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          {/* Loading State */}
                          {!loadedIframes[project.title] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                              <div className="flex flex-col items-center gap-3">
                                <div
                                  className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                                  style={{ borderColor: project.accentColor, borderTopColor: "transparent" }}
                                />
                                <span className="text-xs text-foreground/40">Loading preview...</span>
                              </div>
                            </div>
                          )}
                          {/* Iframe */}
                          <iframe
                            src={project.url}
                            title={`${project.title} Preview`}
                            className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
                            onLoad={() => handleIframeLoad(project.title)}
                            loading="lazy"
                            sandbox="allow-scripts allow-same-origin"
                          />
                        </>
                      )}

                      {/* Hover Overlay */}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/60 transition-all duration-300 group/overlay cursor-pointer z-20"
                        >
                          <div className="opacity-0 group-hover/overlay:opacity-100 transform scale-90 group-hover/overlay:scale-100 transition-all duration-300 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium">
                            <span>Visit Site</span>
                            <HiArrowUpRight className="text-sm" />
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="w-full lg:w-2/5 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-sm" style={{ color: project.accentColor }}>0{i + 1}</span>
                  <div className="w-12 h-[1px]" style={{ backgroundColor: `${project.accentColor}40` }} />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 relative">
                  <span className="text-foreground transition-opacity duration-300 group-hover:opacity-0">
                    {project.title}
                  </span>
                  <span className="absolute left-0 top-0 text-transparent bg-clip-text transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ backgroundImage: `linear-gradient(to right, ${project.accentColor}, #ffffff)` }}>
                    {project.title}
                  </span>
                </h3>
                <div className="p-6 rounded-2xl bg-surface/50 border border-white/5 backdrop-blur-sm mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                  <p className="text-foreground/60 text-base leading-relaxed relative z-10">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 text-xs font-mono text-foreground/50 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors w-fit group/link"
                    style={{ color: project.accentColor }}
                  >
                    <span className="relative">
                      Explore Project
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover/link:w-full" />
                    </span>
                    <HiArrowUpRight className="transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── EDUCATION ───────────────────── */
function Education() {
  const timeline = [
    {
      period: "2024 - Present",
      school: "National Christian Life College",
      level: "Secondary TVL - ICT",
    },
    {
      period: "2021 - 2024",
      school: "Concepcion Integrated School",
      level: "Secondary Level",
    },
    {
      period: "2019 - 2021",
      school: "Saint Joseph Montessori Integrated School Foundation",
      level: "Primary",
    },
    {
      period: "2015 - 2019",
      school: "Saint Joan Of Arc Academy",
      level: "Primary",
    },
  ];

  return (
    <section id="education" className="py-32 px-6 bg-surface/50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="// 04" title="Education" />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 transform md:-translate-x-1/2" />

          {timeline.map((item, i) => (
            <motion.div
              key={item.school}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
            >
              {/* Dot */}
              <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-accent rounded-full transform -translate-x-[5px] md:-translate-x-1/2 mt-2 md:mt-0 z-10 timeline-dot-glow">
                <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-20" />
              </div>

              {/* Card */}
              <div className={`ml-6 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                <span className="text-accent font-mono text-xs tracking-wider">{item.period}</span>
                <h3 className="text-lg font-bold mt-1">{item.school}</h3>
                <p className="text-foreground/40 text-sm mt-1">{item.level}</p>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── AWARDS ───────────────────── */
function Awards() {
  const awards = [
    "Outstanding Performance in ICT",
    "With Honors",
    "Best in Physical Education",
    "Patriot's Honor",
    "Perfect Attendance",
  ];

  return (
    <section id="awards" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="// 05" title="Awards & Recognition" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((award, i) => (
            <motion.div
              key={award}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="group p-6 rounded-2xl glass holographic-shimmer hover:border-accent/20 transition-all cursor-default"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-mono text-sm font-bold shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground/90 text-sm">{award}</h3>
                  <p className="text-xs text-foreground/30 mt-1">National Christian Life College &middot; 2024-2025</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── CONTACT ───────────────────── */
function Contact() {
  return (
    <section id="contact" className="py-32 px-6 bg-surface/50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="// 06" title="Get in Touch" />

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-foreground/50 leading-relaxed text-lg">
              Interested in working together or have any questions? Feel free to reach out.
              I&apos;m always open to new opportunities and collaborations.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="mailto:jhonworkplace1@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl glass hover:border-accent/20 transition-all group"
              >
                <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <HiEnvelope className="text-lg" />
                </div>
                <div>
                  <div className="text-xs text-foreground/30 uppercase tracking-wider">Email</div>
                  <div className="text-sm text-foreground/70 mt-0.5">jhonworkplace1@gmail.com</div>
                </div>
              </a>

              <a
                href="tel:09611618136"
                className="flex items-center gap-4 p-4 rounded-xl glass hover:border-accent/20 transition-all group"
              >
                <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <HiPhone className="text-lg" />
                </div>
                <div>
                  <div className="text-xs text-foreground/30 uppercase tracking-wider">Phone</div>
                  <div className="text-sm text-foreground/70 mt-0.5">0961 161 8136</div>
                </div>
              </a>

              <div className="flex items-center gap-4 pt-4">
                <a href="https://www.facebook.com/ichJhon" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-accent/10 text-accent hover:bg-[#1877F2] hover:text-white transition-colors" aria-label="Facebook">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="https://www.instagram.com/ichbin.jhon/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-accent/10 text-accent hover:bg-[#E4405F] hover:text-white transition-colors" aria-label="Instagram">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="https://x.com/Spainiaaa" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-accent/10 text-accent hover:bg-black hover:text-white transition-colors" aria-label="X (Twitter)">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="https://www.linkedin.com/in/jhon-rich-076201329/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-accent/10 text-accent hover:bg-[#0A66C2] hover:text-white transition-colors" aria-label="LinkedIn">
                  <FaLinkedin className="text-xl" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            {[
              { label: "Name", value: "Rich" },
              { label: "Age", value: "18 years old" },
              { label: "Nationality", value: "Filipino" },
              { label: "Specialization", value: "TVL - ICT" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-xl glass hover:border-accent/10 transition-all">
                <span className="text-xs text-foreground/30 uppercase tracking-wider">{item.label}</span>
                <span className="text-sm text-foreground/70 font-medium">{item.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── FOOTER ───────────────────── */
function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-foreground/30">
          &copy; 2025 Rich. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs text-foreground/20 hover:text-foreground/50 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────── MODE TOGGLE ───────────────────── */
function ModeToggle({ is3D, onToggle }: { is3D: boolean; onToggle: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 hover:border-accent/30 transition-all group"
    >
      <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
        {is3D ? "2D View" : "3D World"}
      </span>
      <div className="relative w-10 h-5 rounded-full bg-white/10 transition-colors">
        <motion.div
          animate={{ x: is3D ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-accent"
        />
      </div>
    </motion.button>
  );
}

/* ───────────────────── MAIN PAGE ───────────────────── */
export default function Home() {
  const [is3D, setIs3D] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <ModeToggle is3D={is3D} onToggle={() => setIs3D(!is3D)} />

      <AnimatePresence mode="wait">
        {is3D ? (
          <motion.div
            key="3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <World />
          </motion.div>
        ) : (
          <motion.div
            key="2d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="noise-overlay grid-bg min-h-screen"
          >
            <CursorGlow />
            <Navbar />
            <Hero />
            <SkillsMarquee />
            <div className="section-divider" />
            <About />
            <div className="section-divider" />
            <Skills />
            <div className="section-divider" />
            <Projects />
            <div className="section-divider" />
            <Education />
            <div className="section-divider" />
            <Awards />
            <div className="section-divider" />
            <Contact />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
