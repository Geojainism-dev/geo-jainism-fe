import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const HeroAura = () => {
  const auraCanvasRef = useRef(null);

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
    const isMobile = () => window.innerWidth <= 1100;
    const getCameraZ = () => isMobile() ? 4.5 : 6;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, getCameraZ());

    const group = new THREE.Group();
    scene.add(group);
    group.position.y = isMobile() ? 0 : 1.2;

    /* Aura layered rings */
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

    /* Glowing disc sprites */
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

    /* Particles */
    const partCount = 320;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    const partData = [];
    for (let i = 0; i < partCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.3 + Math.random() * 5.5;
      partPos[i * 3] = Math.cos(a) * r;
      partPos[i * 3 + 1] = Math.sin(a) * r;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      partData.push({
        angle: a,
        radius: r,
        speed: 0.0003 + Math.random() * 0.0014,
        rise: 0.001 + Math.random() * 0.004,
      });
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));

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

    /* Lotus petals */
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

    gsap.to(group.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(halo1.material, { opacity: 0.55, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(halo2.material, { opacity: 0.7, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });

    let t = 0;
    let rafId;
    let visible = !document.hidden;
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

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
        if (partData[i].radius > 6.0) {
          partData[i].radius = 0.3;
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
      camera.position.z = getCameraZ();
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      group.position.y = isMobile() ? 0 : 1.2;
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

  return <canvas id="aura-canvas" ref={auraCanvasRef}></canvas>;
};

export default HeroAura;
