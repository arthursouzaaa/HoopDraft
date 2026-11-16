import { describe, it, expect } from "vitest";
import { simulateGame } from "../src/core/sim/gameSim.js";
import { computeTeamStrength } from "../src/core/sim/teamStrength.js";
import { SAMPLE_TEAMS } from "../src/data/sample.js";

function makeTeam(key) {
  const t = SAMPLE_TEAMS[key];
  const slots = { PG: null, SG: null, SF: null, PF: null, C: null, SIXTH: null };
  for (const p of t.roster) {
    for (const slot of ["PG", "SG", "SF", "PF", "C"]) {
      if (!slots[slot] && p.positions.includes(slot)) {
        slots[slot] = p;
        break;
      }
    }
  }
  slots.SIXTH = t.roster.find(p => !Object.values(slots).includes(p));
  return {
    key,
    teamId: t.teamId,
    name: t.name,
    slots,
    strength: computeTeamStrength({ slots })
  };
}

describe("gameSim", () => {
  it("seed fixa produz placar fixo", () => {
    const a = makeTeam("GSW-2016");
    const b = makeTeam("CLE-2016");
    const r1 = simulateGame(a, b, 123);
    const r2 = simulateGame(a, b, 123);
    expect(r1.scoreA).toBe(r2.scoreA);
    expect(r1.scoreB).toBe(r2.scoreB);
  });

  it("GSW 2016 vence CHI 2011 na maioria das sims", () => {
    const a = makeTeam("GSW-2016");
    const b = makeTeam("CHI-2011");
    let wins = 0;
    for (let s = 0; s < 200; s++) {
      const r = simulateGame(a, b, s);
      if (r.winner.key === a.key) wins++;
    }
    expect(wins / 200).toBeGreaterThan(0.6);
  });

  it("box score bate com placar", () => {
    const a = makeTeam("LAL-2010");
    const b = makeTeam("SAS-2014");
    const r = simulateGame(a, b, 999);
    const sumA = Object.values(r.boxA).reduce((s, p) => s + p.pts, 0);
    const sumB = Object.values(r.boxB).reduce((s, p) => s + p.pts, 0);
    expect(sumA).toBe(r.scoreA);
    expect(sumB).toBe(r.scoreB);
  });
});