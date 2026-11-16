import { clamp, z } from "../util/math.js";

export function computeOffRating(s) {
  const ppgN = z(s.ppg, 8, 28);
  const apgN = z(s.apg, 1, 9);
  const ts = s.ppg / (2 * ((s.fga || 10) + 0.44 * (s.fta || 2)));
  const tsN = z(ts, 0.48, 0.65);
  const tovN = 1 - z(s.tov || 2, 1, 4.5);
  const usgN = z(s.usage || 20, 15, 33);
  return 100 * (0.28 * ppgN + 0.2 * apgN + 0.25 * tsN + 0.1 * tovN + 0.17 * usgN);
}

export function computeDefRating(s) {
  const spgN = z(s.spg || 0.5, 0.3, 2.2);
  const bpgN = z(s.bpg || 0.3, 0.1, 2.5);
  const drbN = z((s.rpg || 3) * 0.75, 1, 9);
  const bpmN = z(s.bpm || 0, -3, 6);
  return 100 * (0.3 * spgN + 0.3 * bpgN + 0.2 * drbN + 0.2 * bpmN);
}

export function computeOverall(s) {
  const off = computeOffRating(s);
  const def = computeDefRating(s);
  const minN = z(s.mpg || 20, 15, 36);
  const raw = 0.55 * off + 0.35 * def + 0.1 * (minN * 100);
  return clamp(Math.round(40 + raw * 0.6), 55, 99);
}