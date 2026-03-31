gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const loader = document.getElementById("loader");
const siteShells = document.querySelectorAll(".site-shell");
const cursor = document.querySelector(".custom-cursor");
const aura = document.querySelector(".cursor-aura");
const interactiveTargets = document.querySelectorAll("a, button, .card-hover, .project-card, .hero-card, .stat-card, .skill-chip");

root.classList.add("is-loading");

function revealSite() {
  const showContent = () => {
    siteShells.forEach((node) => {
      node.style.opacity = "1";
    });
    root.classList.remove("is-loading");
  };

  if (!loader) {
    showContent();
    return;
  }

  if (prefersReduced || typeof gsap === "undefined") {
    loader.style.display = "none";
    showContent();
    return;
  }

  const timeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      loader.style.display = "none";
      showContent();
    }
  });

  timeline
    .to(".loader-backdrop", { opacity: 1, duration: 0.45 })
    .fromTo(".loader-shell", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.2")
    .fromTo(".loader-devops-mark", { opacity: 0, y: 18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, "-=0.12")
    .to(".loader-kicker", { opacity: 1, y: 0, duration: 0.35 }, "-=0.2")
    .to(".loader-title", { opacity: 1, y: 0, duration: 0.45 }, "-=0.15")
    .to(".loader-subtitle", { opacity: 1, y: 0, duration: 0.35 }, "-=0.2")
    .to(".loader-metrics", { opacity: 1, y: 0, duration: 0.35 }, "-=0.12")
    .to(".loader-bar-fill", { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, "-=0.05")
    .to(".loader-shell", { y: -10, opacity: 0, duration: 0.38, delay: 0.45 })
    .to(loader, { opacity: 0, duration: 0.42 }, "-=0.16");
}

function initCursor() {
  if (!cursor || !aura || window.matchMedia("(hover: none), (pointer: coarse)").matches) {
    document.body.style.cursor = "";
    return;
  }

  document.body.classList.add("has-custom-cursor");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let auraX = mouseX;
  let auraY = mouseY;
  let rafId = null;

  const render = () => {
    cursorX += (mouseX - cursorX) * 0.55;
    cursorY += (mouseY - cursorY) * 0.55;
    auraX += (mouseX - auraX) * 0.22;
    auraY += (mouseY - auraY) * 0.22;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(render);
  };

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    document.body.classList.add("cursor-active");
    if (!rafId) {
      render();
    }
  });

  window.addEventListener("mouseout", () => {
    document.body.classList.remove("cursor-active");
  });

  interactiveTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover");
    });
    target.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover");
    });
  });
}

revealSite();
initCursor();

// hero intro
if (!prefersReduced) {
  gsap.from("header", { y: -30, opacity: 0, duration: 1, ease: "power3.out" });
  gsap.from(".hero-card", { y: 40, opacity: 0, duration: 1.2, delay: 0.25, ease: "power4.out" });
  gsap.from("h1", { y: 40, opacity: 0, duration: 1.1, delay: 0.15, ease: "power4.out" });
  gsap.from("#home p, #home .stat-card, #home a", {
    y: 24,
    opacity: 0,
    duration: 0.9,
    stagger: 0.08,
    delay: 0.4,
    ease: "power3.out"
  });

  document.querySelectorAll(".section-reveal").forEach((section) => {
    gsap.from(section.children, {
      y: 48,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 78%",
        once: true
      }
    });
  });
}

// card mouse glow tilt
document.querySelectorAll(".card-hover, .project-card, .hero-card, .stat-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * 8;
    const ry = (px - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(34,211,238,.12), rgba(255,255,255,.04) 35%, rgba(255,255,255,.03) 65%)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.background = "";
  });
});

// particles background
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let particles = [];

function makeParticles() {
  const count = Math.min(110, Math.floor((width * height) / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r: Math.random() * 2 + 0.8
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(148, 163, 184, 0.55)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 125) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.10 * (1 - dist / 125)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  makeParticles();
});

makeParticles();
drawParticles();
