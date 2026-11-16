import { describe, it, expect } from "vitest";
import {
  createDraft,
  roll,
  selectPlayer,
  rerollTeam,
  rerollYear
} from "../src/core/draft/draftEngine.js";
import { SAMPLE_TEAMS } from "../src/data/sample.js";

describe("draftEngine", () => {
  it("roll sorteia uma oferta válida", () => {
    const d = roll(createDraft({ teams: SAMPLE_TEAMS, seed: 42 }), SAMPLE_TEAMS);
    expect(d.currentOffer).toBeTruthy();
    expect(SAMPLE_TEAMS[d.currentOffer.key]).toBeTruthy();
  });

  it("rerollTeam mantém ano e troca time", () => {
    const d = roll(createDraft({ teams: SAMPLE_TEAMS, seed: 42 }), SAMPLE_TEAMS);
    const r = rerollTeam(d, SAMPLE_TEAMS);
    expect(r.currentOffer.season).toBe(d.currentOffer.season);
    expect(r.currentOffer.teamId).not.toBe(d.currentOffer.teamId);
    expect(r.rerolls.team).toBe(0);
  });

  it("rerollYear mantém time e troca ano", () => {
    const d = roll(createDraft({ teams: SAMPLE_TEAMS, seed: 42 }), SAMPLE_TEAMS);
    const r = rerollYear(d, SAMPLE_TEAMS);
    expect(r.currentOffer.teamId).toBe(d.currentOffer.teamId);
    expect(r.currentOffer.season).not.toBe(d.currentOffer.season);
    expect(r.rerolls.year).toBe(0);
  });

  it("fluxo completo de 6 picks termina em COMPLETE", () => {
    let d = roll(createDraft({ teams: SAMPLE_TEAMS, seed: 7 }), SAMPLE_TEAMS);
    const slotOrder = ["PG", "SG", "SF", "PF", "C", "SIXTH"];
    for (const slot of slotOrder) {
      while (d.phase === "ROLLING") d = roll(d, SAMPLE_TEAMS);
      const offer = SAMPLE_TEAMS[d.currentOffer.key];
      const pick = offer.roster.find(
        p => p.positions.includes(slot) || slot === "SIXTH"
      );
      d = selectPlayer(d, pick.id, slot, SAMPLE_TEAMS);
    }
    expect(d.phase).toBe("COMPLETE");
    expect(Object.values(d.slots).filter(Boolean).length).toBe(6);
  });
});