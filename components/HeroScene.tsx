"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/*  The hero is a small vector space. Each dot is an "embedding".
    The pointer is a query: every frame we find its K nearest
    neighbours (a real brute-force top-K search), light them up
    in citation amber and draw the retrieval lines. Click sends
    a pulse through the space.                                  */

const K = 9;

const CLUSTERS = [
  { label: "documents", c: [-3.0, 1.3, 0.4], hue: [0.55, 0.56, 1.0] },
  { label: "fraud events", c: [1.8, -0.9, -0.6], hue: [0.62, 0.5, 1.0] },
  { label: "tenant docs", c: [0.0, 1.9, -1.4], hue: [0.4, 0.62, 1.0] },
  { label: "risk scores", c: [3.2, 1.6, 0.6], hue: [0.66, 0.46, 0.95] },
  { label: "citations", c: [-1.6, -1.7, 1.0], hue: [0.48, 0.58, 1.0] },
  { label: "dashboards", c: [0.4, -2.4, 1.6], hue: [0.58, 0.6, 1.0] },
] as const;

function gauss() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

const vertex = /* glsl */ `
  attribute float aSize;
  attribute float aActive;
  attribute float aSeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uMotion;
  uniform float uScale;
  uniform vec3 uPulseOrigin;
  uniform float uPulseTime;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p += uMotion * 0.06 * vec3(
      sin(uTime * 0.6 + aSeed * 6.28),
      cos(uTime * 0.5 + aSeed * 12.0),
      sin(uTime * 0.4 + aSeed * 3.0)
    );
    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    float wave = 0.0;
    if (uPulseTime >= 0.0) {
      float d = distance(position, uPulseOrigin);
      wave = exp(-pow((d - uPulseTime * 5.0) * 2.0, 2.0)) * clamp(1.0 - uPulseTime * 0.55, 0.0, 1.0);
    }
    float twinkle = 0.78 + 0.22 * sin(uTime * 2.0 * uMotion + aSeed * 40.0);

    gl_PointSize = aSize * (1.0 + aActive * 2.2 + wave * 1.6) * uPixelRatio * uScale * (15.0 / -mv.z);
    gl_Position = projectionMatrix * mv;

    vec3 amber = vec3(0.71, 0.28, 0.12);
    vec3 cyan = vec3(0.12, 0.36, 0.31);
    vColor = mix(aColor, amber, aActive);
    vColor = mix(vColor, cyan, wave * (1.0 - aActive));
    float depth = smoothstep(-14.0, -6.0, mv.z);
    vAlpha = (0.8 + 0.2 * aActive + wave * 0.6) * twinkle * (0.5 + 0.5 * depth);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.0, d);
    a = a * a;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

type SceneProps = {
  count: number;
  offset: [number, number, number];
  reduced: boolean;
  pointer: React.MutableRefObject<{ x: number; y: number; t: number; inside: boolean }>;
  pulse: React.MutableRefObject<number>;
  labelRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  hudRef: React.RefObject<HTMLSpanElement | null>;
};

function Cloud({ count, offset, reduced, pointer, pulse, labelRefs, hudRef }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const probe = useRef<THREE.Group>(null);
  const { camera, size, gl } = useThree();

  const { positions, colors, sizes, seeds, owner } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    const owner = new Int8Array(count);
    const col = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const stray = Math.random() < 0.14;
      const ci = Math.floor(Math.random() * CLUSTERS.length);
      const cl = CLUSTERS[ci];
      const s = 0.75 + Math.random() * 0.35;
      if (stray) {
        positions.set([(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6], i * 3);
        owner[i] = -1;
        col.setHSL(0.1, 0.08, 0.5);
      } else {
        positions.set([cl.c[0] + gauss() * s, cl.c[1] + gauss() * s * 0.8, cl.c[2] + gauss() * s], i * 3);
        owner[i] = ci;
        // muted ink tones (warm grey through slate and green), dark enough to read on paper
        col.setHSL(cl.hue[0] + (Math.random() - 0.5) * 0.03, cl.hue[1] * 0.45, 0.22 + Math.random() * 0.12);
      }
      colors.set([col.r, col.g, col.b], i * 3);
      sizes[i] = 2.6 + Math.random() * 4.2;
      seeds[i] = Math.random();
    }
    return { positions, colors, sizes, seeds, owner };
  }, [count]);

  const active = useMemo(() => new Float32Array(count), [count]);
  const target = useMemo(() => new Float32Array(count), [count]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aActive", new THREE.BufferAttribute(active, 1).setUsage(THREE.DynamicDrawUsage));
    return g;
  }, [positions, colors, sizes, seeds, active]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.8) },
          uMotion: { value: reduced ? 0 : 1 },
          uScale: { value: size.width < 720 ? 1.7 : 1 },
          uPulseOrigin: { value: new THREE.Vector3() },
          uPulseTime: { value: -1 },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduced]
  );

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(K * 6), 3).setUsage(THREE.DynamicDrawUsage));
    return g;
  }, []);

  const tmp = useMemo(
    () => ({
      ray: new THREE.Raycaster(),
      plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      ndc: new THREE.Vector2(),
      world: new THREE.Vector3(),
      local: new THREE.Vector3(),
      smooth: new THREE.Vector3(1, 0.4, 0),
      v: new THREE.Vector3(),
      idx: new Int32Array(K),
      dist: new Float32Array(K),
      hudT: 0,
    }),
    []
  );

  useEffect(() => () => { geometry.dispose(); material.dispose(); lineGeo.dispose(); }, [geometry, material, lineGeo]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    material.uniforms.uTime.value = t;

    // Slow drift + a gentle tilt toward the pointer
    if (!reduced) g.rotation.y += dt * 0.045;
    const px = pointer.current.inside ? pointer.current.x : 0;
    const py = pointer.current.inside ? pointer.current.y : 0;
    g.rotation.x += (py * 0.12 - g.rotation.x) * dt * 2;

    // Where is the query?
    const idle = !pointer.current.inside || performance.now() - pointer.current.t > 3500;
    if (idle) {
      const a = reduced ? 0 : t * 0.35;
      const mob = size.width < 720;
      tmp.ndc.set((mob ? 0 : 0.35) + Math.cos(a) * (mob ? 0.45 : 0.32), Math.sin(a * 1.3) * (mob ? 0.22 : 0.35) + (mob ? 0.52 : 0));
    } else {
      tmp.ndc.set(px, py);
    }
    tmp.ray.setFromCamera(tmp.ndc, camera);
    if (tmp.ray.ray.intersectPlane(tmp.plane, tmp.world)) {
      tmp.local.copy(tmp.world);
      g.worldToLocal(tmp.local);
      tmp.smooth.lerp(tmp.local, Math.min(1, dt * (idle ? 3 : 10)));
    }
    probe.current?.position.copy(tmp.smooth);

    // Brute-force top-K nearest neighbours
    const { idx, dist } = tmp;
    dist.fill(Infinity);
    idx.fill(-1);
    const qx = tmp.smooth.x, qy = tmp.smooth.y, qz = tmp.smooth.z;
    for (let i = 0; i < count; i++) {
      const dx = positions[i * 3] - qx, dy = positions[i * 3 + 1] - qy, dz = positions[i * 3 + 2] - qz;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < dist[K - 1]) {
        let j = K - 1;
        while (j > 0 && dist[j - 1] > d) { dist[j] = dist[j - 1]; idx[j] = idx[j - 1]; j--; }
        dist[j] = d; idx[j] = i;
      }
    }

    target.fill(0);
    const lp = lineGeo.attributes.position.array as Float32Array;
    for (let k = 0; k < K; k++) {
      const i = idx[k];
      if (i < 0) continue;
      target[i] = 1;
      lp.set([qx, qy, qz, positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]], k * 6);
    }
    lineGeo.attributes.position.needsUpdate = true;

    const ease = Math.min(1, dt * 9);
    for (let i = 0; i < count; i++) {
      const diff = target[i] - active[i];
      if (diff !== 0) active[i] += Math.abs(diff) < 0.002 ? diff : diff * ease;
    }
    geometry.attributes.aActive.needsUpdate = true;

    // Pulse
    if (pulse.current >= 0) {
      if (material.uniforms.uPulseTime.value < 0) material.uniforms.uPulseOrigin.value.copy(tmp.smooth);
      material.uniforms.uPulseTime.value = pulse.current;
      pulse.current += dt;
      if (pulse.current > 2.4) pulse.current = -1;
    } else {
      material.uniforms.uPulseTime.value = -1;
    }

    // Cluster labels follow their centres on screen
    const rect = gl.domElement.getBoundingClientRect();
    CLUSTERS.forEach((cl, ci) => {
      const el = labelRefs.current[ci];
      if (!el) return;
      tmp.v.set(cl.c[0], cl.c[1] + 1.25, cl.c[2]);
      const near = tmp.v.distanceTo(tmp.smooth);
      g.localToWorld(tmp.v);
      tmp.v.project(camera);
      const x = (tmp.v.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.v.y * 0.5 + 0.5) * size.height;
      const vis = tmp.v.z < 1 && x > 0 && x < rect.width && y > 0 && y < rect.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      el.style.opacity = vis ? String(Math.max(0.18, Math.min(1, 1.6 - near * 0.38))) : "0";
      el.dataset.near = near < 2.2 ? "1" : "0";
    });

    // HUD readout, ~8 times a second
    tmp.hudT += dt;
    if (hudRef.current && tmp.hudT > 0.12) {
      tmp.hudT = 0;
      const votes = new Map<number, number>();
      for (let k = 0; k < K; k++) if (idx[k] >= 0) {
        const o = owner[idx[k]];
        if (o >= 0) votes.set(o, (votes.get(o) || 0) + 1);
      }
      let top = -1, best = 0;
      votes.forEach((v, o) => { if (v > best) { best = v; top = o; } });
      const sim = Math.max(0, 1 - Math.sqrt(dist[0]) / 2.5);
      hudRef.current.textContent =
        top >= 0
          ? `top-${K} · ${best}/${K} from “${CLUSTERS[top].label}” · nearest sim ${sim.toFixed(2)}`
          : `top-${K} · scattered match · nearest sim ${sim.toFixed(2)}`;
    }
  });

  return (
    <group ref={group} position={offset}>
      <points geometry={geometry} material={material} frustumCulled={false} />
      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <lineBasicMaterial color="#1F5D50" transparent opacity={0.6} depthWrite={false} />
      </lineSegments>
      <group ref={probe}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#1F5D50" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshBasicMaterial color="#1F5D50" transparent opacity={0.1} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

export default function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, t: 0, inside: false });
  const pulse = useRef(-1);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hudRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [count, setCount] = useState(2400);
  const [camZ, setCamZ] = useState(9);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    setCount(window.innerWidth < 720 ? 1500 : 2400);
    setCamZ(window.innerWidth / window.innerHeight < 0.9 ? 12 : 9);

    const el = wrap.current!;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const inside = e.clientY >= r.top && e.clientY <= r.bottom;
      pointer.current = {
        x: ((e.clientX - r.left) / r.width) * 2 - 1,
        y: -(((e.clientY - r.top) / r.height) * 2 - 1),
        t: performance.now(),
        inside,
      };
    };
    const onDown = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const tgt = e.target as HTMLElement;
      if (e.clientY > r.bottom || tgt.closest("a,button,input")) return;
      onMove(e);
      pulse.current = 0;
    };
    const io = new IntersectionObserver(([en]) => setVisible(en.isIntersecting), { threshold: 0 });
    io.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div ref={wrap} className="hero-canvas" aria-hidden="true">
      <Canvas
        key={`${count}-${camZ}`}
        dpr={[1, 1.8]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, camZ], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Cloud count={count} offset={camZ === 9 ? [1.5, 0, 0] : [0, 2.9, 0]} reduced={reduced} pointer={pointer} pulse={pulse} labelRefs={labelRefs} hudRef={hudRef} />
      </Canvas>
      {CLUSTERS.map((c, i) => (
        <span key={c.label} className="cluster-label" ref={(el) => { labelRefs.current[i] = el; }}>
          {c.label}
        </span>
      ))}
      <div className="hero-hud">
        <span className="hud-live" />
        <span ref={hudRef}>top-{K} · searching…</span>
      </div>
    </div>
  );
}
