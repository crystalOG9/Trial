export type NetworkPhase =
  | "hero"
  | "problem"
  | "human-ai"
  | "how-it-works"
  | "demo"
  | "solutions"
  | "human-control"
  | "cta";

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function dist2(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

export function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function phaseOrganize(phase: NetworkPhase) {
  switch (phase) {
    case "problem":
      return 0.12;
    case "human-ai":
      return 0.55;
    case "how-it-works":
      return 0.7;
    case "demo":
      return 0.78;
    case "solutions":
      return 0.82;
    case "human-control":
      return 0.88;
    case "cta":
      return 1;
    default:
      return 0.72;
  }
}

export function phaseFragment(phase: NetworkPhase) {
  return phase === "problem" ? 0.72 : phase === "human-ai" ? 0.28 : 0.08;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
