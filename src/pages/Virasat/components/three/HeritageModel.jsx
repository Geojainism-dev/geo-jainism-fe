import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance, MeshReflectorMaterial, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { archBeamShape, archWindowShape } from "./archShape";

/**
 * Procedural pillared hall ("mandapa") receding into fog, ending in a
 * cusped-arch portal that plays performance footage.
 * All geometry is generated — no model downloads — and pillars/arches are
 * instanced, so the whole hall is a handful of draw calls.
 */

export const BAY = 4.2; // distance between pillar rows
export const BAYS = 7;
export const HALF_WIDTH = 2.9; // pillar x offset
export const PORTAL_Z = -BAY * (BAYS - 1) - 3.2;

const STONE = "#5a3226";
const STONE_DARK = "#2a1512";
const GOLD = "#C6A15B";

/** Octagonal temple pillar: plinth, banded shaft, bracket capital. */
function usePillarGeometry() {
  return useMemo(() => {
    const p = [
      [0, 0], [0.62, 0], [0.62, 0.28], [0.5, 0.34], [0.5, 0.5], [0.42, 0.56], [0.34, 0.62],
      [0.31, 0.7], [0.3, 1.3], [0.37, 1.36], [0.37, 1.46], [0.3, 1.52], [0.29, 2.5],
      [0.36, 2.56], [0.36, 2.66], [0.28, 2.72], [0.28, 3.02], [0.34, 3.1], [0.46, 3.2],
      [0.4, 3.28], [0.56, 3.42], [0.68, 3.56], [0.68, 3.72], [0, 3.72],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(p, 8);
    g.computeVertexNormals();
    return g;
  }, []);
}

function useArchGeometry() {
  return useMemo(() => {
    const shape = archBeamShape({ outerHalf: HALF_WIDTH + 0.62, top: 5.4, halfSpan: HALF_WIDTH - 0.68, base: 3.72, rise: 1.15 });
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.7, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 1, curveSegments: 4 });
    g.translate(0, 0, -0.35);
    g.computeVertexNormals();
    return g;
  }, []);
}

/** Inlaid floor pattern: eight-point stars on a square grid, drawn once to a canvas. */
function useFloorTexture() {
  return useMemo(() => {
    const size = 512;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#1b0f0d";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(198,161,91,0.55)";
    ctx.lineWidth = 3;
    const star = (cx, cy, r) => {
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 + Math.PI / 8;
        const rr = i % 2 === 0 ? r : r * 0.62;
        ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.stroke();
    };
    star(size / 2, size / 2, size * 0.32);
    [0, size].forEach((x) => [0, size].forEach((y) => star(x, y, size * 0.32)));
    ctx.strokeStyle = "rgba(198,161,91,0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size - 2, size - 2);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 14);
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Portal({ videoSrc }) {
  const texture = useVideoTexture(videoSrc, { muted: true, loop: true, start: true, playsInline: true, crossOrigin: "anonymous" });
  const geometry = useMemo(() => {
    const g = new THREE.ShapeGeometry(archWindowShape({ halfSpan: 1.55, base: 2.1, rise: 1.15, leg: 2.1, lobes: 9, cusp: 0.05 }), 24);
    // 0–1 UVs across the arch's bounding box; the texture's repeat/offset
    // below then crops the 16:9 footage to the arch's aspect ("cover" fit).
    g.computeBoundingBox();
    const { min, max } = g.boundingBox;
    const pos = g.attributes.position;
    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uv[i * 2] = (pos.getX(i) - min.x) / (max.x - min.x);
      uv[i * 2 + 1] = (pos.getY(i) - min.y) / (max.y - min.y);
    }
    g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    g.userData.aspect = (max.x - min.x) / (max.y - min.y);
    return g;
  }, []);
  const frame = useMemo(() => {
    const outer = archWindowShape({ halfSpan: 1.85, base: 2.1, rise: 1.35, leg: 2.1, lobes: 9, cusp: 0.05 });
    // hole stops just above the outer edge so the outlines never touch
    outer.holes.push(archWindowShape({ halfSpan: 1.6, base: 2.1, rise: 1.18, leg: 2.04, lobes: 9, cusp: 0.05 }));
    return new THREE.ExtrudeGeometry(outer, { depth: 0.18, bevelEnabled: false, curveSegments: 4 });
  }, []);

  // Crop the 16:9 frame horizontally to the arch's aspect.
  useEffect(() => {
    const crop = geometry.userData.aspect / (16 / 9);
    texture.repeat.set(crop, 1);
    texture.offset.set((1 - crop) / 2, 0);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture, geometry]);

  return (
    <group position={[0, 0, PORTAL_Z]}>
      <mesh geometry={geometry} position={[0, 0, 0]}>
        <meshBasicMaterial map={texture} toneMapped={false} color="#ffe6c4" fog={false} />
      </mesh>
      <mesh geometry={frame} position={[0, 0, 0.02]}>
        <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.32} emissive="#8a5f22" emissiveIntensity={1.1} fog={false} />
      </mesh>
      {/* back wall the portal is set into */}
      <mesh position={[0, 3, -0.08]}>
        <planeGeometry args={[HALF_WIDTH * 2 + 4, 7]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.95} />
      </mesh>
    </group>
  );
}

/** Small oil lamps on the plinths, gently flickering. */
function Lamps() {
  const ref = useRef();
  const lamps = useMemo(() => {
    const out = [];
    for (let i = 0; i < BAYS; i++) {
      [-1, 1].forEach((side) => out.push([side * (HALF_WIDTH - 0.75), 0.06, -i * BAY + 0.5]));
    }
    return out;
  }, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.children.forEach((m, i) => {
      const s = 0.85 + Math.sin(t * 7 + i * 1.7) * 0.08 + Math.sin(t * 13 + i) * 0.05;
      m.scale.setScalar(s);
    });
  });
  return (
    <group ref={ref}>
      {lamps.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshBasicMaterial color="#ffc070" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeritageModel({ videoSrc, reflections = true }) {
  const pillar = usePillarGeometry();
  const arch = useArchGeometry();
  const floorTex = useFloorTexture();

  const rows = useMemo(() => Array.from({ length: BAYS }, (_, i) => -i * BAY), []);

  return (
    <group>
      <Instances geometry={pillar} limit={BAYS * 2} castShadow={false}>
        <meshStandardMaterial color={STONE} roughness={0.82} metalness={0.05} />
        {rows.map((z) => [-1, 1].map((side) => <Instance key={`${z}${side}`} position={[side * HALF_WIDTH, 0, z]} />))}
      </Instances>

      <Instances geometry={arch} limit={BAYS}>
        <meshStandardMaterial color={STONE} roughness={0.85} metalness={0.05} />
        {rows.map((z) => (
          <Instance key={z} position={[0, 0, z]} />
        ))}
      </Instances>

      {/* side walls far outside the pillars, to hold light */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (HALF_WIDTH + 2.6), 3, PORTAL_Z / 2]} rotation={[0, -side * Math.PI / 2, 0]}>
          <planeGeometry args={[-PORTAL_Z + 12, 8]} />
          <meshStandardMaterial color={STONE_DARK} roughness={1} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, PORTAL_Z / 2 + 3]}>
        <planeGeometry args={[HALF_WIDTH * 2 + 6, -PORTAL_Z + 18]} />
        {reflections ? (
          <MeshReflectorMaterial
            map={floorTex}
            resolution={512}
            mixBlur={1.2}
            mixStrength={1.6}
            blur={[300, 80]}
            roughness={0.75}
            metalness={0.4}
            depthScale={0.6}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.3}
            color="#2a1714"
            mirror={0.35}
          />
        ) : (
          <meshStandardMaterial map={floorTex} roughness={0.55} metalness={0.25} color="#3a211c" />
        )}
      </mesh>

      <Lamps />
      <Portal videoSrc={videoSrc} />
    </group>
  );
}
