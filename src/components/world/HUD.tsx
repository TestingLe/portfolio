"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import {
  HiArrowUpRight,
  HiEnvelope,
  HiPhone,
  HiXMark,
  HiAcademicCap,
  HiTrophy,
  HiUser,
  HiWrenchScrewdriver,
  HiFolder,
  HiChatBubbleLeft,
} from "react-icons/hi2";

const zoneIcons: Record<string, React.ReactNode> = {
  about: <HiUser className="text-xl" />,
  skills: <HiWrenchScrewdriver className="text-xl" />,
  projects: <HiFolder className="text-xl" />,
  education: <HiAcademicCap className="text-xl" />,
  awards: <HiTrophy className="text-xl" />,
  contact: <HiChatBubbleLeft className="text-xl" />,
};

const zoneColors: Record<string, string> = {
  about: "#6366f1",
  skills: "#f59e0b",
  projects: "#10b981",
  education: "#3b82f6",
  awards: "#ef4444",
  contact: "#8b5cf6",
};

/* ── About Panel ── */
function AboutPanel() {
  return (
    <div className="space-y-4">
      <p className="text-white/70 leading-relaxed">
        I&apos;m a passionate student from the Philippines specializing in{" "}
        <span className="text-white font-medium">Information and Communications Technology</span>.
        My goal is to apply my skills in Graphic Design, UI Design, and coding to create
        meaningful digital experiences.
      </p>
      <p className="text-white/70 leading-relaxed">
        Currently studying at{" "}
        <span className="text-white font-medium">National Christian Life College</span>,
        I&apos;m continuously learning and adapting to new technologies and design trends.
      </p>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { value: "18", label: "Years Old" },
          { value: "3+", label: "Projects" },
          { value: "ICT", label: "Specialization" },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-2xl font-bold text-indigo-400">{stat.value}</div>
            <div className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Skills Panel ── */
function SkillsPanel() {
  const categories = [
    {
      title: "Design Tools",
      skills: [
        { name: "Adobe Photoshop", level: 85 },
        { name: "Adobe Illustrator", level: 80 },
        { name: "Canva", level: 90 },
        { name: "Adobe Lightroom", level: 75 },
      ],
    },
    {
      title: "Development",
      skills: [
        { name: "HTML/CSS", level: 80 },
        { name: "Python", level: 65 },
        { name: "MS Office", level: 90 },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      {categories.map((cat) => (
        <div key={cat.title}>
          <h4 className="text-white/90 font-semibold text-sm mb-3">{cat.title}</h4>
          <div className="space-y-2">
            {cat.skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">{skill.name}</span>
                  <span className="text-white/30 font-mono">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(to right, #f59e0b, #fbbf24)` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div>
        <h4 className="text-white/90 font-semibold text-sm mb-3">Soft Skills</h4>
        <div className="flex flex-wrap gap-1.5">
          {["Time Management", "Adaptability", "Continuous Learning", "Creative Problem Solving"].map((s) => (
            <span key={s} className="px-2 py-1 text-[10px] bg-white/5 rounded-full text-white/50">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Projects Panel ── */
function ProjectsPanel() {
  const projects = [
    {
      title: "Project Tony Stark",
      desc: "Innovative video demonstration of advanced concepts",
      url: "/projecttonystark.mp4",
      tags: ["Video", "Innovation"],
    },
    {
      title: "Travel and Tours",
      desc: "Comprehensive travel and tours website",
      url: "https://traveltourjhonrich.vercel.app",
      tags: ["Web App", "Travel"],
    },
    {
      title: "StudyFlow Learn",
      desc: "Interactive learning platform for students",
      url: "https://studyflowlearn.vercel.app",
      tags: ["Web App", "Education"],
    },
    {
      title: "Regret Minimizer",
      desc: "Decision-making tool using structured frameworks",
      url: "https://regretminimizerv1.vercel.app",
      tags: ["Productivity", "Dev"],
    },
    {
      title: "AI Study",
      desc: "AI-powered study companion",
      url: "https://aistudy-lilac.vercel.app",
      tags: ["AI", "Education"],
    },
  ];

  return (
    <div className="space-y-3">
      {projects.map((p, i) => (
        <a
          key={p.title}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-emerald-400 font-mono text-xs">0{i + 1}</span>
                <h4 className="text-white/90 font-semibold text-sm">{p.title}</h4>
              </div>
              <p className="text-white/40 text-xs">{p.desc}</p>
              <div className="flex gap-1.5 mt-2">
                {p.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 text-[9px] bg-white/5 rounded-full text-white/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <HiArrowUpRight className="text-white/20 group-hover:text-emerald-400 transition-colors shrink-0 mt-1" />
          </div>
        </a>
      ))}
    </div>
  );
}

/* ── Education Panel ── */
function EducationPanel() {
  const timeline = [
    { period: "2024 - Present", school: "National Christian Life College", level: "TVL - ICT", location: "Philippines" },
    { period: "2021 - 2024", school: "Concepcion Integrated School", level: "Secondary", location: "Philippines" },
    { period: "2019 - 2021", school: "Saint Joseph Montessori ISFI", level: "Primary", location: "Philippines" },
    { period: "2015 - 2019", school: "Saint Joan Of Arc Academy", level: "Primary", location: "Philippines" },
  ];

  return (
    <div className="space-y-3">
      {timeline.map((item, i) => (
        <div key={i} className="relative pl-4 border-l border-white/10 pb-3 last:pb-0">
          <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-[#0a0a0a]" />
          <span className="text-blue-400 font-mono text-[10px]">{item.period}</span>
          <h4 className="text-white/90 font-semibold text-sm mt-0.5">{item.school}</h4>
          <p className="text-white/40 text-xs">{item.level} &middot; {item.location}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Awards Panel ── */
function AwardsPanel() {
  const awards = [
    "Outstanding Performance in ICT",
    "With Honors",
    "Best in Physical Education",
    "Patriot's Honor",
    "Perfect Attendance",
  ];

  return (
    <div className="space-y-2">
      {awards.map((award, i) => (
        <div key={award} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold font-mono shrink-0">
            {String(i + 1).padStart(2, "0")}
          </div>
          <div>
            <div className="text-white/80 text-sm font-medium">{award}</div>
            <div className="text-white/30 text-[10px]">NCLC &middot; 2024-2025</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Contact Panel ── */
function ContactPanel() {
  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm leading-relaxed">
        Interested in working together? Feel free to reach out.
      </p>
      <a
        href="mailto:jhonworkplace1@gmail.com"
        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
      >
        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
          <HiEnvelope className="text-sm" />
        </div>
        <div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider">Email</div>
          <div className="text-xs text-white/70">jhonworkplace1@gmail.com</div>
        </div>
      </a>
      <a
        href="tel:09611618136"
        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
      >
        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
          <HiPhone className="text-sm" />
        </div>
        <div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider">Phone</div>
          <div className="text-xs text-white/70">0961 161 8136</div>
        </div>
      </a>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {[
          { label: "Name", value: "Jhon Rich T. Alzado" },
          { label: "Age", value: "18 years old" },
          { label: "Location", value: "Philippines" },
          { label: "Focus", value: "TVL - ICT" },
        ].map((item) => (
          <div key={item.label} className="p-2 rounded-lg bg-white/5 text-center">
            <div className="text-[9px] text-white/30 uppercase">{item.label}</div>
            <div className="text-xs text-white/60 mt-0.5">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const zonePanels: Record<string, React.ReactNode> = {
  about: <AboutPanel />,
  skills: <SkillsPanel />,
  projects: <ProjectsPanel />,
  education: <EducationPanel />,
  awards: <AwardsPanel />,
  contact: <ContactPanel />,
};

const zoneTitles: Record<string, string> = {
  about: "About Me",
  skills: "Skills & Tools",
  projects: "Featured Projects",
  education: "Education",
  awards: "Awards & Recognition",
  contact: "Get in Touch",
};

// Zone world positions from PortfolioZones
const ZONE_WORLD_POSITIONS: Record<string, [number, number]> = {
  about: [0, -6],
  skills: [8, 0],
  projects: [5, 8],
  education: [-5, 8],
  awards: [-8, 0],
  contact: [0, 12],
};

const WORLD_BOUNDS = 25; // -25 to 25

function worldToMinimap(x: number, z: number): [number, number] {
  // Map world coords (-25..25) to percentage (5..95)
  const px = ((x + WORLD_BOUNDS) / (WORLD_BOUNDS * 2)) * 90 + 5;
  const py = ((z + WORLD_BOUNDS) / (WORLD_BOUNDS * 2)) * 90 + 5;
  return [px, py];
}

function Minimap() {
  const playerX = useGameStore((s) => s.playerX);
  const playerZ = useGameStore((s) => s.playerZ);
  const [px, py] = worldToMinimap(playerX, playerZ);

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none">
      <div className="w-32 h-32 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 overflow-hidden p-2">
        <div className="relative w-full h-full">
          {/* Zone dots */}
          {Object.entries(zoneColors).map(([name, color]) => {
            const worldPos = ZONE_WORLD_POSITIONS[name];
            if (!worldPos) return null;
            const [zx, zy] = worldToMinimap(worldPos[0], worldPos[1]);
            return (
              <div
                key={name}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${zx}%`,
                  top: `${zy}%`,
                  backgroundColor: color,
                  transform: "translate(-50%, -50%)",
                  boxShadow: `0 0 4px ${color}`,
                }}
              />
            );
          })}
          {/* Player indicator - follows actual position */}
          <div
            className="absolute w-2.5 h-2.5 rounded-full bg-white border border-white/50 transition-all duration-100"
            style={{
              left: `${px}%`,
              top: `${py}%`,
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 6px rgba(255,255,255,0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function HUD() {
  const { activeZone, showHUD, exitZone } = useGameStore();

  return (
    <>
      {/* Controls hint - always visible */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10"
        >
          <div className="flex gap-1">
            <kbd className="w-6 h-6 flex items-center justify-center rounded bg-white/10 text-[10px] text-white/50 font-mono">W</kbd>
            <div className="flex flex-col gap-0.5">
              <div />
              <div className="flex gap-0.5">
                <kbd className="w-6 h-6 flex items-center justify-center rounded bg-white/10 text-[10px] text-white/50 font-mono">A</kbd>
                <kbd className="w-6 h-6 flex items-center justify-center rounded bg-white/10 text-[10px] text-white/50 font-mono">S</kbd>
                <kbd className="w-6 h-6 flex items-center justify-center rounded bg-white/10 text-[10px] text-white/50 font-mono">D</kbd>
              </div>
            </div>
          </div>
          <span className="text-white/30 text-[10px]">Move</span>
          <div className="w-px h-4 bg-white/10" />
          <kbd className="px-2 h-6 flex items-center justify-center rounded bg-white/10 text-[10px] text-white/50 font-mono">E</kbd>
          <span className="text-white/30 text-[10px]">Interact</span>
        </motion.div>
      </div>

      {/* Minimap */}
      <Minimap />

      {/* Zone panel */}
      <AnimatePresence>
        {showHUD && activeZone && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            className="fixed top-6 right-44 z-50 w-80 max-h-[80vh] overflow-y-auto"
          >
            <div className="rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 overflow-hidden">
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 border-b border-white/5"
                style={{ background: `linear-gradient(135deg, ${zoneColors[activeZone]}15, transparent)` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${zoneColors[activeZone]}20`, color: zoneColors[activeZone] }}
                  >
                    {zoneIcons[activeZone]}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{zoneTitles[activeZone]}</h3>
                    <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">
                      // zone active
                    </p>
                  </div>
                </div>
                <button
                  onClick={exitZone}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <HiXMark className="text-sm" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">{zonePanels[activeZone]}</div>

              {/* Footer hint */}
              <div className="px-4 pb-3">
                <p className="text-white/20 text-[10px] text-center">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono">ESC</kbd> or walk away to close
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
