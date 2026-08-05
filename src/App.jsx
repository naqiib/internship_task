import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

const NAV_LINKS = [
  { href: "#home", label: "home" },
  { href: "#about", label: "about" },
  { href: "#skills", label: "skills" },
  { href: "#projects", label: "projects" },
  { href: "#contact", label: "contact" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/naqiib" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/naqib-zakir-303711183/" },
];

const PROJECTS = [
  {
    name: "Personal Portfolio",
    file: "portfolio.jsx",
    desc: "This site — built with React and shipped through a GitHub Actions CI/CD pipeline to AWS S3.",
    tags: ["React", "AWS S3", "CI/CD"],
    link: "http://portfolionaqeeb.s3-website-us-east-1.amazonaws.com/index.html",
  },
  {
    name: "Chitral Tourism",
    file: "tourism.jsx",
    desc: "A responsive tourism site showcasing the culture and landscapes of Chitral.",
    tags: ["React", "Vercel", "Responsive"],
    link: "https://chitral-tourism.vercel.app/",
  },
  {
    name: "BookCycle",
    file: "bookcycle.jsx",
    desc: "A marketplace for buying and selling used books between students.",
    tags: ["React", "Full-Stack"],
    link: null,
  },
];

const SKILLS = [
  {
    label: "frontend/",
    items: ["React", "Vite", "JavaScript", "HTML/CSS", "Fluent UI"],
  },
  {
    label: "mobile/",
    items: ["Flutter", "Dart", "Firebase"],
  },
  {
    label: "backend & devops/",
    items: ["Node.js", "Firebase", "Supabase", "Git", "AWS S3", "GitHub Actions"],
  },
];

const TERMINAL_LINES = [
  { prompt: "$", text: "whoami" },
  { prompt: ">", text: "Naqib Ullah — Full-Stack Developer", muted: true },
  { prompt: "$", text: "cat status.txt" },
  { prompt: ">", text: "6th-semester BSIT · freelancing since 2024", muted: true },
];

function Terminal() {
  return (
    <div className="terminal">
      <div className="terminal__bar">
        <span className="dot dot--red" />
        <span className="dot dot--yellow" />
        <span className="dot dot--green" />
        <span className="terminal__title">naqib@portfolio: ~</span>
      </div>
      <div className="terminal__body">
        {TERMINAL_LINES.map((line, i) => (
          <p
            key={i}
            className={`terminal__line ${line.muted ? "terminal__line--muted" : ""}`}
            style={{ animationDelay: `${i * 0.4 + 0.3}s` }}
          >
            <span className="terminal__prompt">{line.prompt}</span> {line.text}
          </p>
        ))}
        <span className="terminal__cursor" />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__copy">
        <p className="eyebrow">// full-stack &amp; flutter developer</p>
        <h1>
          I build things
          <br />
          for the web<span className="accent">.</span>
        </h1>
        <p className="hero__lede">
          Computer Science student building production web and mobile apps —
          from client-facing React sites to Flutter apps backed by Firebase.
        </p>
        <div className="hero__actions">
          <a href="#projects" className="btn btn--primary">View Projects</a>
          <a href="#contact" className="btn btn--ghost">Get In Touch</a>
        </div>
        <div className="hero__social">
          <a href="https://github.com/naqiib" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span className="divider">/</span>
          <a href="https://www.linkedin.com/in/naqib-zakir-303711183/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
      <div className="hero__visual">
        <Terminal />
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="about">
      <p className="eyebrow">// about</p>
      <div className="about__grid">
        <p className="about__text">
          I'm a BSIT student in my final semesters, focused on full-stack web
          development, Flutter, and DevOps. Since 2024 I've been freelancing
          alongside my degree — shipping real projects for real clients,
          from Quran-education platforms to tourism sites.
        </p>
        <div className="about__stats">
          <div className="stat">
            <span className="stat__num">2024</span>
            <span className="stat__label">freelancing since</span>
          </div>
          <div className="stat">
            <span className="stat__num">6th</span>
            <span className="stat__label">semester, BSIT</span>
          </div>
          <div className="stat">
            <span className="stat__num">3+</span>
            <span className="stat__label">shipped projects</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="skills">
      <p className="eyebrow">// skills</p>
      <div className="skills__grid">
        {SKILLS.map((group) => (
          <div className="skills__group" key={group.label}>
            <h3>{group.label}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="projects">
      <p className="eyebrow">// projects</p>
      <div className="projects__grid">
        {PROJECTS.map((p) => (
          <article className="card" key={p.name}>
            <div className="card__head">
              <span className="card__file">{p.file}</span>
            </div>
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
            <div className="card__tags">
              {p.tags.map((t) => (
                <span className="tag" key={t}>{t}</span>
              ))}
            </div>
            {p.link && (
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="card__link">
                Live Demo →
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <Navbar
        brand={{ name: "naqib", dot: ".", suffix: "dev" }}
        links={NAV_LINKS}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Footer
        name="Naqib Ullah"
        year={2026}
        heading="Let's build something."
        lede="Open to freelance work and internship opportunities."
        socialLinks={SOCIAL_LINKS}
      />
    </>
  );
}

export default App;