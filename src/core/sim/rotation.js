import { SIM } from "./constants.js";

export function initRotation(lineup) {
  const starters = ["PG", "SG", "SF", "PF", "C"].map(s => lineup.slots[s]);
  const sixth = lineup.slots.SIXTH;
  return {
    onCourt: [...starters],
    bench: [sixth],
    fatigue: Object.fromEntries([...starters, sixth].map(p => [p.id, 0]))
  };
}

export function updateFatigue(rot) {
  for (const p of rot.onCourt) {
    rot.fatigue[p.id] = Math.min(1, rot.fatigue[p.id] + SIM.FATIGUE_PER_POSS);
  }
  for (const p of rot.bench) {
    rot.fatigue[p.id] = Math.max(0, rot.fatigue[p.id] - SIM.FATIGUE_REST_PER_POSS);
  }
}

export function maybeSubstitute(rot) {
  const tired = rot.onCourt
    .filter(p => rot.fatigue[p.id] > SIM.FATIGUE_SUB_THRESHOLD)
    .sort((a, b) => rot.fatigue[b.id] - rot.fatigue[a.id]);
  if (tired.length === 0) return;

  const sixth = rot.bench[0];
  if (sixth && rot.fatigue[sixth.id] < 0.5) {
    const out = tired[0];
    rot.onCourt = rot.onCourt.filter(p => p.id !== out.id);
    rot.onCourt.push(sixth);
    rot.bench = [out];
  }
}