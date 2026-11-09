import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PresentationControls, Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/**
 * Interactive 3D presentation for suitable products (books, the brass diya,
 * framed prints). Drag to turn; it eases back when released. Lighting is
 * built from local light panels, so no HDR files are downloaded.
 * Lazy-loaded by the product page only when the shopper opens the 3D tab.
 */

const BRASS = { color: "#c9a256", metalness: 1, roughness: 0.28 };

function usePageEdgeTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 16;
    c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#f3ecdf";
    g.fillRect(0, 0, 16, 256);
    for (let y = 0; y < 256; y += 3) {
      g.fillStyle = y % 6 ? "#e6dccb" : "#efe7d8";
      g.fillRect(0, y, 16, 1);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function Book({ cover, cloth = "#54202c" }) {
  const tex = useLoader(THREE.TextureLoader, cover);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const pages = usePageEdgeTexture();
  const aspect = tex.image ? tex.image.width / tex.image.height : 0.7;
  const h = 2.3;
  const w = h * aspect;
  const d = 0.34;
  return (
    <group rotation={[0, -0.45, 0]}>
      {/* boards */}
      <mesh castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial attach="material-0" map={pages} roughness={0.9} />
        <meshStandardMaterial attach="material-1" color={cloth} roughness={0.75} />
        <meshStandardMaterial attach="material-2" map={pages} roughness={0.9} />
        <meshStandardMaterial attach="material-3" map={pages} roughness={0.9} />
        <meshStandardMaterial attach="material-4" map={tex} roughness={0.55} metalness={0.05} />
        <meshStandardMaterial attach="material-5" color={cloth} roughness={0.75} />
      </mesh>
      {/* rounded spine: vertical half-cylinder bulging out of the left (−x) edge.
          Three's cylinder places θ=0 on +z, θ=π on −z, so π..2π spans the −x side. */}
      <mesh position={[-w / 2, 0, 0]}>
        <cylinderGeometry args={[d / 2, d / 2, h, 24, 1, true, Math.PI, Math.PI]} />
        <meshStandardMaterial color={cloth} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Flame() {
  const ref = useRef();
  const light = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const f = 1 + Math.sin(t * 13) * 0.06 + Math.sin(t * 29) * 0.04;
    if (ref.current) ref.current.scale.set(1, f, 1);
    if (light.current) light.current.intensity = 2.2 * f;
  });
  return (
    <group position={[0, 1.02, 0]}>
      <mesh ref={ref} position={[0, 0.09, 0]}>
        <coneGeometry args={[0.045, 0.2, 16]} />
        <meshBasicMaterial color="#ffcf7a" toneMapped={false} />
      </mesh>
      <pointLight ref={light} color="#ffb35c" intensity={2.2} distance={3} decay={2} />
    </group>
  );
}

function Diya() {
  const body = useMemo(() => {
    const pts = [
      [0, 0], [0.62, 0], [0.64, 0.05], [0.5, 0.12], [0.22, 0.2], [0.15, 0.32], [0.13, 0.55],
      [0.2, 0.62], [0.13, 0.7], [0.14, 0.8], [0.46, 0.86], [0.56, 0.95], [0.52, 1.0], [0.08, 0.96], [0, 0.96],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(pts, 64);
    g.computeVertexNormals();
    return g;
  }, []);
  const chimney = useMemo(() => {
    const pts = [[0.3, 0], [0.34, 0.25], [0.3, 0.55], [0.22, 0.8], [0.2, 0.95]].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  return (
    <group position={[0, -0.9, 0]} scale={1.35}>
      <mesh geometry={body} castShadow>
        <meshStandardMaterial {...BRASS} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={chimney} position={[0, 0.98, 0]}>
        <meshPhysicalMaterial color="#fff7ea" transparent opacity={0.22} roughness={0.05} metalness={0} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Flame />
    </group>
  );
}

function Frame({ art }) {
  const tex = useLoader(THREE.TextureLoader, art);
  tex.colorSpace = THREE.SRGBColorSpace;
  const aspect = tex.image ? tex.image.width / tex.image.height : 1;
  const h = aspect >= 1 ? 2.1 / aspect : 2.3;
  const w = h * aspect;
  const mat = 0.22;
  const fw = w + mat * 2;
  const fh = h + mat * 2;
  const bar = 0.11;
  const depth = 0.12;
  const wood = <meshStandardMaterial color="#4a3326" roughness={0.55} metalness={0.1} />;
  return (
    <group rotation={[0, -0.35, 0]}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[fw, fh, 0.03]} />
        <meshStandardMaterial color="#f7f2e8" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={tex} roughness={0.8} />
      </mesh>
      {[
        [0, fh / 2 + bar / 2, fw + bar * 2, bar],
        [0, -fh / 2 - bar / 2, fw + bar * 2, bar],
        [fw / 2 + bar / 2, 0, bar, fh],
        [-fw / 2 - bar / 2, 0, bar, fh],
      ].map(([x, y, bw, bh], i) => (
        <mesh key={i} position={[x, y, 0.02]} castShadow>
          <boxGeometry args={[bw, bh, depth]} />
          {wood}
        </mesh>
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} castShadow color="#fff3e0" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} color="#fff4e2" position={[0, 3, 4]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#e8c58a" position={[-4, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#b99a59" position={[4, 0, -2]} rotation-y={-Math.PI / 2} scale={[4, 3, 1]} />
        <Lightformer form="circle" intensity={1.5} color="#ffffff" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={2} />
      </Environment>
    </>
  );
}

export default function ProductStage3D({ product, cover, art }) {
  const reduce = useReducedMotion();
  const model =
    product.model === "book" ? <Book cover={cover} cloth={product.cloth} /> : product.model === "diya" ? <Diya /> : <Frame art={art} />;

  return (
    <div className="relative h-full w-full bg-[radial-gradient(ellipse_at_50%_35%,#f8f2e7,#e4d8c4)]">
      <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 0.3, 5.4], fov: 35 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <Suspense fallback={null}>
          <Lights />
          <PresentationControls global={false} cursor snap rotation={[0.08, 0.2, 0]} polar={[-0.3, 0.35]} azimuth={[-1.1, 1.1]} config={{ mass: 1.2, tension: 220 }}>
            <Float enabled={!reduce} speed={1.4} rotationIntensity={0.25} floatIntensity={0.35}>
              {model}
            </Float>
          </PresentationControls>
          <ContactShadows position={[0, -1.45, 0]} opacity={0.38} scale={7} blur={2.6} far={3} color="#4a382b" />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 bg-gj-ivory/80 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-gj-charcoal backdrop-blur">
        Drag to turn
      </p>
    </div>
  );
}
