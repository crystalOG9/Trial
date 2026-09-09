"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import {
  CORE_EDGES,
  CORE_NODES,
  HOW_STEP_FOCUS,
  MOBILE_CORE_IDS,
  SIGNATURE_PATH,
  type CoreNodeDef,
  type NodeCategory,
  type NodeTooltip,
} from "./workflowData";
import {
  clamp,
  dist2,
  lerp,
  mulberry32,
  phaseFragment,
  phaseOrganize,
  prefersReducedMotion,
  type NetworkPhase,
} from "./networkUtils";

type SimNode = {
  def: CoreNodeDef | AmbientDef;
  x: number;
  y: number;
  tx: number;
  ty: number;
  px: number;
  py: number;
  labeled: boolean;
  reveal: number;
};

type AmbientDef = {
  id: string;
  label: string;
  category: "ambient";
  treeX: number;
  treeY: number;
  chaosX: number;
  chaosY: number;
  depth: number;
  size: number;
};

type SimEdge = {
  a: number;
  b: number;
  signature: boolean;
  flicker: number;
};

type Particle = {
  e: number;
  t: number;
  speed: number;
};

const PHASE_BY_SECTION: { id: string; phase: NetworkPhase }[] = [
  { id: "hero", phase: "hero" },
  { id: "problem", phase: "problem" },
  { id: "core-message", phase: "human-ai" },
  { id: "how-it-works", phase: "how-it-works" },
  { id: "demo", phase: "demo" },
  { id: "solutions", phase: "solutions" },
  { id: "human-control", phase: "human-control" },
  { id: "contact", phase: "cta" },
];

function isAmbient(n: CoreNodeDef | AmbientDef): n is AmbientDef {
  return n.category === "ambient";
}

function makeAmbient(count: number, seed: number): AmbientDef[] {
  const rand = mulberry32(seed);
  const nodes: AmbientDef[] = [];
  for (let i = 0; i < count; i++) {
    const treeX = 0.08 + rand() * 0.9;
    const treeY = 0.08 + rand() * 0.88;
    nodes.push({
      id: `a-${i}`,
      label: "",
      category: "ambient",
      treeX,
      treeY,
      chaosX: clamp(treeX + (rand() - 0.5) * 0.55, 0.02, 0.98),
      chaosY: clamp(treeY + (rand() - 0.5) * 0.55, 0.02, 0.98),
      depth: rand(),
      size: 1.2 + rand() * 1.8,
    });
  }
  return nodes;
}

function isUiTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      "a, button, input, textarea, select, label, nav, header, footer, [data-ui], [role='dialog']"
    )
  );
}

export function WorkflowNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, active: false });
  const phaseRef = useRef<NetworkPhase>("hero");
  const howStepRef = useRef(0);
  const reducedRef = useRef(false);
  const mobileRef = useRef(false);
  const hiddenRef = useRef(false);
  const nodesRef = useRef<SimNode[]>([]);
  const edgesRef = useRef<SimEdge[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const indexRef = useRef<Map<string, number>>(new Map());
  const hoverRef = useRef(-1);
  const selectedRef = useRef(-1);
  const pathPulseRef = useRef(0);
  const revealRef = useRef(0);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const tooltipElRef = useRef<HTMLDivElement>(null);
  const tooltipIndexRef = useRef(-1);

  const [tooltip, setTooltip] = useState<{
    nodeIndex: number;
    data: NodeTooltip;
    label: string;
  } | null>(null);
  const [reduced, setReduced] = useState(false);

  const interactiveNodes = useMemo(
    () => CORE_NODES.filter((n) => n.tooltip),
    []
  );

  const rebuild = useCallback(() => {
    const mobile = window.innerWidth < 768;
    mobileRef.current = mobile;
    const ambientCount = mobile ? 18 : 58;
    const ambient = makeAmbient(ambientCount, 42);
    const core = mobile
      ? CORE_NODES.filter((n) => MOBILE_CORE_IDS.includes(n.id))
      : CORE_NODES;

    const defs: (CoreNodeDef | AmbientDef)[] = [...core, ...ambient];
    const index = new Map<string, number>();
    defs.forEach((d, i) => index.set(d.id, i));
    indexRef.current = index;

    nodesRef.current = defs.map((def) => ({
      def,
      x: def.treeX,
      y: def.treeY,
      tx: def.treeX,
      ty: def.treeY,
      px: 0,
      py: 0,
      labeled: !isAmbient(def),
      reveal: def.id === "business" ? 1 : 0,
    }));

    const edges: SimEdge[] = [];
    const coreSet = new Set(core.map((n) => n.id));
    CORE_EDGES.forEach(([a, b]) => {
      if (!coreSet.has(a) || !coreSet.has(b)) return;
      const ia = index.get(a);
      const ib = index.get(b);
      if (ia === undefined || ib === undefined) return;
      edges.push({
        a: ia,
        b: ib,
        signature: SIGNATURE_PATH.includes(a as (typeof SIGNATURE_PATH)[number]) &&
          SIGNATURE_PATH.includes(b as (typeof SIGNATURE_PATH)[number]),
        flicker: (ia * 13 + ib * 7) % 100,
      });
    });

    const rand = mulberry32(99);
    const start = core.length;
    const extra = mobile ? 22 : 70;
    for (let i = 0; i < extra; i++) {
      const a = start + Math.floor(rand() * ambient.length);
      const near = nodesRef.current[a];
      let best = start;
      let bestD = 9;
      for (let j = 0; j < defs.length; j++) {
        if (j === a) continue;
        const n = nodesRef.current[j];
        const d = dist2(near.def.treeX, near.def.treeY, n.def.treeX, n.def.treeY);
        if (d < bestD && d > 0.002) {
          bestD = d;
          best = j;
        }
      }
      if (bestD < 0.045) {
        edges.push({ a, b: best, signature: false, flicker: i });
      }
    }
    edgesRef.current = edges;

    const pCount = mobile ? 8 : 22;
    particlesRef.current = Array.from({ length: pCount }, (_, i) => ({
      e: i % Math.max(edges.length, 1),
      t: rand(),
      speed: 0.08 + rand() * 0.12,
    }));
  }, []);

  const applyPhaseTargets = useCallback(() => {
    const organize = phaseOrganize(phaseRef.current);
    const nodes = nodesRef.current;
    const how = howStepRef.current;
    for (const n of nodes) {
      const ox = lerp(n.def.chaosX, n.def.treeX, organize);
      const oy = lerp(n.def.chaosY, n.def.treeY, organize);
      n.tx = ox;
      n.ty = oy;
      if (phaseRef.current === "human-ai" && !isAmbient(n.def)) {
        if (n.def.category === "process" || n.def.category === "automation") {
          n.tx = lerp(n.tx, 0.38, 0.25);
        }
        if (n.def.category === "human" || n.def.category === "output") {
          n.tx = lerp(n.tx, 0.78, 0.25);
        }
      }
      if (phaseRef.current === "how-it-works" && how > 0) {
        const focus = HOW_STEP_FOCUS[how] ?? [];
        const hit = focus.includes(n.def.category) || focus.includes(n.def.id);
        if (hit) {
          n.tx = lerp(n.tx, 0.72, 0.12);
        }
      }
    }
  }, []);

  const hitTest = useCallback((cx: number, cy: number) => {
    const nodes = nodesRef.current;
    let best = -1;
    let bestD = 22 * 22;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (isAmbient(n.def)) continue;
      const pad = Math.max(18, n.def.size * 3.2);
      const d = dist2(cx, cy, n.px, n.py);
      if (d < pad * pad && d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  }, []);

  const openTooltip = useCallback((index: number) => {
    const n = nodesRef.current[index];
    if (!n || isAmbient(n.def) || !("tooltip" in n.def) || !n.def.tooltip) return;
    selectedRef.current = index;
    tooltipIndexRef.current = index;
    setTooltip({
      nodeIndex: index,
      data: n.def.tooltip,
      label: n.def.label,
    });
  }, []);

  useEffect(() => {
    reducedRef.current = prefersReducedMotion();
    setReduced(reducedRef.current);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => {
      reducedRef.current = mq.matches;
      setReduced(mq.matches);
    };
    mq.addEventListener("change", onMq);

    rebuild();
    applyPhaseTargets();

    const onResize = () => {
      rebuild();
      applyPhaseTargets();
    };
    window.addEventListener("resize", onResize);

    const onVis = () => {
      hiddenRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    const io = new IntersectionObserver(
      (entries) => {
        let top: { phase: NetworkPhase; ratio: number } | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const found = PHASE_BY_SECTION.find((s) => s.id === e.target.id);
          if (!found) continue;
          if (!top || e.intersectionRatio > top.ratio) {
            top = { phase: found.phase, ratio: e.intersectionRatio };
          }
        }
        if (top) {
          phaseRef.current = top.phase;
          applyPhaseTargets();
        }
      },
      { threshold: [0.18, 0.35, 0.55], rootMargin: "-18% 0px -35% 0px" }
    );

    PHASE_BY_SECTION.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    const stepIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const step = Number((e.target as HTMLElement).dataset.howStep);
          if (step) howStepRef.current = step;
        }
      },
      { threshold: 0.6 }
    );
    document.querySelectorAll("[data-how-step]").forEach((el) => stepIo.observe(el));

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      stepIo.disconnect();
    };
  }, [applyPhaseTargets, rebuild]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      sizeRef.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();
    const signatureSet = new Set<string>(SIGNATURE_PATH);

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (hiddenRef.current) return;

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { w, h } = sizeRef.current;
      const reducedMotion = reducedRef.current;
      const mobile = mobileRef.current;
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const organize = phaseOrganize(phaseRef.current);
      const fragment = phaseFragment(phaseRef.current);

      if (!reducedMotion) {
        revealRef.current = Math.min(1, revealRef.current + dt * 0.22);
        pathPulseRef.current += dt * 0.35;
      } else {
        revealRef.current = 1;
      }

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const t = now / 1000;

      ctx.clearRect(0, 0, w, h);

      const opacityBase = mobile ? 0.38 : 0.55;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const sigIndex = SIGNATURE_PATH.indexOf(n.def.id as (typeof SIGNATURE_PATH)[number]);
        const revealGate =
          sigIndex === -1 ? revealRef.current : clamp(revealRef.current * 7 - sigIndex, 0, 1);
        n.reveal = lerp(n.reveal, revealGate, 0.08);

        if (!reducedMotion) {
          const float = 0.0035 * (1 - n.def.depth * 0.4);
          n.x = lerp(n.x, n.tx + Math.sin(t * 0.35 + i) * float, 0.045);
          n.y = lerp(n.y, n.ty + Math.cos(t * 0.28 + i * 0.7) * float, 0.045);
        } else {
          n.x = n.tx;
          n.y = n.ty;
        }

        const parallax = (n.def.depth - 0.5) * (mobile ? 4 : 10);
        n.px = n.x * w + (mx / w - 0.5) * parallax * (mouse.current.active ? 1 : 0);
        n.py = n.y * h + (my / h - 0.5) * parallax * 0.6 * (mouse.current.active ? 1 : 0);
      }

      hoverRef.current = mouse.current.active ? hitTest(mx, my) : -1;

      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const a = nodes[e.a];
        const b = nodes[e.b];
        if (!a || !b) continue;
        const vis = Math.min(a.reveal, b.reveal);
        if (vis < 0.05) continue;

        const flicker = 0.55 + 0.45 * Math.sin(t * 0.4 + e.flicker);
        const drop = fragment > 0.2 && !e.signature && (e.flicker % 10) / 10 < fragment;
        if (drop) continue;

        const hoverBoost =
          hoverRef.current === e.a || hoverRef.current === e.b || selectedRef.current === e.a || selectedRef.current === e.b
            ? 0.35
            : 0;

        const pulseAlong = e.signature
          ? 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(pathPulseRef.current * Math.PI * 2 - i))
          : 0;

        const alpha =
          (e.signature ? 0.22 : 0.07) * vis * opacityBase * (0.65 + 0.35 * organize) * flicker +
          hoverBoost +
          pulseAlong * 0.2;

        ctx.beginPath();
        const mxid = (a.px + b.px) / 2 + (a.py - b.py) * 0.08;
        const myid = (a.py + b.py) / 2 + (b.px - a.px) * 0.04;
        ctx.moveTo(a.px, a.py);
        ctx.quadraticCurveTo(mxid, myid, b.px, b.py);
        ctx.strokeStyle = e.signature
          ? `rgba(59, 130, 246, ${clamp(alpha, 0, 0.85)})`
          : `rgba(148, 163, 184, ${clamp(alpha, 0, 0.35)})`;
        ctx.lineWidth = e.signature ? 1.35 : 0.7;
        ctx.stroke();
      }

      if (!reducedMotion) {
        const particles = particlesRef.current;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const e = edges[p.e];
          if (!e) continue;
          if (fragment > 0.5 && !e.signature) continue;
          const a = nodes[e.a];
          const b = nodes[e.b];
          if (!a || !b || Math.min(a.reveal, b.reveal) < 0.4) continue;
          p.t += dt * p.speed;
          if (p.t > 1) {
            p.t = 0;
            p.e = (p.e + 7) % edges.length;
          }
          const tt = p.t;
          const px = lerp(a.px, b.px, tt);
          const py = lerp(a.py, b.py, tt);
          ctx.beginPath();
          ctx.arc(px, py, e.signature ? 1.6 : 1.1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${e.signature ? 0.7 : 0.28})`;
          ctx.fill();
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.reveal < 0.04) continue;
        const hovered = hoverRef.current === i || selectedRef.current === i;
        const sig = signatureSet.has(n.def.id);
        const dMouse = dist2(n.px, n.py, mx, my);
        const near = dMouse < 140 * 140 ? 1 - Math.sqrt(dMouse) / 140 : 0;
        const pulse = reducedMotion ? 0 : 0.5 + 0.5 * Math.sin(t * 1.6 + i);
        const r = n.def.size * (hovered ? 1.35 : 1) * (1 + pulse * 0.06);
        const cat = n.def.category as NodeCategory;

        let fill = `rgba(203, 213, 225, ${0.22 * n.reveal * opacityBase})`;
        if (cat === "automation" || sig) {
          fill = `rgba(59, 130, 246, ${(0.28 + near * 0.35 + (hovered ? 0.25 : 0)) * n.reveal})`;
        } else if (cat === "human") {
          fill = `rgba(226, 232, 240, ${(0.28 + near * 0.2) * n.reveal})`;
        } else if (cat === "company") {
          fill = `rgba(96, 165, 250, ${(0.4 + near * 0.25) * n.reveal})`;
        }

        if (hovered || (sig && pulse > 0.7)) {
          ctx.beginPath();
          ctx.arc(n.px, n.py, r * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${0.05 + (hovered ? 0.07 : 0)})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();

        if (cat === "company" || cat === "automation" || cat === "human") {
          ctx.beginPath();
          ctx.arc(n.px, n.py, r + 3.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.28 * n.reveal})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        if (n.labeled && n.reveal > 0.35 && (!mobile || sig || hovered || cat === "company")) {
          ctx.font = `${cat === "company" ? 11 : 9}px ui-sans-serif, system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = `rgba(226, 232, 240, ${clamp(0.28 + near * 0.45 + (hovered ? 0.35 : 0), 0, 0.82) * n.reveal})`;
          ctx.fillText(n.def.label, n.px, n.py + r + 5);
        }
      }

      const tip = tooltipElRef.current;
      const tipIdx = tooltipIndexRef.current;
      if (tip && tipIdx >= 0) {
        const tn = nodes[tipIdx];
        if (tn) {
          const left = clamp(tn.px + 16, 12, Math.max(12, w - 336));
          const top = clamp(tn.py - 20, 80, Math.max(80, h - 280));
          tip.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        }
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [hitTest]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, active: true };
      const near = hitTest(e.clientX, e.clientY);
      const n = near >= 0 ? nodesRef.current[near] : null;
      const clickable = n && !isAmbient(n.def) && "tooltip" in n.def && n.def.tooltip;
      document.documentElement.style.cursor =
        clickable && !isUiTarget(e.target) ? "pointer" : "";
    };
    const onLeave = () => {
      mouse.current.active = false;
      document.documentElement.style.cursor = "";
    };
    const onClick = (e: MouseEvent) => {
      if (isUiTarget(e.target)) return;
      const i = hitTest(e.clientX, e.clientY);
      if (i < 0) {
        selectedRef.current = -1;
        tooltipIndexRef.current = -1;
        setTooltip(null);
        return;
      }
      const n = nodesRef.current[i];
      if (n && !isAmbient(n.def) && n.def.tooltip) {
        openTooltip(i);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("click", onClick);
      document.documentElement.style.cursor = "";
    };
  }, [hitTest, openTooltip]);

  return (
    <div ref={wrapRef} className="fixed inset-0 z-0 overflow-hidden" aria-hidden={!tooltip}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
      />
      <div className="sr-only">
        <p>Interactive business workflow map. Activate a labeled workflow to read how it can be automated.</p>
        <ul>
          {interactiveNodes.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => {
                  const idx = indexRef.current.get(n.id);
                  if (idx !== undefined) openTooltip(idx);
                }}
              >
                {n.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {tooltip && (
        <div
          ref={tooltipElRef}
          role="dialog"
          aria-label={tooltip.data.title}
          data-ui
          className="pointer-events-auto absolute top-0 left-0 z-[45] w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[#0b1220]/95 p-4 shadow-[0_0_40px_rgba(37,99,235,0.12)] backdrop-blur-md will-change-transform"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="text-[10px] tracking-[0.18em] text-brand-400/80 mb-1">
                {tooltip.label}
              </div>
              <h3 className="text-sm font-semibold text-white">{tooltip.data.title}</h3>
            </div>
            <button
              type="button"
              className="text-muted-foreground hover:text-white p-1"
              aria-label="Close workflow details"
              onClick={() => {
                selectedRef.current = -1;
                tooltipIndexRef.current = -1;
                setTooltip(null);
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-1.5 mb-4">
            {tooltip.data.items.map((item) => (
              <li key={item} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-brand-400/80">•</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={tooltip.data.href ?? "#contact"}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 hover:text-brand-200"
            onClick={() => setTooltip(null)}
          >
            {tooltip.data.cta}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {reduced && (
        <span className="sr-only">Motion is reduced. The workflow map is shown in a static layout.</span>
      )}
    </div>
  );
}
