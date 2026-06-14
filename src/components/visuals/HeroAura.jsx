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
    group.position.y = isMobile() ? 1.0 : 1.2;

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

    /* Divine light cones — DISABLED */
    // const innerCone = new THREE.Mesh(
    //   new THREE.ConeGeometry(1.4, 7, 32, 1, true, 0, Math.PI * 2),
    //   new THREE.MeshBasicMaterial({
    //     color: 0xF4A535,
    //     transparent: true,
    //     opacity: 0.08,
    //     wireframe: false,
    //     side: THREE.DoubleSide,
    //     blending: THREE.AdditiveBlending,
    //   })
    // );
    // innerCone.position.z = -0.5;
    // innerCone.position.y = 0.2;
    // group.add(innerCone);

    // const outerCone = new THREE.Mesh(
    //   new THREE.ConeGeometry(2.8, 7, 32, 1, true, 0, Math.PI * 2),
    //   new THREE.MeshBasicMaterial({
    //     color: 0xF7D580,
    //     transparent: true,
    //     opacity: 0.05,
    //     wireframe: false,
    //     side: THREE.DoubleSide,
    //     blending: THREE.AdditiveBlending,
    //   })
    // );
    // outerCone.position.z = -0.8;
    // outerCone.position.y = 0.3;
    // group.add(outerCone);

    /* Rising sparks */
    const sparkCount = 80;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkData = [];
    for (let i = 0; i < sparkCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.2 + Math.random() * 0.8;
      sparkPos[i * 3] = Math.cos(a) * r;
      sparkPos[i * 3 + 1] = -2 + Math.random() * 0.5;
      sparkPos[i * 3 + 2] = Math.sin(a) * r * 0.3;
      sparkData.push({
        x: sparkPos[i * 3],
        y: sparkPos[i * 3 + 1],
        z: sparkPos[i * 3 + 2],
        speed: 0.004 + Math.random() * 0.008,
        driftX: (Math.random() - 0.5) * 0.0018,
        driftY: 0,
        driftZ: (Math.random() - 0.5) * 0.0018,
      });
    }
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));

    const sparkDotC = document.createElement("canvas");
    sparkDotC.width = 32; sparkDotC.height = 32;
    const sdctx = sparkDotC.getContext("2d");
    const sdg = sdctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    sdg.addColorStop(0, "rgba(255,220,140,1)");
    sdg.addColorStop(0.5, "rgba(244,165,53,0.6)");
    sdg.addColorStop(1, "rgba(244,165,53,0)");
    sdctx.fillStyle = sdg;
    sdctx.fillRect(0, 0, 32, 32);
    const sparkDotTex = new THREE.CanvasTexture(sparkDotC);

    const sparkMat = new THREE.PointsMaterial({
      size: 0.08,
      map: sparkDotTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    group.add(sparks);

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

    /* Cone pulse animations — DISABLED */
    // gsap.to(innerCone.material, { opacity: 0.12, duration: 3.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
    // gsap.to(outerCone.material, { opacity: 0.08, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
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

      /* Update sparks rising */
      const sparkPos = sparks.geometry.attributes.position;
      for (let i = 0; i < sparkCount; i++) {
        sparkData[i].y += sparkData[i].speed;
        sparkData[i].x += sparkData[i].driftX;
        sparkData[i].z += sparkData[i].driftZ;
        if (sparkData[i].y > 4.0) {
          sparkData[i].y = -2 + Math.random() * 0.5;
          sparkData[i].x = (Math.random() - 0.5) * 1.6;
          sparkData[i].z = (Math.random() - 0.5) * 0.6;
        }
        sparkPos.array[i * 3] = sparkData[i].x;
        sparkPos.array[i * 3 + 1] = sparkData[i].y;
        sparkPos.array[i * 3 + 2] = sparkData[i].z;
      }
      sparkPos.needsUpdate = true;

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
      group.position.y = isMobile() ? 1.0 : 1.2;
    };
    window.addEventListener("resize", onResize);

    // Fire onResize when the parent changes size (e.g. when the idol image loads
    // on mobile where tirthankar-wrap has height:auto — the canvas initialises
    // with height 0 without this observer).
    const ro = new ResizeObserver(onResize);
    ro.observe(parent);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      ro.disconnect();
      // innerCone.geometry.dispose();
      // outerCone.geometry.dispose();
      sparkGeo.dispose();
      partGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="aura-canvas" ref={auraCanvasRef}></canvas>;
};

export default HeroAura;
