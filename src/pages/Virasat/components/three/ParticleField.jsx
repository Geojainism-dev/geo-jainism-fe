import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform vec3 uBox;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // slow rise with lateral drift, wrapped inside the box
    p.y = mod(p.y + uTime * (0.08 + aSeed * 0.12), uBox.y);
    p.x += sin(uTime * 0.3 + aSeed * 40.0) * 0.25;
    p.z += cos(uTime * 0.2 + aSeed * 25.0) * 0.2;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(uSize * (0.4 + aSeed) * uPixelRatio * (8.0 / -mv.z), 9.0 * uPixelRatio);
    float flicker = 0.55 + 0.45 * sin(uTime * (1.0 + aSeed * 3.0) + aSeed * 60.0);
    float fade = smoothstep(0.0, 0.6, p.y) * (1.0 - smoothstep(uBox.y - 1.2, uBox.y, p.y));
    vAlpha = flicker * fade;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * vAlpha);
  }
`;

/** Rising gold dust motes — one draw call, animated entirely on the GPU. */
export default function ParticleField({ count = 1400, box = [9, 7, 32], center = [0, 0, -10], color = "#E9C27F", size = 3.2 }) {
  const material = useRef();

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * box[0];
      positions[i * 3 + 1] = Math.random() * box[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * box[2];
      seeds[i] = Math.random();
    }
    return { positions, seeds };
  }, [count, box]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uSize: { value: size },
      uBox: { value: new THREE.Vector3(...box) },
      uColor: { value: new THREE.Color(color) },
    }),
    [box, color, size]
  );

  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += delta;
  });

  return (
    <points position={center} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
