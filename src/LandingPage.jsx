import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import "./landing.css";

const JOURNEY_SLIDES = [
  {
    img: "/journey/01-rock-sculpture.jpg",
    num: "Chapter 01 · Research",
    title: "Ancient Rock-Cut Tirthankaras",
    caption: "From the 3rd century BCE, Tamil Brahmi inscriptions and rock-cut sculptures silently bear witness to a flourishing Jain civilisation — the oldest epigraphic heritage of Jainism in India.",
  },
  {
    img: "/journey/02-temple-hill.jpg",
    num: "Chapter 02 · Heritage",
    title: "Forgotten Temples on the Hills",
    caption: "Hilltop shrines scattered across Tamil Nadu — from Madurai to the distant heights of Chithral and Kalugumalai — stood as strongholds of the Jain faith for two millennia.",
  },
  {
    img: "/journey/03-team-group.jpg",
    num: "Chapter 03 · The Team",
    title: "23 Days in the Field",
    caption: "From 17 December to 8 January the GEO Jainism team trekked to remote locations, reaching sites no camera had reached before — documenting every inscription in 4K.",
  },
  {
    img: "/journey/04-hillside.jpg",
    num: "Chapter 04 · Journey",
    title: "Fifty Hills. One Mission.",
    caption: "50+ hills climbed across Tamil Nadu to capture Jain cave shelters, rock-cut figures, and hilltop shrines that have silently watched centuries pass.",
  },
  {
    img: "/journey/05-rock-carvings.jpg",
    num: "Chapter 05 · Discovery",
    title: "Intricate Stone Carvings",
    caption: "Spectacular Jain rock-cut sculptures survive across the landscape — many converted to worship other deities, their original identity slowly being erased.",
  },
  {
    img: "/journey/06-sheep-site.jpg",
    num: "Chapter 06 · Timeless",
    title: "Heritage & Everyday Life",
    caption: "Grazing flocks pass by sacred stones — a quiet reminder of how ancient Jain monuments have become a living part of the Tamil countryside itself.",
  },
  {
    img: "/journey/07-stone-carving.jpg",
    num: "Chapter 07 · Artistry",
    title: "The Artistry of Jain Masters",
    caption: "Complex carvings depicting Tirthankaras, yakshas and celestial attendants — preserved in stone for over a thousand years, largely unknown to the outside world.",
  },
  {
    img: "/journey/08-community.jpg",
    num: "Chapter 08 · Community",
    title: "The Elders Who Remember",
    caption: "Only 25,000–35,000 Tamil Jains remain. We interviewed 50+ elders, priests and scholars — sharing the living memory of a fading tradition before it vanishes.",
  },
  {
    img: "/journey/09-temple.jpg",
    num: "Chapter 09 · Heritage",
    title: "Samanakovil, Vijayamangalam",
    caption: "The iconic Digambar Jain temple of Vijayamangalam — one of Tamil Nadu's great surviving Jain heritage centres, standing resilient through centuries of change.",
  },
  {
    img: "/journey/10-founder-research.jpg",
    num: "Chapter 10 · Vision",
    title: "On-Field Documentation",
    caption: "Founder Kavi Sajal Jain examines ancient stonework by torchlight — the quiet, painstaking fieldwork at the heart of everything GEO Jainism does.",
  },
];

const COURSES = [
  {
    tag: "Tamil Nadu",
    title: "Tamil Jain Heritage: A 2,000-Year Journey",
    desc: "Trace the evolution of Jainism in Tamil Nadu from the 3rd century BCE Brahmi inscriptions through the Sangam golden age to modern times — including 111 documented sites.",
    meta: "10 Episodes · 4K",
    cta: "Start Learning",
    img: "/journey/01-rock-sculpture.jpg",
  },
  {
    tag: "Literature",
    title: "Naldiyar & Rare Jain Manuscripts",
    desc: "The oldest Tamil text — written by 8,000 Jain monks. Explore Naldiyar, Silappadikaram, Ratnakara, and the literary soul of Tamil Jainism that shaped an entire civilisation.",
    meta: "6 Episodes · Subtitled",
    cta: "Start Learning",
    img: "/journey/07-stone-carving.jpg",
  },
  {
    tag: "Across Borders",
    title: "Jain History in Pakistan",
    desc: "From the Anarkali Jain Temple of Lahore to Rawalpindi's Jain Kanya Pathshala and the abandoned shrines of Multan — a documented journey into erased heritage.",
    meta: "8 Episodes · HD",
    cta: "Explore",
    img: "/journey/09-temple.jpg",
  },
  {
    tag: "10 Wonders",
    title: "The Jain Wonders of India",
    desc: "Ranthambore · Kumbhalgadh · Bijoliya · Chittorgarh · Ladnun — ten architectural marvels of Jain heritage you have never heard of, filmed on location in cinematic 4K.",
    meta: "10 Episodes · 4K",
    cta: "Start Learning",
    img: "/journey/04-hillside.jpg",
  },
  {
    tag: "Karnataka · Kerala",
    title: "Jain Virasat in South India",
    desc: "From Gulbarga's lost Jain temples to Kerala's near-forgotten Jain past — field research across Karnataka, Andhra Pradesh, Kerala, Telangana and Goa.",
    meta: "7 Episodes · Field",
    cta: "Explore",
    img: "/journey/02-temple-hill.jpg",
  },
  {
    tag: "Queens & Kings",
    title: "Rani Chennabhairadevi: The Pepper Queen",
    desc: "The untold story of India's longest-reigning Jain queen — a 54-year rule that controlled the global pepper trade and shielded Jain communities for generations.",
    meta: "Feature Episode · 4K",
    cta: "Watch Story",
    img: "/journey/05-rock-carvings.jpg",
  },
];

const BLOGS = [
  {
    cat: "Featured",
    date: "Jan · 2026",
    title: "The Lost Jain Temples of Gulbarga — On Camera for the First Time",
    excerpt: "A 10-minute journey into the forgotten Jain monuments of Karnataka — ancient structures that have waited centuries for the world to notice them. Captured on camera for the very first time.",
    img: "/journey/09-temple.jpg",
    featured: true,
  },
  {
    cat: "Research",
    date: "Dec · 2025",
    title: "Naldiyar: 8,000 Jain Monks, One Ancient Tamil Text",
    excerpt: "Inside the Naldiyar — arguably the oldest Tamil scripture, composed by a community of 8,000 Jain monks. A deep dive into its authorship, verses, and lasting influence.",
    img: "/journey/07-stone-carving.jpg",
  },
  {
    cat: "Heritage",
    date: "Nov · 2025",
    title: "Rani Chennabhairadevi: The Pepper Queen of India",
    excerpt: "A 54-year reign, a global pepper trade, and a Jain queen history almost forgot. The extraordinary story of one of India's most powerful yet least-known monarchs.",
    img: "/journey/05-rock-carvings.jpg",
  },
];

export default function LandingPage() {
  const bgCanvasRef = useRef(null);
  const auraCanvasRef = useRef(null);
  const idolRef = useRef(null);
  const navbarRef = useRef(null);
  const progressRef = useRef(null);
  const rootRef = useRef(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const slideIdxRef = useRef(0);
  const carouselRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("gj-theme") || "light"; } catch { return "light"; }
  });

  useEffect(() => {
    try { localStorage.setItem("gj-theme", theme); } catch {}
  }, [theme]);

  /* ─────────── JOURNEY CAROUSEL: auto-advance + GSAP intro ─────────── */
  useEffect(() => {
    slideIdxRef.current = slideIdx;
  }, [slideIdx]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let interval;
    let paused = false;
    const start = () => {
      stop();
      interval = setInterval(() => {
        if (!paused) setSlideIdx((i) => (i + 1) % JOURNEY_SLIDES.length);
      }, 6000);
    };
    const stop = () => { if (interval) clearInterval(interval); };

    // Only auto-advance when section in view
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      stop();
      io.disconnect();
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ─────────── LENIS SMOOTH SCROLL (slow & premium) ─────────── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // anchor links
    const handleAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: -40, duration: 1.4 });
        }
      }
    };
    document.addEventListener("click", handleAnchor);

    return () => {
      document.removeEventListener("click", handleAnchor);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  /* ─────────── BACKGROUND THREE.JS (original scene preserved) ─────────── */
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const COLORS = [0xF4A535, 0xF2C4CE, 0xC8DFC0, 0xF7D580, 0xF5C842, 0xE8D5B0, 0xD8EEF5, 0xF08030];

    /* Mandala rings */
    const mandalas = [];
    for (let r = 0; r < 4; r++) {
      const segments = 60 + r * 20;
      const radius = 1.5 + r * 1.2;
      const pts = [];
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const wobble = 0.05 * Math.sin(8 * a);
        pts.push(new THREE.Vector3((radius + wobble) * Math.cos(a), (radius + wobble) * Math.sin(a), 0));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: COLORS[r % COLORS.length], opacity: 0.12 + r * 0.04, transparent: true });
      const ring = new THREE.Line(geo, mat);
      ring.position.z = -3;
      scene.add(ring);
      mandalas.push({ line: ring, speed: 0.0008 + r * 0.0003, dir: r % 2 === 0 ? 1 : -1 });
    }

    /* Lotus petals */
    function createPetal(angle, radius, color) {
      const shape = new THREE.Shape();
      const r = 0.18;
      shape.moveTo(0, 0);
      shape.bezierCurveTo(r, r * 2, r * 2, r * 3, 0, r * 4);
      shape.bezierCurveTo(-r * 2, r * 3, -r, r * 2, 0, 0);
      const geo = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = radius * Math.cos(angle);
      mesh.position.y = radius * Math.sin(angle);
      mesh.rotation.z = angle + Math.PI / 2;
      mesh.position.z = -2;
      return mesh;
    }
    const petalGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      petalGroup.add(createPetal(angle, 1.0, COLORS[i % COLORS.length]));
    }
    scene.add(petalGroup);

    /* Particles */
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleData = [];
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 4;
      particleData.push({
        driftX: (Math.random() - 0.5) * 0.001,
        driftY: 0.003 + Math.random() * 0.005,
      });
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xF4A535, size: 0.06, transparent: true, opacity: 0.4, sizeAttenuation: true });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* Tori */
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(2.8, 0.012, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0xF4A535, transparent: true, opacity: 0.18 })
    );
    torus.position.z = -2;
    scene.add(torus);

    const torus2 = new THREE.Mesh(
      new THREE.TorusGeometry(4.0, 0.008, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0xF7D580, transparent: true, opacity: 0.1 })
    );
    torus2.rotation.x = Math.PI / 4;
    torus2.position.z = -4;
    scene.add(torus2);

    /* Polyhedra */
    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.6, 1),
      new THREE.MeshBasicMaterial({ color: 0xF4A535, wireframe: true, transparent: true, opacity: 0.12 })
    );
    ico.position.set(4, 2, -1);
    scene.add(ico);
    const ico2 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.4, 1),
      new THREE.MeshBasicMaterial({ color: 0xF2C4CE, wireframe: true, transparent: true, opacity: 0.15 })
    );
    ico2.position.set(-4.5, -2, -1.5);
    scene.add(ico2);
    const oct = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.45),
      new THREE.MeshBasicMaterial({ color: 0xC8DFC0, wireframe: true, transparent: true, opacity: 0.14 })
    );
    oct.position.set(-3, 3, -2);
    scene.add(oct);

    let time = 0;
    const mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    let visible = !document.hidden;
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!visible) return;
      time += 0.01;
      mandalas.forEach((m) => (m.line.rotation.z += m.speed * m.dir));
      petalGroup.rotation.z = time * 0.08;
      petalGroup.children.forEach((p, i) => (p.material.opacity = 0.1 + 0.08 * Math.sin(time * 0.5 + i)));
      torus.rotation.z = time * 0.15;
      torus2.rotation.y = time * 0.06;
      torus2.rotation.z = time * 0.04;
      ico.rotation.x = time * 0.3;
      ico.rotation.y = time * 0.2;
      ico2.rotation.x = -time * 0.25;
      ico2.rotation.z = time * 0.18;
      oct.rotation.y = time * 0.35;
      oct.rotation.x = time * 0.2;

      const pos = particles.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        pos.array[i * 3 + 1] += particleData[i].driftY * 0.3;
        pos.array[i * 3] += particleData[i].driftX;
        if (pos.array[i * 3 + 1] > 12) {
          pos.array[i * 3 + 1] = -12;
          pos.array[i * 3] = (Math.random() - 0.5) * 20;
        }
      }
      pos.needsUpdate = true;

      const scrollY = window.scrollY;
      const scrollProgress = scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
      camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 0.2 - camera.position.y + scrollProgress * -2) * 0.03;
      camera.position.z = 8 - scrollProgress * 2;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.dispose();
    };
  }, []);

  /* ─────────── HERO AURA THREE.JS (multi-layer divine aura on right) ─────────── */
  useEffect(() => {
    const canvas = auraCanvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    let width = parent.clientWidth;
    let height = parent.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);

    const group = new THREE.Group();
    scene.add(group);

    /* Aura layered rings (Three.js Line loops) with depth */
    const auraRings = [];
    const ringColors = [0xF4A535, 0xF7D580, 0xF2C4CE, 0xF5C842, 0xE8A820, 0xC8DFC0, 0xFDECC8, 0xF08030];
    for (let r = 0; r < 8; r++) {
      const segments = 160;
      const radius = 1.9 + r * 0.24;
      const pts = [];
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const wobble = 0.04 * Math.sin(6 * a + r);
        pts.push(new THREE.Vector3((radius + wobble) * Math.cos(a), (radius + wobble) * Math.sin(a), -r * 0.08));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: ringColors[r % ringColors.length],
        transparent: true,
        opacity: 0.32 - r * 0.025,
      });
      const ring = new THREE.Line(geo, mat);
      group.add(ring);
      auraRings.push({ ring, speed: 0.0015 + r * 0.0005, dir: r % 2 === 0 ? 1 : -1, base: 0.32 - r * 0.025 });
    }

    /* Depth: 3D wireframe torus ring (tilted) */
    const depthTorus = new THREE.Mesh(
      new THREE.TorusGeometry(2.6, 0.02, 6, 120),
      new THREE.MeshBasicMaterial({ color: 0xF4A535, transparent: true, opacity: 0.4 })
    );
    depthTorus.rotation.x = Math.PI / 3;
    depthTorus.position.z = -0.4;
    group.add(depthTorus);

    const depthTorus2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.015, 6, 120),
      new THREE.MeshBasicMaterial({ color: 0xF7D580, transparent: true, opacity: 0.3 })
    );
    depthTorus2.rotation.x = -Math.PI / 4;
    depthTorus2.rotation.y = Math.PI / 6;
    depthTorus2.position.z = -0.6;
    group.add(depthTorus2);


    /* Glowing disc sprites stacked to create soft halo */
    function createHaloSprite(color, size, opacity) {
      const c = document.createElement("canvas");
      c.width = 256; c.height = 256;
      const ctx = c.getContext("2d");
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      const hex = "#" + color.toString(16).padStart(6, "0");
      grad.addColorStop(0, hex);
      grad.addColorStop(0.4, hex + "88");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
      const sp = new THREE.Sprite(mat);
      sp.scale.set(size, size, 1);
      return sp;
    }
    const halo1 = createHaloSprite(0xF4A535, 7.5, 0.35);
    halo1.position.z = -0.2;
    group.add(halo1);
    const halo2 = createHaloSprite(0xF7D580, 5.0, 0.45);
    halo2.position.z = -0.1;
    group.add(halo2);
    const halo3 = createHaloSprite(0xFDECC8, 3.2, 0.55);
    group.add(halo3);

    /* Particles (diyas rising) around aura */
    const partCount = 50;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    const partData = [];
    for (let i = 0; i < partCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.2 + Math.random() * 2.0;
      partPos[i * 3] = Math.cos(a) * r;
      partPos[i * 3 + 1] = Math.sin(a) * r;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
      partData.push({
        angle: a,
        radius: r,
        speed: 0.0006 + Math.random() * 0.0012,
        rise: 0.001 + Math.random() * 0.003,
      });
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));

    /* Custom soft-dot texture for particles */
    const dotC = document.createElement("canvas");
    dotC.width = 64; dotC.height = 64;
    const dctx = dotC.getContext("2d");
    const dg = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    dg.addColorStop(0, "rgba(255,220,140,1)");
    dg.addColorStop(0.4, "rgba(244,165,53,0.7)");
    dg.addColorStop(1, "rgba(244,165,53,0)");
    dctx.fillStyle = dg;
    dctx.fillRect(0, 0, 64, 64);
    const dotTex = new THREE.CanvasTexture(dotC);

    const partMat = new THREE.PointsMaterial({
      size: 0.14,
      map: dotTex,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(partGeo, partMat);
    group.add(points);

    /* Outer subtle mandala lotus petals */
    const lotus = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const shape = new THREE.Shape();
      const rr = 0.25;
      shape.moveTo(0, 0);
      shape.bezierCurveTo(rr, rr * 2, rr * 2, rr * 3, 0, rr * 4);
      shape.bezierCurveTo(-rr * 2, rr * 3, -rr, rr * 2, 0, 0);
      const g = new THREE.ShapeGeometry(shape);
      const m = new THREE.MeshBasicMaterial({
        color: ringColors[i % ringColors.length],
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
      });
      const petal = new THREE.Mesh(g, m);
      const R = 3.3;
      petal.position.set(Math.cos(angle) * R, Math.sin(angle) * R, -0.3);
      petal.rotation.z = angle + Math.PI / 2;
      petal.scale.set(1.2, 1.2, 1);
      lotus.add(petal);
    }
    group.add(lotus);

    /* Slow pulsing via GSAP */
    gsap.to(group.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(halo1.material, { opacity: 0.55, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(halo2.material, { opacity: 0.7, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });

    let t = 0;
    let rafId;
    let visible = !document.hidden;
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    /* IntersectionObserver — pause when hero out of view */
    let inView = true;
    const io = new IntersectionObserver(
      ([entry]) => { inView = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    if (parent) io.observe(parent);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!visible || !inView) return;
      t += 0.01;

      auraRings.forEach((a) => {
        a.ring.rotation.z += a.speed * a.dir;
        a.ring.material.opacity = a.base + 0.08 * Math.sin(t * 0.7 + a.ring.rotation.z);
      });
      lotus.rotation.z = t * 0.04;
      depthTorus.rotation.z += 0.002;
      depthTorus.rotation.y = Math.sin(t * 0.4) * 0.3;
      depthTorus2.rotation.z -= 0.0015;
      depthTorus2.rotation.x = -Math.PI / 4 + Math.cos(t * 0.3) * 0.2;

      const pos = points.geometry.attributes.position;
      for (let i = 0; i < partCount; i++) {
        partData[i].angle += partData[i].speed;
        partData[i].radius += partData[i].rise * 0.3;
        if (partData[i].radius > 4.5) {
          partData[i].radius = 2.2;
          partData[i].angle = Math.random() * Math.PI * 2;
        }
        pos.array[i * 3] = Math.cos(partData[i].angle) * partData[i].radius;
        pos.array[i * 3 + 1] = Math.sin(partData[i].angle) * partData[i].radius;
      }
      pos.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      renderer.dispose();
    };
  }, []);

  /* ─────────── SCROLL EFFECTS: navbar + progress + reveal ─────────── */
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = scrollY / Math.max(maxScroll, 1);
      if (progressRef.current) progressRef.current.style.width = progress * 100 + "%";
      if (navbarRef.current) navbarRef.current.classList.toggle("scrolled", scrollY > 60);

      document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88) el.classList.add("visible");
      });
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-root" data-theme={theme} ref={rootRef}>
      <div id="progress-bar" ref={progressRef}></div>
      <canvas id="three-canvas" ref={bgCanvasRef}></canvas>

      {/* Theme Toggle */}
      <button
        className="theme-toggle"
        data-testid="theme-toggle"
        aria-label="Toggle dark mode"
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      >
        {theme === "dark" ? (
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
        )}
      </button>

      {/* NAVBAR */}
      <nav id="navbar" ref={navbarRef}>
        <div className="nav-logo">GEO JAINISM</div>
        <div className="nav-links">
          <a href="#story">Story</a>
          <a href="#heritage">Heritage</a>
          <a href="#courses">Courses</a>
          <a href="#journey">Journey</a>
          <a href="#trailer">Trailer</a>
          <a href="#blogs">Articles</a>
          <a href="#support">Support</a>
        </div>
        <a href="#support" className="nav-cta">Watch Documentary</a>
      </nav>

      {/* HERO — Enhanced */}
      <section id="hero">
        <div className="hero-left">
          <div className="hero-sanskrit">ॐ ह्रीं श्रीं</div>
          <div className="hero-eyebrow">GEO Jainism · Film 2026</div>
          <h1 className="hero-title">Tamil<br/><span>Jain</span></h1>
          <div className="hero-subtitle">Minority Within A Minority</div>
          <p className="hero-tagline">A cinematic documentary unearthing 2,000 years of hidden Jain heritage across Tamil Nadu — 111 ancient sites, 50+ hills, one mission.</p>
          <div className="hero-cta-row">
            <a href="#trailer" className="hero-btn-primary" data-testid="hero-watch-trailer">▶ Watch Trailer</a>
            <a href="#support" className="hero-btn-ghost" data-testid="hero-support-btn">Support the Film</a>
          </div>
          <div className="hero-badge">
            <div className="badge-item"><span className="badge-num">111</span><span className="badge-label">Ancient Sites</span></div>
            <div className="badge-item"><span className="badge-num">50+</span><span className="badge-label">Hills Climbed</span></div>
            <div className="badge-item"><span className="badge-num">4K</span><span className="badge-label">Documentation</span></div>
            <div className="badge-item"><span className="badge-num">2hrs</span><span className="badge-label">Epic Film</span></div>
          </div>
        </div>

        <div className="hero-right">
          <canvas id="aura-canvas" ref={auraCanvasRef}></canvas>
          <div className="aura-glow"></div>
          <div className="aura-ray a1"></div>
          <div className="aura-ray a2"></div>
          <div className="aura-ray a3"></div>
          <div className="aura-ray a4"></div>
          <div className="aura-ring r4"></div>
          <div className="aura-ring r3"></div>
          <div className="aura-ring r2"></div>
          <div className="aura-ring r1"></div>
          <div className="orbit-dot o1"></div>
          <div className="orbit-dot o2"></div>
          <div className="orbit-dot o3"></div>
          <div className="orbit-dot o4"></div>
          <div className="tirthankar-wrap" ref={idolRef}>
            <img src="/mahavira.png" alt="Jain Tirthankar" className="tirthankar-img" />
          </div>
          <div className="mantra-quote">अहिंसा परमो धर्मः</div>
        </div>

        <div className="scroll-hint">
          <span className="scroll-text">Scroll to explore</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* MANDALA DIVIDER */}
      <div className="mandala-divider">
        <div className="mandala-line"></div>
        <div className="mandala-dot"></div>
        <div className="mandala-dot" style={{ width: 14, height: 14, background: "var(--marigold)" }}></div>
        <div className="mandala-dot"></div>
        <div className="mandala-line"></div>
      </div>

      {/* STORY */}
      <section id="story" className="section story-section">
        <div className="reveal-left">
          <div className="story-label">The Beginning</div>
          <h2 className="story-heading">A Heritage<br/><em>Lost in Time</em></h2>
          <p className="story-body">In the heart of Tamil Nadu, carved into ancient rock faces and scattered across jungle-covered hills, lies one of the world's oldest yet most overlooked spiritual traditions — Tamil Jainism.</p>
          <p className="story-body" style={{ marginTop: 16 }}>Dating back to the 3rd century BCE, Tamil Brahmi inscriptions bear witness to a flourishing Jain civilisation that shaped the very alphabet, literature, and soul of Tamil culture. Yet today, only 25,000–35,000 Tamil Jains remain.</p>
          <p className="story-body" style={{ marginTop: 16 }}>GEO Jainism's landmark documentary sets out to document what remains — before it vanishes forever.</p>
        </div>
        <div className="story-visual reveal-right">
          <div className="stone-card">
            <div className="stone-icon">🪨</div>
            <p className="stone-quote">"Tamil Brahmi inscriptions — among the most ancient Jain epigraphic heritage in all of India"</p>
            <span className="stone-attr">3rd Century BCE · Tamil Nadu</span>
          </div>
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: 20, borderRadius: 14, background: "rgba(200,223,192,0.3)", border: "1px solid rgba(125,175,110,0.3)", textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "var(--tulsi-deep)", fontWeight: 600 }}>1000+</div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--deep-brown)", opacity: 0.6, marginTop: 4 }}>Jain Inscriptions</div>
            </div>
            <div style={{ padding: 20, borderRadius: 14, background: "rgba(242,196,206,0.3)", border: "1px solid rgba(232,144,159,0.3)", textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "var(--lotus-deep)", fontWeight: 600 }}>450+</div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--deep-brown)", opacity: 0.6, marginTop: 4 }}>Jain Sites</div>
            </div>
          </div>
        </div>
        <div className="om-decoration">ॐ</div>
      </section>

      {/* STATS */}
      <div className="stats-strip">
        <div className="stat-card reveal"><div className="stat-num">111</div><div className="stat-label">Ancient Sites Documented</div></div>
        <div className="stat-card reveal"><div className="stat-num">50<span className="stat-unit">+</span></div><div className="stat-label">Hills & Mountains Climbed</div></div>
        <div className="stat-card reveal"><div className="stat-num">10<span className="stat-unit">+</span></div><div className="stat-label">Converted Sites Recorded</div></div>
        <div className="stat-card reveal"><div className="stat-num">23</div><div className="stat-label">Days of Field Shooting</div></div>
      </div>

      {/* TIMELINE */}
      <section id="heritage" className="section timeline-section">
        <div className="section-header reveal">
          <div className="section-sub">Historical Journey</div>
          <h2 className="section-title">2,000 Years of<br/>Jain Presence in Tamil Nadu</h2>
        </div>
        <div className="timeline">
          <div className="tl-item reveal">
            <div className="tl-content">
              <div className="tl-date">3rd Century BCE</div>
              <div className="tl-title">Tamil Brahmi Inscriptions</div>
              <div className="tl-body">Among India's most ancient Jain epigraphic heritage. The Valmiki Ramayana (8th century BCE) mentions Jain monks in Tamil Nadu, predating even Bhadrabahu and Vishakhacharya's traditions.</div>
            </div>
            <div className="tl-dot"></div>
            <div className="tl-image">
              <img src="/journey/01-rock-sculpture.jpg" alt="Tamil Brahmi rock inscriptions" loading="lazy" />
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-image">
              <img src="/journey/07-stone-carving.jpg" alt="Sangam era Jain carving" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
            <div className="tl-content">
              <div className="tl-date">Sangam Era · 300 BCE – 300 CE</div>
              <div className="tl-title">The Golden Age of Tamil Jainism</div>
              <div className="tl-body">Jain acharyas and poets shaped Tamil literature and society profoundly. The tradition guided the evolution of script from Brahmi → Vatteluttu → Modern Tamil, making an unparalleled contribution to the written word.</div>
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-content">
              <div className="tl-date">Chola, Pallava, Pandya, Chera Dynasties</div>
              <div className="tl-title">Temples, Inscriptions & Literature</div>
              <div className="tl-body">Across multiple dynasties, Jainism received both patronage and faced challenges. Extensive development of Jain temples, rock-cut sculptures, and literary works left a permanent mark on history.</div>
            </div>
            <div className="tl-dot"></div>
            <div className="tl-image">
              <img src="/journey/09-temple.jpg" alt="Dynastic era Jain temples" loading="lazy" />
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-image">
              <img src="/journey/05-rock-carvings.jpg" alt="Vijayanagara era rock carvings" loading="lazy" />
            </div>
            <div className="tl-dot"></div>
            <div className="tl-content">
              <div className="tl-date">Vijayanagara Empire · 14th–17th CE</div>
              <div className="tl-title">Continued Presence & Struggle</div>
              <div className="tl-body">Jain dharma survived through sacred caves, hilltop shrines, and oral traditions. Ancient Jain sites from Madurai to Chithral and Kalugumali stood as enduring strongholds of the faith.</div>
            </div>
          </div>
          <div className="tl-item reveal">
            <div className="tl-content">
              <div className="tl-date">Present Day</div>
              <div className="tl-title">A Community on the Edge</div>
              <div className="tl-body">Only ~25,000–35,000 Tamil Jains remain. Over 400+ sites lie neglected — buried in bushes, fields, and forgotten caves. Cultural appropriation erases what little identity survives. GEO Jainism documents it all.</div>
            </div>
            <div className="tl-dot" style={{ background: "var(--lotus-deep)" }}></div>
            <div className="tl-image">
              <img src="/journey/08-community.jpg" alt="Present-day Tamil Jain community" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* CHALLENGES */}
      <section id="challenges" className="section challenges-section">
        <div className="section-header reveal">
          <div className="section-sub">Current Challenges</div>
          <h2 className="section-title">What This Documentary<br/>Fights Against</h2>
        </div>
        <div className="challenges-grid">
          {[
            ["01", "Rapid Population Decline", "Only ~25,000–35,000 Tamil Jains remain today. This ancient community has reached near-endangered status, a civilisation teetering on the edge of extinction."],
            ["02", "Heritage Neglect", "450+ Jain sites exist in Tamil Nadu. Only a handful are protected. The rest — caves, sculptures, cave murals and manuscripts — lie buried in bushes or open fields, decaying without witness."],
            ["03", "Cultural Appropriation", "Many Jain temples have been converted to worship local deities. Through redefinition and occupation, the identity of these sacred spaces is being systematically erased."],
            ["04", "Global Invisibility", "Most people — in India and abroad — are completely unaware that Jainism had a deep and foundational presence in Tamil Nadu. Recognition and representation are both severely lacking."],
            ["05", "Economic Hardship", "Most Tamil Jain families depend on subsistence agriculture as marginal or small farmers. Poverty is a significant barrier to community development, education, and cultural preservation."],
            ["06", "No Prior Documentation", "This is the first-ever comprehensive 4K video documentation of Tamil Jain heritage — 111 sites, every inscription captured. The most extensive data collection initiative in Tamil Jain history."],
          ].map(([n, t, b]) => (
            <div className="challenge-card reveal" key={n}>
              <div className="challenge-num">{n}</div>
              <div className="challenge-title">{t}</div>
              <div className="challenge-body">{b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOOTING */}
      <section className="section shooting-section">
        <div className="section-header reveal">
          <div className="section-sub">The Shooting Phase</div>
          <h2 className="section-title">23 Days.<br/>111 Sacred Sites.<br/>One Historic Mission.</h2>
          <p style={{ fontSize: 15, color: "var(--ink)", opacity: 0.6, maxWidth: 560, margin: "20px auto 0", lineHeight: 1.8 }}>From 17 December to 8 January, the GEO Jainism team trekked to remote locations across Tamil Nadu — from Madurai to distant Chithral and Kalugumala — capturing what no camera had ever captured before.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card reveal">
            <span className="feature-icon">🏔️</span>
            <div className="feature-title">50+ Hills Climbed</div>
            <div className="feature-body">Scaling mountain ranges to document Jain cave shelters, hilltop shrines, and rock-cut Tirthankara figures that have silently watched centuries pass.</div>
          </div>
          <div className="feature-card reveal">
            <span className="feature-icon">🎙️</span>
            <div className="feature-title">50+ Interviews</div>
            <div className="feature-body">Tamil language interviews conducted and translated — with elders, priests, scholars, and community members sharing living memory of a fading tradition.</div>
          </div>
          <div className="feature-card reveal">
            <span className="feature-icon">🎵</span>
            <div className="feature-title">Folk Music Preserved</div>
            <div className="feature-body">Rare Tamil Jain folk songs and oral traditions recorded for the first time — preserving the intangible cultural heritage that no archive had ever captured.</div>
          </div>
        </div>
      </section>

      {/* POST PRODUCTION */}
      <section className="section post-section">
        <div className="reveal-left">
          <div className="story-label">Post Production</div>
          <h2 className="story-heading">History<br/><em>Brought to Life</em></h2>
          <p className="story-body">3 months of intensive scripting and editing — condensing 2,000 years of Tamil Nadu's Jain history into a powerful 2-hour cinematic experience.</p>
          <p className="story-body" style={{ marginTop: 16 }}>The documentary features 3D animation, VFX, and timeline graphics bringing ancient epics and temple architectures to life with a cinematic quality befitting this extraordinary history.</p>
          <div className="history-pills">
            {["Sangam Era Jainism", "Chola Dynasty", "Pallava Kingdom", "Pandya Rulers", "Vijayanagara Empire", "Rock-cut Sculptures", "Tamil Brahmi Scripts"].map((p) => (
              <span className="pill" key={p}>{p}</span>
            ))}
          </div>
        </div>
        <div className="post-visual reveal-right">
          <div className="epoch-card">
            <div className="epoch-era">Ancient · Sangam Era</div>
            <div className="epoch-title">Jain Influence on Tamil Script</div>
            <div className="epoch-body">Tamil Jain tradition drove the evolution from Brahmi → Vatteluttu → Modern Tamil, making an extraordinary contribution to the development of one of the world's oldest living scripts.</div>
          </div>
          <div className="epoch-card" style={{ borderLeftColor: "var(--lotus-deep)" }}>
            <div className="epoch-era" style={{ color: "var(--lotus-deep)" }}>Medieval · Chola Period</div>
            <div className="epoch-title">Temples & Rock-Cut Monuments</div>
            <div className="epoch-body">Spectacular Jain temples and cave monasteries were carved across Tamil Nadu — many surviving today, largely unknown to the outside world, waiting to be rediscovered.</div>
          </div>
          <div className="epoch-card" style={{ borderLeftColor: "var(--tulsi-deep)" }}>
            <div className="epoch-era" style={{ color: "var(--tulsi-deep)" }}>Literary · Jain Contribution</div>
            <div className="epoch-title">Naldiyar & Rare Manuscripts</div>
            <div className="epoch-body">A book written by 8,000 Jain monks — the Naldiyar — is one of the oldest Tamil texts. GEO Jainism's first video on this topic received 24K+ views, revealing the hunger for this lost knowledge.</div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="section courses-section">
        <div className="section-header reveal">
          <div className="section-sub">Learning Hub</div>
          <h2 className="section-title">Explore Jain<br/>Heritage Courses</h2>
          <p style={{ fontSize: 15, color: "var(--ink)", opacity: 0.65, maxWidth: 560, margin: "20px auto 0", lineHeight: 1.8 }}>
            Dive deeper into the rich, often-overlooked world of Jain history, literature, and culture — through structured, research-based series crafted by GEO Jainism.
          </p>
        </div>
        <div className="courses-grid">
          {COURSES.map((c) => (
            <article className="course-card reveal" key={c.title} data-testid={`course-card-${c.tag.toLowerCase().replace(/\s/g, "-")}`}>
              <div className="course-img-wrap">
                <img src={c.img} alt={c.title} loading="lazy" />
                <span className="course-img-tag">{c.tag}</span>
              </div>
              <div className="course-body">
                <h3 className="course-title">{c.title}</h3>
                <p className="course-desc">{c.desc}</p>
                <div className="course-meta"><span>{c.meta}</span></div>
                <a href="https://www.youtube.com/@geo_jainism" target="_blank" rel="noreferrer" className="course-cta" data-testid={`course-cta-${c.tag.toLowerCase().replace(/\s/g, "-")}`}>{c.cta} →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* JOURNEY CAROUSEL */}
      <section id="journey" className="journey-section" ref={carouselRef}>
        <div className="journey-header">
          <div className="section-sub">The Journey</div>
          <h2 className="section-title">Through Hills,<br/>Stone &amp; Story</h2>
          <p className="journey-sub-desc">
            Ten chapters from a 23-day expedition across Tamil Nadu — the ancient sites, the people, the silent stones that have waited two millennia to be seen.
          </p>
        </div>

        <div className="journey-carousel">
          <button
            className="journey-nav prev"
            data-testid="journey-prev"
            onClick={() => setSlideIdx((i) => (i - 1 + JOURNEY_SLIDES.length) % JOURNEY_SLIDES.length)}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <div className="journey-track-wrap">
            <div className="journey-track" style={{ transform: `translateX(-${slideIdx * 100}%)` }}>
              {JOURNEY_SLIDES.map((s, i) => (
                <div className={`journey-slide ${i === slideIdx ? "active" : ""}`} key={s.img}>
                  <img src={s.img} alt={s.title} loading={i === 0 ? "eager" : "lazy"} />
                  <div className="journey-overlay">
                    <div className="journey-slide-num">{s.num}</div>
                    <h3 className="journey-slide-title"><em>{s.title}</em></h3>
                    <p className="journey-slide-caption">{s.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="journey-nav next"
            data-testid="journey-next"
            onClick={() => setSlideIdx((i) => (i + 1) % JOURNEY_SLIDES.length)}
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        <div className="journey-indicators" data-testid="journey-indicators">
          {JOURNEY_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`journey-dot ${i === slideIdx ? "active" : ""}`}
              onClick={() => setSlideIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              data-testid={`journey-dot-${i}`}
            />
          ))}
        </div>
        <div className="journey-counter">
          <strong>{String(slideIdx + 1).padStart(2, "0")}</strong> / {String(JOURNEY_SLIDES.length).padStart(2, "0")}
        </div>
      </section>

      {/* TRAILER */}
      <section id="trailer" className="trailer-section">
        <div className="section-header reveal">
          <div className="section-sub">Official Trailer</div>
          <h2 className="section-title">A Glimpse<br/>of 2,000 Years</h2>
        </div>
        <div
          className="trailer-wrap reveal"
          onClick={() => window.open("https://www.youtube.com/@geo_jainism", "_blank", "noopener,noreferrer")}
          data-testid="trailer-play"
          role="button"
          tabIndex={0}
        >
          <img src="/journey/09-temple.jpg" alt="Tamil Jain documentary trailer poster" className="trailer-poster" />
          <div className="trailer-overlay">
            <div className="play-btn" aria-label="Play trailer">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <p className="trailer-caption">"Hear their story — the minority within a minority, finally seen."</p>
          </div>
        </div>
        <div className="trailer-meta reveal">
          <span className="trailer-meta-item"><strong>2:08</strong> Runtime</span>
          <span className="trailer-meta-item"><strong>4K</strong> Cinematic</span>
          <span className="trailer-meta-item"><strong>GEO Jainism</strong> Production</span>
        </div>
      </section>

      {/* RELEASE */}
      <section id="release" className="release-section">
        <div className="release-label">Coming August 2026</div>
        <h2 className="release-title">Hear Their<br/><span>Story</span></h2>
        <p className="release-body">A 2-hour powerful film presenting history, culture, and present-day struggle — together on the global stage. Tamil Jainism, finally seen by the world.</p>
        <div className="release-pills">
          <div className="release-pill">📅 <strong>August 2026</strong> — World Release</div>
          <div className="release-pill">📍 <strong>100+</strong> Screening Locations Planned</div>
          <div className="release-pill">📲 <strong>May 2026</strong> — Global Marketing Begins</div>
        </div>
        <div className="cta-group">
          <a href="#support" className="btn-primary">Support This Documentary</a>
          <a href="https://www.youtube.com/@geo_jainism" className="btn-secondary" target="_blank" rel="noreferrer">Watch on GEO Jainism</a>
        </div>
      </section>

      {/* BLOGS / ARTICLES */}
      <section id="blogs" className="section blogs-section">
        <div className="section-header reveal">
          <div className="section-sub">From the Journal</div>
          <h2 className="section-title">Articles &amp; Essays</h2>
          <p style={{ fontSize: 15, color: "var(--text-main)", opacity: 0.65, maxWidth: 560, margin: "20px auto 0", lineHeight: 1.8 }}>
            Long-form writings, field notes, and research essays from the GEO Jainism team — illuminating the people, places, and texts that carry this tradition forward.
          </p>
        </div>
        <div className="blogs-grid">
          {BLOGS.map((b, i) => (
            <a
              key={b.title}
              href="https://www.youtube.com/@geo_jainism"
              target="_blank"
              rel="noreferrer"
              className={`blog-card reveal ${b.featured ? "featured" : ""}`}
              data-testid={`blog-card-${i}`}
            >
              <div className="blog-img">
                <img src={b.img} alt={b.title} loading="lazy" />
                <span className="blog-cat">{b.cat}</span>
              </div>
              <div className="blog-body">
                <div className="blog-date">{b.date}</div>
                <h3 className="blog-title">{b.title}</h3>
                <p className="blog-excerpt">{b.excerpt}</p>
                <span className="blog-read">Read Article</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* DONATE */}
      <section id="support" className="donate-section">
        <div className="section-sub reveal">Support the Mission</div>
        <h2 className="donate-title reveal">आपका सहयोग जरूरी है</h2>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: "var(--saffron)", fontStyle: "italic", marginBottom: 16 }} className="reveal">Your support is essential</p>
        <p className="donate-body reveal">Be a part of this cultural yagna. GEO Jainism's "Tamil Jains" documentary needs community support to reach the world. Estimated budget: ₹30–40 Lakhs covering travel, team, equipment, music, editing, graphics, and promotion.</p>

        <div className="budget-bar reveal" style={{ marginBottom: 8 }}>
          <div className="budget-fill"></div>
        </div>
        <p style={{ fontSize: 12, color: "var(--saffron)", letterSpacing: 2, marginBottom: 48 }} className="reveal">TARGET: ₹30–40 LAKHS</p>

        <div className="donate-cards reveal">
          <div className="donate-card">
            <span className="donate-card-icon">🏦</span>
            <div className="donate-card-title">Bank Transfer</div>
            <div className="donate-card-val">
              <strong>GEO JAINISM</strong><br/>
              SBI A/C: 43784639669<br/>
              IFSC: SBIN0002895
            </div>
          </div>
          <div className="donate-card">
            <span className="donate-card-icon">📱</span>
            <div className="donate-card-title">UPI Payment</div>
            <div className="donate-card-val" style={{ fontSize: 22, color: "var(--saffron)", fontWeight: 600 }}>geojainism@sbi</div>
          </div>
          <div className="donate-card">
            <span className="donate-card-icon">📧</span>
            <div className="donate-card-title">Contact Us</div>
            <div className="donate-card-val" style={{ fontSize: 14 }}>
              goldeneraofjainism@gmail.com<br/>
              +91-6261820815
            </div>
          </div>
        </div>
        <a href="mailto:goldeneraofjainism@gmail.com" className="btn-primary reveal">Donate to Tamil Jain Documentary</a>
      </section>

      {/* ABOUT */}
      <section className="section about-section">
        <div className="reveal-left">
          <span className="about-tag">About GEO Jainism</span>
          <h2 className="story-heading">We Don't Just<br/><em>Study History —<br/>We Live It</em></h2>
          <p className="story-body">GEO Jainism is a research-based platform dedicated to the study and documentation of Jain culture, history, and heritage. We focus on authentic, field-based research and the unseen facets of Jainism.</p>
          <p className="story-body" style={{ marginTop: 16 }}>We travel to ancient sites, document hidden temples, and bring forgotten stories back to life — across Karnataka, Andhra Pradesh, Kerala, Telangana, Tamil Nadu, and Goa.</p>
          <div className="about-founder">
            <div className="founder-avatar">KJ</div>
            <div>
              <div className="founder-name">Kavi Sajal Jain</div>
              <div className="founder-role">Founder & Concept Director</div>
              <p style={{ fontSize: 12, color: "var(--ink)", opacity: 0.6, marginTop: 6, lineHeight: 1.6 }}>"To bring the eternal Jain heritage into the light — that is our foremost purpose."</p>
            </div>
          </div>
        </div>
        <div className="coverage-grid reveal-right">
          <div className="coverage-item"><span className="coverage-icon">🎬</span><div className="coverage-title">1.9M+ Views</div><div className="coverage-body">Pakistan's largest Jain temple — documentary making global waves</div></div>
          <div className="coverage-item"><span className="coverage-icon">📜</span><div className="coverage-title">Naldiyar</div><div className="coverage-body">First-ever video on the book written by 8,000 Jain monks · 24K views</div></div>
          <div className="coverage-item"><span className="coverage-icon">🗺️</span><div className="coverage-title">Multi-State Coverage</div><div className="coverage-body">Karnataka, AP, Kerala, Telangana, TN, Goa — Jain history documented</div></div>
          <div className="coverage-item"><span className="coverage-icon">📱</span><div className="coverage-title">@geo_jainism</div><div className="coverage-body">Follow on Instagram, YouTube & Twitter for latest updates</div></div>
          <div className="coverage-item"><span className="coverage-icon">🏛️</span><div className="coverage-title">Rare Literature</div><div className="coverage-body">Naldiyar, Silappadikaram, Ratnakara — rare Jain traditions studied</div></div>
          <div className="coverage-item"><span className="coverage-icon">⛰️</span><div className="coverage-title">Field Research</div><div className="coverage-body">Katariya, Lalitpur, Bihar — ancient Jain temples visited & documented</div></div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">GEO JAINISM · GOLDEN ERA OF JAINISM</div>
        <div className="footer-links">
          <a href="https://instagram.com/geo_jainism" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://youtube.com/@geo_jainism" target="_blank" rel="noreferrer">YouTube</a>
          <a href="mailto:goldeneraofjainism@gmail.com">Contact</a>
          <a href="#support">Donate</a>
        </div>
        <div className="footer-copy">© 2026 GEO Jainism · Concept by Kavi Sajal Jain · All Rights Reserved</div>
      </footer>
    </div>
  );
}
