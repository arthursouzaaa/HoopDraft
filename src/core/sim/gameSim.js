import { rng } from "../util/rng.js";
import { clamp, pickWeighted } from "../util/math.js";
import { SIM } from "./constants.js";
import { initRotation, updateFatigue, maybeSubstitute } from "./rotation.js";

export function simulateGame(teamA, teamB, seed) {
  const rand = rng(seed);
  const boxA = initBox(teamA);
  const boxB = initBox(teamB);
  const rotA = initRotation(teamA);
  const rotB = initRotation(teamB);
  const quarters = [];
  let scoreA = 0, scoreB = 0;

  for (let q = 1; q <= 4; q++) {
    let qA = 0, qB = 0;
    for (let i = 0; i < SIM.POSSESSIONS / 4; i++) {
      qA += simulatePossession(teamA, teamB, boxA, rotA, rand, true);
      qB += simulatePossession(teamB, teamA, boxB, rotB, rand, false);
    }
    quarters.push({ q, a: qA, b: qB });
    scoreA += qA;
    scoreB += qB;
  }

  let ot = 0;
  while (scoreA === scoreB && ot < SIM.MAX_OT) {
    ot++;
    for (let i = 0; i < SIM.OT_POSSESSIONS; i++) {
      scoreA += simulatePossession(teamA, teamB, boxA, rotA, rand, true);
      scoreB += simulatePossession(teamB, teamA, boxB, rotB, rand, false);
    }
    quarters.push({ q: `OT${ot}`, a: scoreA, b: scoreB });
  }

  return {
    teamA,
    teamB,
    scoreA,
    scoreB,
    quarters,
    boxA,
    boxB,
    winner: scoreA > scoreB ? teamA : teamB,
    mvp: pickMVP(boxA, boxB, scoreA > scoreB ? teamA : teamB)
  };
}

function initBox(team) {
  const box = {};
  for (const slot of ["PG", "SG", "SF", "PF", "C", "SIXTH"]) {
    const p = team.slots[slot];
    box[p.id] = {
      id: p.id,
      name: p.name,
      pts: 0,
      reb: 0,
      ast: 0,
      fga: 0,
      tpm: 0,
      tov: 0
    };
  }
  return box;
}

function simulatePossession(att, def, box, rot, rand, isHome) {
  updateFatigue(rot);
  maybeSubstitute(rot);
  const lineup = rot.onCourt;

  const diff = (att.strength.offense - def.strength.defense) / 100;
  let pScore = SIM.BASE_SCORE_PROB + diff * 0.3;
  if (isHome) pScore += SIM.HOME_ADVANTAGE;
  pScore += (rand() - 0.5) * SIM.ZEBRA_NOISE;
  pScore = clamp(pScore, 0.3, 0.62);

  if (rand() > pScore) return 0;

  const shooter = pickWeighted(lineup, p => p.stats.ppg, rand);
  const points = pickPoints(shooter, rand);
  box[shooter.id].pts += points;
  box[shooter.id].fga += 1;
  if (points === 3) box[shooter.id].tpm += 1;

  if (rand() < 0.6) {
    const others = lineup.filter(p => p.id !== shooter.id);
    const ast = pickWeighted(others, p => p.stats.apg, rand);
    box[ast.id].ast += 1;
  }
  const reb = pickWeighted(lineup, p => p.stats.rpg, rand);
  box[reb.id].reb += 1;

  return points;
}

function pickPoints(p, rand) {
  const tpp = (p.stats.tpp || 35) / 100;
  return rand() < tpp * 0.75 ? 3 : 2;
}

function pickMVP(boxA, boxB, winner) {
  const winnerBox = winner.key === Object.keys(boxA)[0]?.split("-")[0] ? boxA : boxB;
  // fallback: escolhe o maior pontuador dentre os dois boxes
  let best = null, bestScore = -1;
  for (const box of [boxA, boxB]) {
    for (const id of Object.keys(box)) {
      const b = box[id];
      const score = b.pts + b.reb * 1.1 + b.ast * 1.3;
      if (score > bestScore) {
        bestScore = score;
        best = b;
      }
    }
  }
  return { playerId: best.id, name: best.name, line: best, team: winner };
}