import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const BackgroundScene = () => {
  const bgCanvasRef = useRef(null);

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

    /* Polyhedra — orbiting around scene center (mandala position) */
    const sphereOrbit1 = new THREE.Group();
    const sphereOrbit2 = new THREE.Group();
    const sphereOrbit3 = new THREE.Group();
    const sphereOrbit4 = new THREE.Group();
    scene.add(sphereOrbit1);
    scene.add(sphereOrbit2);
    scene.add(sphereOrbit3);
    scene.add(sphereOrbit4);

    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.55, 1),
      new THREE.MeshBasicMaterial({ color: 0xF4A535, wireframe: true, transparent: true, opacity: 0.55 })
    );
    ico.position.set(3.8, 0, -1);
    sphereOrbit1.add(ico);

    const ico2 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.38, 1),
      new THREE.MeshBasicMaterial({ color: 0xF2C4CE, wireframe: true, transparent: true, opacity: 0.5 })
    );
    ico2.position.set(-4.2, 0, -1.5);
    sphereOrbit2.add(ico2);

    const ico3 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.45, 1),
      new THREE.MeshBasicMaterial({ color: 0xF7D580, wireframe: true, transparent: true, opacity: 0.5 })
    );
    ico3.position.set(0, 3.5, -1.2);
    sphereOrbit3.add(ico3);

    const oct = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.42),
      new THREE.MeshBasicMaterial({ color: 0xC8DFC0, wireframe: true, transparent: true, opacity: 0.48 })
    );
    oct.position.set(0, -4.0, -2);
    sphereOrbit4.add(oct);

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
      sphereOrbit1.rotation.z += 0.004;
      sphereOrbit2.rotation.z -= 0.003;
      sphereOrbit3.rotation.z += 0.002;
      sphereOrbit4.rotation.z -= 0.0025;
      ico.rotation.x  = time * 0.4;
      ico.rotation.y  = time * 0.3;
      ico2.rotation.x = -time * 0.35;
      ico2.rotation.z =  time * 0.25;
      ico3.rotation.y =  time * 0.3;
      ico3.rotation.z = -time * 0.2;
      oct.rotation.y  =  time * 0.45;
      oct.rotation.x  =  time * 0.28;

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

  return <canvas id="three-canvas" ref={bgCanvasRef}></canvas>;
};

export default BackgroundScene;
