"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { HiArrowUpRight, HiEnvelope, HiPhone } from "react-icons/hi2";
import dynamic from "next/dynamic";

const World = dynamic(() => import("@/components/world/World"), { ssr: false });
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
import { FaFigma, FaPaintBrush, FaLaptopCode } from "react-icons/fa";
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
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const roles = ["Graphic Designer", "UI Designer", "Web Developer"];
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

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-4xl">
        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-6"
        >
          <div className="relative inline-block">
            {/* Glowing ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent via-purple-500 to-accent animate-spin-slow opacity-70 blur-sm" style={{ padding: '3px' }} />
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-white/20 bg-surface">
              <img
                src="/profile.jfif"
                alt="Rich"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Status dot */}
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-[#050505]">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-50" />
            </div>
          </div>
        </motion.div>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-xs font-medium text-foreground/70">Available for opportunities</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.95]"
        >
          <span className="block text-foreground">Rich</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xl sm:text-2xl font-mono text-foreground/40"
        >
          <span className="text-accent/60">{"< "}</span>
          <span className="type-cursor text-foreground/70">{text}</span>
          <span className="text-accent/60">{" />"}</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-foreground/40 max-w-lg mx-auto text-base leading-relaxed"
        >
          Creating visually appealing and user-friendly digital solutions
          through design and code.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="group relative px-6 py-3 bg-accent text-white text-sm font-medium rounded-full overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Projects
              <HiArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </a>
          <a
            href="#contact"
            className="px-6 py-3 text-foreground/60 text-sm font-medium rounded-full border border-white/10 hover:border-white/20 hover:text-foreground transition-all"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="mb-16"
    >
      <span className="text-accent font-mono text-sm tracking-wider">{label}</span>
      <h2 className="text-3xl sm:text-4xl font-bold mt-2 tracking-tight">{title}</h2>
      <div className="w-12 h-[2px] bg-accent/50 mt-4" />
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
                className="group p-6 rounded-2xl bg-surface border border-white/5 card-hover cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent text-lg group-hover:bg-accent group-hover:text-white transition-colors">
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

  const projects = [
    {
      title: "StudyFlow Learn",
      description:
        "An interactive learning platform designed to help students organize and optimize their study sessions with smart tools and resources.",
      url: "https://studyflowlearn.vercel.app",
      tags: ["Web App", "Education", "UI Design"],
      color: "from-blue-500/20 to-cyan-500/20",
      accentColor: "#3b82f6",
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
    setLoadedIframes((prev) => ({ ...prev, [title]: true }));
  };

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="// 03" title="Featured Projects" />

        <div className="grid gap-12">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group relative"
            >
              {/* Project Card */}
              <div className="relative rounded-2xl bg-surface border border-white/5 overflow-hidden card-hover">
                {/* Gradient blob */}
                <div
                  className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${project.color} rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                />

                {/* Browser Frame Preview */}
                <div className="relative z-10 p-4 md:p-6">
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm">
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
                          <span className="text-xs text-foreground/40 font-mono truncate">{project.url}</span>
                        </div>
                      </div>
                    </div>

                    {/* Iframe Container */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-black/60">
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
                      {/* Hover Overlay */}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/60 transition-all duration-300 group/overlay cursor-pointer"
                      >
                        <div className="opacity-0 group-hover/overlay:opacity-100 transform scale-90 group-hover/overlay:scale-100 transition-all duration-300 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium">
                          <span>Visit Site</span>
                          <HiArrowUpRight className="text-sm" />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="relative z-10 px-6 md:px-8 pb-6 md:pb-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-accent font-mono text-sm">0{i + 1}</span>
                        <div className="w-8 h-[1px] bg-accent/30" />
                      </div>
                      <h3 className="text-2xl font-bold group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-foreground/40 mt-2 max-w-lg text-sm leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-mono text-foreground/30 bg-white/5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 hover:border-accent/50 hover:bg-accent/10 transition-all shrink-0"
                    >
                      <HiArrowUpRight className="text-foreground/30 group-hover:text-accent transition-colors" />
                    </a>
                  </div>
                </div>
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
              <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-accent rounded-full transform -translate-x-[5px] md:-translate-x-1/2 mt-2 md:mt-0 z-10">
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
              whileHover={{ scale: 1.02 }}
              className="group p-6 rounded-2xl bg-surface border border-white/5 hover:border-accent/20 transition-all cursor-default"
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
                className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-white/5 hover:border-accent/20 transition-all group"
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
                className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-white/5 hover:border-accent/20 transition-all group"
              >
                <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <HiPhone className="text-lg" />
                </div>
                <div>
                  <div className="text-xs text-foreground/30 uppercase tracking-wider">Phone</div>
                  <div className="text-sm text-foreground/70 mt-0.5">0961 161 8136</div>
                </div>
              </a>
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
              <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-white/5">
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
    setIs3D(true);
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
            <About />
            <Skills />
            <Projects />
            <Education />
            <Awards />
            <Contact />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
