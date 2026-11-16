import { rng } from "../util/rng.js";
import { rosterHasEligible } from "./eligibility.js";

const SLOTS = ["PG", "SG", "SF", "PF", "C", "SIXTH"];

export function createDraft({ teams, seed }) {
  return {
    phase: "ROLLING",
    round: 1,
    seed,
    rerolls: { team: 1, year: 1 },
    slots: Object.fromEntries(SLOTS.map(s => [s, null])),
    currentOffer: null,
    usedOffers: [],
    history: []
  };
}

function allPairs(teams) {
  return Object.keys(teams).map(key => ({
    teamId: teams[key].teamId,
    season: teams[key].season,
    key
  }));
}

function eligiblePairs(pairs, state, teams) {
  return pairs.filter(p => {
    if (state.usedOffers.includes(p.key)) return false;
    return rosterHasEligible(teams[p.key].roster, state.slots);
  });
}

export function roll(state, teams) {
  const rand = rng(state.seed + state.round * 977 + state.history.length * 31);
  const pool = eligiblePairs(allPairs(teams), state, teams);
  if (pool.length === 0) return { ...state, phase: "STUCK" };
  const pick = pool[Math.floor(rand() * pool.length)];
  return {
    ...state,
    phase: "SHOWING_ROSTER",
    currentOffer: { teamId: pick.teamId, season: pick.season, key: pick.key }
  };
}

export function rerollTeam(state, teams) {
  if (state.rerolls.team <= 0 || !state.currentOffer) return state;
  const pool = allPairs(teams).filter(
    p =>
      p.season === state.currentOffer.season &&
      p.teamId !== state.currentOffer.teamId &&
      !state.usedOffers.includes(p.key) &&
      rosterHasEligible(teams[p.key].roster, state.slots)
  );
  if (pool.length === 0) return state;
  const rand = rng(state.seed + state.round * 131 + 7);
  const pick = pool[Math.floor(rand() * pool.length)];
  return {
    ...state,
    rerolls: { ...state.rerolls, team: state.rerolls.team - 1 },
    currentOffer: { teamId: pick.teamId, season: pick.season, key: pick.key }
  };
}

export function rerollYear(state, teams) {
  if (state.rerolls.year <= 0 || !state.currentOffer) return state;
  const pool = allPairs(teams).filter(
    p =>
      p.teamId === state.currentOffer.teamId &&
      p.season !== state.currentOffer.season &&
      !state.usedOffers.includes(p.key) &&
      rosterHasEligible(teams[p.key].roster, state.slots)
  );
  if (pool.length === 0) return state;
  const rand = rng(state.seed + state.round * 257 + 11);
  const pick = pool[Math.floor(rand() * pool.length)];
  return {
    ...state,
    rerolls: { ...state.rerolls, year: state.rerolls.year - 1 },
    currentOffer: { teamId: pick.teamId, season: pick.season, key: pick.key }
  };
}

export function selectPlayer(state, playerId, slot, teams) {
  if (state.slots[slot] !== null) return state;
  const nextSlots = { ...state.slots, [slot]: playerId };
  const nextHistory = [
    ...state.history,
    { round: state.round, offer: state.currentOffer.key, playerId, slot }
  ];
  const nextUsed = [...state.usedOffers, state.currentOffer.key];
  const filled = Object.values(nextSlots).filter(Boolean).length;

  if (filled === SLOTS.length) {
    return {
      ...state,
      slots: nextSlots,
      history: nextHistory,
      usedOffers: nextUsed,
      phase: "COMPLETE"
    };
  }

  return roll(
    {
      ...state,
      slots: nextSlots,
      history: nextHistory,
      usedOffers: nextUsed,
      round: state.round + 1,
      phase: "ROLLING"
    },
    teams
  );
}