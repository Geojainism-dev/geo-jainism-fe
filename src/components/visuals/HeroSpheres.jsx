import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const HeroSpheres = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    let W = parent.clientWidth;
    let H = parent.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 0, 7);

    /* ── Glow sprite helper ── */
    function makeGlow(color, size, opacity) {
      const c = document.createElement("canvas");
      c.width = 128; c.height = 128;
      const ctx = c.getContext("2d");
      const hex = "#" + color.toString(16).padStart(6, "0");
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0,   hex);
      g.addColorStop(0.3, hex + "99");
      g.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      const mat = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(c),
        transparent: true, opacity,
        depthWrite: false,
      });
      const sp = new THREE.Sprite(mat);
      sp.scale.set(size, size, 1);
      return sp;
    }

    /* ── 5 wireframe spheres evenly around a circle ── */
    const SPHERE_COUNT  = 5;
    const ORBIT_RADIUS  = 3.4;
    const spheres = [];

    for (let i = 0; i < SPHERE_COUNT; i++) {
      const angle = (i / SPHERE_COUNT) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * ORBIT_RADIUS;
      const y = Math.sin(angle) * ORBIT_RADIUS;

      // Glow halo behind sphere
      const glow = makeGlow(0xF4A535, 1.6, 0.55);
      glow.position.set(x, y, -0.3);
      scene.add(glow);

      // Wireframe icosahedron
      const mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.42, 1),
        new THREE.MeshBasicMaterial({
          color: 0xF7D580,
          wireframe: true, transparent: true, opacity: 0.85,
        })
      );
      mesh.position.set(x, y, 0);
      scene.add(mesh);
      spheres.push({ mesh, sx: 0.25 + i * 0.08, sy: 0.18 + i * 0.06 });
    }

    /* ── Concentric rings ── */
    const rings = [];
    const ringRadii  = [1.4, 2.1, 2.8, 3.5, 4.3];
    const ringOpacity = [0.9, 0.75, 0.9, 0.65, 0.5];

    const lineMat = (color, opacity) => new THREE.LineBasicMaterial({
      color, opacity, depthTest: false, depthWrite: false,
    });

    ringRadii.forEach((r, i) => {
      const pts = [];
      for (let j = 0; j <= 180; j++) {
        const a = (j / 180) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
      }
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        lineMat(0xC8680E, ringOpacity[i])
      );
      scene.add(line);
      rings.push({ line, speed: (i % 2 === 0 ? 0.0008 : -0.0006) });
    });

    /* ── Arc lines connecting adjacent spheres ── */
    for (let i = 0; i < SPHERE_COUNT; i++) {
      const next = (i + 1) % SPHERE_COUNT;
      const a1 = (i    / SPHERE_COUNT) * Math.PI * 2 - Math.PI / 2;
      const a2 = (next / SPHERE_COUNT) * Math.PI * 2 - Math.PI / 2;
      const pts = [];
      for (let s = 0; s <= 40; s++) {
        const a = a1 + (a2 - a1) * (s / 40);
        pts.push(new THREE.Vector3(Math.cos(a) * ORBIT_RADIUS, Math.sin(a) * ORBIT_RADIUS, 0));
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(0xC8680E, 0.8)));
    }

    /* ── Radial lines from center to each sphere ── */
    for (let i = 0; i < SPHERE_COUNT; i++) {
      const angle = (i / SPHERE_COUNT) * Math.PI * 2 - Math.PI / 2;
      const pts = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * (ORBIT_RADIUS - 0.5), Math.sin(angle) * (ORBIT_RADIUS - 0.5), 0),
      ];
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(0xC8680E, 0.6)));
    }

    /* ── Sparkle points scattered along rings ── */
    const sparklePositions = [];
    for (let i = 0; i < 60; i++) {
      const r = 1.2 + Math.random() * 3.2;
      const a = Math.random() * Math.PI * 2;
      sparklePositions.push(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.4);
    }
    const sparkleGeo = new THREE.BufferGeometry();
    sparkleGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(sparklePositions), 3));

    const dotC = document.createElement("canvas");
    dotC.width = 32; dotC.height = 32;
    const dctx = dotC.getContext("2d");
    const dg = dctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    dg.addColorStop(0,   "rgba(255,230,140,1)");
    dg.addColorStop(0.4, "rgba(244,165,53,0.7)");
    dg.addColorStop(1,   "rgba(244,165,53,0)");
    dctx.fillStyle = dg;
    dctx.fillRect(0, 0, 32, 32);

    const sparklePts = new THREE.Points(sparkleGeo, new THREE.PointsMaterial({
      size: 0.12, map: new THREE.CanvasTexture(dotC),
      transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    }));
    scene.add(sparklePts);

    /* ── Animate ── */
    let t = 0, rafId;
    let visible = !document.hidden, inView = true;

    document.addEventListener("visibilitychange", () => { visible = !document.hidden; });
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(parent);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!visible || !inView) return;
      t += 0.008;

      spheres.forEach(({ mesh, sx, sy }) => {
        mesh.rotation.x = t * sx;
        mesh.rotation.y = t * sy;
      });

      rings.forEach(({ line, speed }) => { line.rotation.z += speed; });

      sparklePts.rotation.z += 0.0003;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      W = parent.clientWidth; H = parent.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-spheres-canvas" />;
};

export default HeroSpheres;
