import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: "HTML5", icon: "🌐", color: "#e34f26", level: 95 },
  { name: "CSS3", icon: "🎨", color: "#1572b6", level: 92 },
  { name: "JavaScript", icon: "⚡", color: "#f7df1e", level: 90 },
  { name: "React", icon: "⚛️", color: "#61dafb", level: 88 },
  { name: "Angular", icon: "🔺", color: "#dd0031", level: 82 },
  { name: "TypeScript", icon: "📘", color: "#3178c6", level: 85 },
  { name: "ASP.NET Core", icon: "🔷", color: "#512bd4", level: 87 },
  { name: "C#", icon: "💜", color: "#9b4f96", level: 85 },
  { name: "PHP", icon: "🐘", color: "#777bb4", level: 80 },
  { name: "Bootstrap", icon: "🅱️", color: "#7952b3", level: 93 },
  { name: "Tailwind", icon: "💨", color: "#06b6d4", level: 91 },
  { name: "GSAP", icon: "🟢", color: "#88ce02", level: 78 },
];

const projects = [
  {
    title: "E-Commerce Platform",
    desc: "Full-stack online store with ASP.NET Core backend, React frontend, and C# business logic. Secure payments & real-time inventory management.",
    tags: ["React", "ASP.NET Core", "C#", "SQL Server"],
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    emoji: "🛒",
  },
  {
    title: "Enterprise CRM System",
    desc: "Angular-based CRM with TypeScript, real-time dashboards, role-based access control, and full REST API integration with PHP backend.",
    tags: ["Angular", "TypeScript", "PHP", "MySQL"],
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    emoji: "📊",
  },
  {
    title: "Real-Time Chat App",
    desc: "Modern messaging platform built with React and WebSockets. Styled beautifully with Tailwind CSS and featuring live notifications.",
    tags: ["React", "Tailwind", "JavaScript", "WebSockets"],
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    emoji: "💬",
  },
  {
    title: "Portfolio CMS",
    desc: "Custom PHP-based Content Management System with Bootstrap UI, drag-and-drop interface, and media management capabilities.",
    tags: ["PHP", "Bootstrap", "JavaScript", "MySQL"],
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    emoji: "🖥️",
  },
];

export default function App() {
  const segmentsRef = useRef([]);
  const mousePos = useRef({ x: -200, y: -200 });
  const positions = useRef(
    Array.from({ length: 24 }, () => ({ x: -200, y: -200 })),
  );
  const animFrameRef = useRef(null);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ EmailJS States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // ✅ Send Email Function
  const handleSend = () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill all required fields!");
      return;
    }

    setSending(true);

    emailjs
      .send(
        "YOUR_SERVICE_ID", // 👈 EmailJS Service ID yahan lagao
        "YOUR_TEMPLATE_ID", // 👈 EmailJS Template ID yahan lagao
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "zameermahar1405@gmail.com",
        },
        "YOUR_PUBLIC_KEY", // 👈 EmailJS Public Key yahan lagao
      )
      .then(() => {
        setSending(false);
        setSent(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSent(false), 4000);
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        setSending(false);
        alert("Message send karne mein masla hua. Dobara try karein!");
      });
  };

  // GSAP Snake Cursor
  useEffect(() => {
    const SEGMENTS = 24;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      const pos = positions.current;
      pos[0].x += (mousePos.current.x - pos[0].x) * 0.22;
      pos[0].y += (mousePos.current.y - pos[0].y) * 0.22;

      for (let i = 1; i < SEGMENTS; i++) {
        pos[i].x += (pos[i - 1].x - pos[i].x) * 0.45;
        pos[i].y += (pos[i - 1].y - pos[i].y) * 0.45;
      }

      segmentsRef.current.forEach((el, i) => {
        if (!el) return;
        const size = Math.max(4, 16 - i * 0.55);
        const opacity = Math.max(0.05, 1 - (i / SEGMENTS) * 0.9);
        const hue = 270 + i * 5;
        el.style.cssText = `
          position: fixed;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          background: radial-gradient(circle, hsl(${hue}, 100%, 85%) 0%, hsl(${hue}, 80%, 60%) 100%);
          box-shadow: ${i < 6 ? `0 0 ${12 - i * 1.5}px hsl(${hue}, 90%, 70%)` : "none"};
          transform: translate(${pos[i].x - size / 2}px, ${pos[i].y - size / 2}px);
          opacity: ${opacity};
          transition: width 0.1s, height 0.1s;
        `;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Scroll-based section detection
  useEffect(() => {
    const sections = ["home", "skills", "projects", "contact"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(
      ".hero-badge",
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
    )
      .fromTo(
        ".hero-name .line1",
        { y: 100, opacity: 0, skewY: 8 },
        { y: 0, opacity: 1, skewY: 0, duration: 1, ease: "power4.out" },
        "-=0.2",
      )
      .fromTo(
        ".hero-name .line2",
        { y: 100, opacity: 0, skewY: 8 },
        { y: 0, opacity: 1, skewY: 0, duration: 1, ease: "power4.out" },
        "-=0.7",
      )
      .fromTo(
        ".hero-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.4",
      )
      .fromTo(
        ".hero-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.3",
      )
      .fromTo(
        ".hero-btn",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power2.out" },
        "-=0.3",
      )
      .fromTo(
        ".hero-stat",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        "-=0.2",
      );

    gsap.utils.toArray(".skill-card").forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: (i % 4) * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        },
      );
    });

    gsap.utils.toArray(".project-card").forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        },
      );
    });

    gsap.utils.toArray(".section-title").forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 0.9,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 88%" },
        },
      );
    });

    gsap.fromTo(
      ".contact-card",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact-card", start: "top 85%" },
      },
    );
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      {/* Snake Cursor */}
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} ref={(el) => (segmentsRef.current[i] = el)} />
      ))}

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => scrollTo("home")}>
          ZM<span className="logo-dot">.</span>
        </div>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {["home", "skills", "projects", "contact"].map((s) => (
            <button
              key={s}
              className={`nav-btn ${activeSection === s ? "active" : ""}`}
              onClick={() => scrollTo(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="orb orb3" />
          <div className="orb orb4" />
          <div className="grid-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Available for Freelance & Full-Time
          </div>
          <h1 className="hero-name">
            <span className="line1">Zameer</span>
            <span className="line2 gradient-text">Mahar</span>
          </h1>
          <p className="hero-sub">
            Full Stack Developer · Web Architect · Problem Solver
          </p>
          <p className="hero-desc">
            I craft high-performance digital experiences using modern web
            technologies. From pixel-perfect frontends to scalable .NET
            backends.
          </p>
          <div className="hero-btns">
            <button
              className="btn-cv hero-btn"
              onClick={() => {
                const cvHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Zameer Mahar - CV</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', sans-serif; background:#fff; color:#111; padding:40px; max-width:800px; margin:auto; }
  .header { display:flex; align-items:center; gap:24px; margin-bottom:32px; padding-bottom:24px; border-bottom:3px solid #6d28d9; }
  .avatar { width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg,#6d28d9,#1d4ed8,#be185d); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.8rem; font-weight:900; flex-shrink:0; }
  .header-info h1 { font-size:2rem; font-weight:800; color:#111; }
  .header-info p { color:#6d28d9; font-weight:600; margin:4px 0; }
  .header-info .location { color:#666; font-size:0.9rem; }
  .section { margin-bottom:28px; }
  .section h2 { font-size:1rem; font-weight:700; color:#6d28d9; text-transform:uppercase; letter-spacing:2px; margin-bottom:12px; padding-bottom:6px; border-bottom:1px solid #e5e7eb; }
  .about-text { color:#444; line-height:1.75; font-size:0.95rem; }
  .skills-wrap { display:flex; flex-wrap:wrap; gap:8px; }
  .skill-chip { padding:5px 14px; background:#f3f0ff; border:1px solid #ddd6fe; border-radius:100px; font-size:0.8rem; font-weight:600; color:#5b21b6; }
  .exp-item { margin-bottom:16px; }
  .exp-item h3 { font-size:1rem; font-weight:700; color:#111; }
  .exp-item p { color:#666; font-size:0.85rem; margin:3px 0; }
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .info-item { background:#fafafa; border:1px solid #e5e7eb; border-radius:8px; padding:12px 16px; }
  .info-item .label { font-size:0.7rem; color:#999; text-transform:uppercase; letter-spacing:1px; }
  .info-item .val { font-size:0.9rem; font-weight:600; color:#111; margin-top:2px; }
  .footer-note { text-align:center; color:#999; font-size:0.8rem; margin-top:32px; padding-top:16px; border-top:1px solid #e5e7eb; }
</style>
</head>
<body>
  <div class="header">
    <div class="avatar">ZM</div>
    <div class="header-info">
      <h1>Zameer Mahar</h1>
      <p>Full Stack Developer</p>
      <span class="location">📍 Pakistan &nbsp;|&nbsp; Available for Freelance & Full-Time</span>
    </div>
  </div>
  <div class="section">
    <h2>About Me</h2>
    <p class="about-text">Passionate Full Stack Developer with expertise across the complete web stack — from building pixel-perfect React frontends to designing scalable ASP.NET Core backends. I deliver clean, maintainable, and high-performance web applications. Son of Majeed Ahmed.</p>
  </div>
  <div class="section">
    <h2>Technical Skills</h2>
    <div class="skills-wrap">
      <span class="skill-chip">HTML5</span><span class="skill-chip">CSS3</span><span class="skill-chip">JavaScript</span>
      <span class="skill-chip">React</span><span class="skill-chip">Angular</span><span class="skill-chip">TypeScript</span>
      <span class="skill-chip">ASP.NET Core</span><span class="skill-chip">C#</span><span class="skill-chip">PHP</span>
      <span class="skill-chip">Bootstrap</span><span class="skill-chip">Tailwind CSS</span><span class="skill-chip">GSAP</span>
    </div>
  </div>
  <div class="section">
    <h2>Projects</h2>
    <div class="exp-item">
      <h3>E-Commerce Platform</h3>
      <p>Full-stack online store — React frontend, ASP.NET Core backend, C# business logic, SQL Server database</p>
    </div>
    <div class="exp-item">
      <h3>Enterprise CRM System</h3>
      <p>Angular + TypeScript CRM with real-time dashboards, role-based access, PHP backend & MySQL</p>
    </div>
    <div class="exp-item">
      <h3>Real-Time Chat Application</h3>
      <p>React + WebSockets messaging app with Tailwind CSS UI and live push notifications</p>
    </div>
    <div class="exp-item">
      <h3>Portfolio CMS</h3>
      <p>Custom PHP Content Management System with Bootstrap UI and drag-and-drop media management</p>
    </div>
  </div>
  <div class="section">
    <h2>Personal Info</h2>
    <div class="info-grid">
      <div class="info-item"><div class="label">Full Name</div><div class="val">Zameer Mahar</div></div>
      <div class="info-item"><div class="label">Father's Name</div><div class="val">Majeed Ahmed</div></div>
      <div class="info-item"><div class="label">Location</div><div class="val">Pakistan 🇵🇰</div></div>
      <div class="info-item"><div class="label">Role</div><div class="val">Full Stack Developer</div></div>
    </div>
  </div>
  <p class="footer-note">Portfolio: zameermahar.dev &nbsp;|&nbsp; Built with passion for great code</p>
</body>
</html>`;
                const blob = new Blob([cvHTML], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "Zameer_Mahar_CV.html";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              <span className="cv-icon">📄</span> Download CV
            </button>
            <button
              className="btn-primary hero-btn"
              onClick={() => scrollTo("projects")}
            >
              See My Work <span className="btn-arrow">→</span>
            </button>
            <button
              className="btn-ghost hero-btn"
              onClick={() => scrollTo("contact")}
            >
              Hire Me
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-num">12+</span>
              <span className="stat-label">Technologies</span>
            </div>
            <div className="stat-sep" />
            <div className="hero-stat">
              <span className="stat-num">4+</span>
              <span className="stat-label">Projects Built</span>
            </div>
            <div className="stat-sep" />
            <div className="hero-stat">
              <span className="stat-num">∞</span>
              <span className="stat-label">Curiosity</span>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span>Scroll Down</span>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Arsenal</span>
            <h2 className="section-title">Technical Skills</h2>
            <p className="section-sub">
              Covering the full web stack — frontend, backend, and everything in
              between
            </p>
          </div>
          <div className="skills-grid">
            {skills.map((skill, i) => (
              <div
                key={i}
                className="skill-card"
                style={{ "--accent": skill.color }}
              >
                <div className="skill-glow" />
                <div className="skill-top">
                  <span className="skill-icon">{skill.icon}</span>
                  <span className="skill-pct">{skill.level}%</span>
                </div>
                <span className="skill-name">{skill.name}</span>
                <div className="skill-bar-track">
                  <div
                    className="skill-bar-fill"
                    style={{
                      width: `${skill.level}%`,
                      background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section projects-sec">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Portfolio</span>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-sub">
              Real-world applications built with passion and precision
            </p>
          </div>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <div key={i} className="project-card">
                <div
                  className="project-thumb"
                  style={{ background: p.gradient }}
                >
                  <span className="project-emoji">{p.emoji}</span>
                  <span className="project-num">0{i + 1}</span>
                </div>
                <div className="project-body">
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-tags">
                    {p.tags.map((t, j) => (
                      <span key={j} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button className="project-cta">
                    View Project <span>↗</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Let's Talk</span>
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-sub">
              Have a project? Let's build something incredible together.
            </p>
          </div>
          <div className="contact-card">
            <div className="contact-left">
              <h3 className="contact-heading">About Me</h3>
              <p className="contact-bio">
                I'm Zameer Mahar, a passionate Full Stack Developer with
                expertise across the entire web stack. Whether it's a sleek
                React UI or a robust ASP.NET Core backend — I deliver quality.
              </p>
              <div className="contact-details">
                {[
                  { icon: "👤", label: "Name", val: "Zameer Mahar" },
                  { icon: "👨‍👦", label: "Father", val: "Majeed Ahmed" },
                  { icon: "📍", label: "Location", val: "Pakistan 🇵🇰" },
                  { icon: "💼", label: "Role", val: "Full Stack Developer" },
                ].map((item, i) => (
                  <div key={i} className="detail-row">
                    <span className="detail-icon">{item.icon}</span>
                    <div>
                      <p className="detail-label">{item.label}</p>
                      <p className="detail-val">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Contact Form with EmailJS */}
            <div className="contact-right">
              <h3 className="contact-heading">Send a Message</h3>
              <div className="form-group">
                <input
                  className="form-input"
                  placeholder="Your Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  placeholder="Your Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  placeholder="Subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-input form-textarea"
                  placeholder="Your Message..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>
              <button
                className="btn-primary full-w"
                onClick={handleSend}
                disabled={sending}
              >
                {sending
                  ? "Sending... ⏳"
                  : sent
                    ? "Sent! ✅"
                    : "Send Message 🚀"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          © 2025 <span className="gradient-text">Zameer Mahar</span> · All
          rights reserved · Built with React & GSAP
        </p>
        <div className="footer-stack">
          {["React", "GSAP", "CSS3", "Vite"].map((t) => (
            <span key={t} className="footer-badge">
              {t}
            </span>
          ))}
        </div>
      </footer>
    </>
  );
}
