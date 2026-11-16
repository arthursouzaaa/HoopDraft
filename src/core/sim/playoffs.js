import { simulateGame } from "./gameSim.js";
import { rng } from "../util/rng.js";

export function buildBracket(userTeam, allTeams, seed) {
  const rand = rng(seed);
  const pool = Object.values(allTeams).filter(t => t.key !== userTeam.key);
  const shuffled = [...pool].sort(() => rand() - 0.5).slice(0, 15);
  const all = [userTeam, ...shuffled];
  const west = all.slice(0, 8).map((t, i) => ({ ...t, seed: i + 1 }));
  const east = all.slice(8, 16).map((t, i) => ({ ...t, seed: i + 1 }));
  return {
    seed,
    round: 1,
    series: buildRoundSeries(west, east),
    userTeamKey: userTeam.key,
    champion: null
  };
}

function buildRoundSeries(west, east) {
  const pairs = teams => [
    [teams[0], teams[7]],
    [teams[3], teams[4]],
    [teams[1], teams[6]],
    [teams[2], teams[5]]
  ];
  const series = [];
  [...pairs(west), ...pairs(east)].forEach(([a, b], i) => {
    series.push({
      id: `R1-${i}`,
      round: 1,
      a,
      b,
      winsA: 0,
      winsB: 0,
      games: [],
      done: false
    });
  });
  return series;
}

export function simulateSeries(series, seedBase) {
  const format = ["A", "A", "B", "B", "A", "B", "A"];
  const result = { ...series, winsA: 0, winsB: 0, games: [], done: false };
  let gameIdx = 0;
  while (result.winsA < 4 && result.winsB < 4) {
    const homeIsA = format[gameIdx] === "A";
    const home = homeIsA ? result.a : result.b;
    const away = homeIsA ? result.b : result.a;
    const game = simulateGame(home, away, seedBase + gameIdx * 41);
    result.games.push(game);
    if (game.winner.key === result.a.key) result.winsA++;
    else result.winsB++;
    gameIdx++;
  }
  result.done = true;
  result.winner = result.winsA === 4 ? result.a : result.b;
  return result;
}

export function simulateRound(bracket) {
  const nextSeries = bracket.series.map(s =>
    s.done ? s : simulateSeries(s, bracket.seed + bracket.round * 1000)
  );
  if (nextSeries.every(s => s.done) && bracket.round < 4) {
    return advanceRound(bracket, nextSeries);
  }
  return { ...bracket, series: nextSeries };
}

function advanceRound(bracket, doneSeries) {
  const winners = doneSeries.map(s => s.winner);
  if (bracket.round === 3) {
    const finalSeries = {
      id: "FINAL",
      round: 4,
      a: winners[0],
      b: winners[1],
      winsA: 0,
      winsB: 0,
      games: [],
      done: false
    };
    return { ...bracket, round: 4, series: [finalSeries] };
  }
  const next = [];
  for (let i = 0; i < winners.length; i += 2) {
    next.push({
      id: `R${bracket.round + 1}-${i / 2}`,
      round: bracket.round + 1,
      a: winners[i],
      b: winners[i + 1],
      winsA: 0,
      winsB: 0,
      games: [],
      done: false
    });
  }
  return { ...bracket, round: bracket.round + 1, series: next };
}