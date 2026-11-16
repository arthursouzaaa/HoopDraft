import { SAMPLE_TEAMS } from "./sample.js";

export const TEAMS = SAMPLE_TEAMS;

export function allPlayers(teams = TEAMS) {
  const map = {};
  for (const key of Object.keys(teams)) {
    for (const p of teams[key].roster) map[p.id] = p;
  }
  return map;
}