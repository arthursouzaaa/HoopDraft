import { create } from "zustand";
import { TEAMS, allPlayers } from "@/data/index.js";
import {
  createDraft,
  roll,
  rerollTeam,
  rerollYear,
  selectPlayer
} from "@/core/draft/draftEngine.js";
import { computeTeamStrength } from "@/core/sim/teamStrength.js";
import { buildBracket, simulateRound } from "@/core/sim/playoffs.js";

const PLAYERS = allPlayers();

export const useGameStore = create((set, get) => ({
  screen: "draft",
  seed: Math.floor(Math.random() * 1e9),
  draft: null,
  lineup: null,
  bracket: null,
  lastGame: null,

  startDraft: () => {
    const seed = Math.floor(Math.random() * 1e9);
    const d = createDraft({ teams: TEAMS, seed });
    set({ draft: roll(d, TEAMS), seed, screen: "draft" });
  },

  rerollTeam: () => set({ draft: rerollTeam(get().draft, TEAMS) }),
  rerollYear: () => set({ draft: rerollYear(get().draft, TEAMS) }),

  pick: (playerId, slot) => {
    const d = get().draft;
    const next = selectPlayer(d, playerId, slot, TEAMS);
    set({ draft: next });

    if (next.phase === "COMPLETE") {
      const slots = {};
      for (const s of Object.keys(next.slots)) {
        slots[s] = PLAYERS[next.slots[s]];
      }
      const lineup = { slots };
      lineup.strength = computeTeamStrength(lineup);

      const userTeam = {
        key: "USER",
        teamId: "USER",
        season: 0,
        name: "Seu Time",
        slots,
        strength: lineup.strength
      };
      const bracket = buildBracket(userTeam, TEAMS, next.seed + 999);
      set({ lineup, bracket, screen: "playoffs" });
    }
  },

  simulateRound: () => {
    const b = get().bracket;
    set({ bracket: simulateRound(b) });
  },

  viewLastGame: game => set({ lastGame: game, screen: "boxscore" }),
  back: () => set({ screen: "playoffs" }),
  reset: () =>
    set({ screen: "draft", draft: null, lineup: null, bracket: null })
}));