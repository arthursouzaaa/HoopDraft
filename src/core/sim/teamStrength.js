import { avgWithWeights, clamp } from "../util/math.js";

export function computeTeamStrength(lineup) {
  const starters = ["PG", "SG", "SF", "PF", "C"]
    .map(s => lineup.slots[s])
    .filter(Boolean);
  const sixth = lineup.slots.SIXTH;
  if (starters.length < 5 || !sixth) throw new Error("Lineup incomplete");

  const all = [...starters, sixth];
  const w = p => p.ratings.overall * (p.stats.mpg / 36);

  const offense = avgWithWeights(all, p => p.ratings.offRating, w);
  const defense = avgWithWeights(all, p => p.ratings.defRating, w);

  let chemPenalty = 0;
  ["PG", "SG", "SF", "PF", "C"].forEach(slot => {
    const p = lineup.slots[slot];
    if (p.positions[0] !== slot) chemPenalty += 0.02;
  });
  const chemistry = clamp(1 - chemPenalty, 0.9, 1.0);

  const startersOvr = avgWithWeights(starters, p => p.ratings.overall, () => 1);
  const gap = (startersOvr - sixth.ratings.overall) / 100;
  const depthFactor = clamp(1 - Math.max(0, gap) * 0.5, 0.9, 1.0);

  return {
    offense: offense * chemistry * depthFactor,
    defense: defense * chemistry * depthFactor,
    chemistry,
    depthFactor
  };
}