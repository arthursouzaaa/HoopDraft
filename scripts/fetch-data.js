import fs from "fs/promises";
import path from "path";

const YEARS = Array.from({ length: 11 }, (_, i) => 2010 + i);
const OUT_DIR = "src/data/real";
const CACHE = ".cache/espn";
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getJson(url, tries = 3) {
  const cacheKey = Buffer.from(url).toString("base64url").slice(0, 120);
  const cachePath = path.join(CACHE, `${cacheKey}.json`);
  try {
    return JSON.parse(await fs.readFile(cachePath, "utf-8"));
  } catch {}
  for (let t = 0; t < tries; t++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      await fs.mkdir(CACHE, { recursive: true });
      await fs.writeFile(cachePath, JSON.stringify(data));
      return data;
    } catch (e) {
      if (t === tries - 1) throw e;
      await sleep(500 * (t + 1));
    }
  }
}

function normalizePositions(abbrev) {
  const map = {
    PG: ["PG", "SG"], SG: ["SG", "PG"], SF: ["SF", "SG"], PF: ["PF", "C"], C: ["C", "PF"],
    G: ["PG", "SG"], F: ["SF", "PF"], "G-F": ["SG", "SF"], "F-G": ["SF", "SG"],
    "F-C": ["PF", "C"], "C-F": ["C", "PF"]
  };
  return map[abbrev] || ["SF"];
}

async function fetchTeams() {
  const data = await getJson("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams");
  return data.sports[0].leagues[0].teams.map(t => ({
    teamId: t.team.abbreviation,
    name: t.team.displayName,
    id: t.team.id
  }));
}

async function fetchRoster(team, year) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${team.id}/roster?season=${year}`;
  const data = await getJson(url);
  return data.athletes || [];
}

async function fetchStats(athleteId, year) {
  const url = `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${athleteId}/stats?season=${year}`;
  try {
    const data = await getJson(url);
    const cat = data.categories?.find(c => c.name === "regularSeason");
    const s = cat?.statistics?.[0];
    if (!s) return null;
    const idx = Object.fromEntries(cat.names.map((n, i) => [n, i]));
    const num = n => Number(s.stats[idx[n]] ?? 0) || 0;
    return {
      gp: num("gamesPlayed"), mpg: num("avgMinutes"),
      ppg: num("avgPoints"), rpg: num("avgRebounds"), apg: num("avgAssists"),
      spg: num("avgSteals"), bpg: num("avgBlocks"), tov: num("avgTurnovers"),
      fgp: num("fieldGoalPct"), tpp: num("threePointFieldGoalPct"), ftp: num("freeThrowPct"),
      usage: num("usageRate"), per: num("PER"), bpm: 0,
      fga: num("avgFieldGoalsAttempted"), fta: num("avgFreeThrowsAttempted")
    };
  } catch {
    return null;
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const teams = await fetchTeams();
  for (const year of YEARS) {
    const teamsOut = {}, playersOut = {};
    for (const team of teams) {
      const roster = await fetchRoster(team, year);
      await sleep(300);
      const players = [];
      for (const a of roster) {
        const stats = await fetchStats(a.id, year);
        await sleep(200);
        if (!stats || stats.mpg < 10) continue;
        const positions = normalizePositions(a.position?.abbreviation);
        const id = `${a.lastName.toLowerCase()}-${year}`;
        playersOut[id] = {
          id,
          name: a.fullName,
          teamId: team.teamId,
          season: year,
          positions,
          stats,
          ratings: { overall: 70, offRating: 70, defRating: 70 }
        };
        players.push(id);
      }
      if (!players.length) continue;
      const hasC = players.some(id => playersOut[id].positions.includes("C"));
      if (!hasC) playersOut[players[0]].positions.push("C");
      teamsOut[`${team.teamId}-${year}`] = {
        key: `${team.teamId}-${year}`,
        teamId: team.teamId,
        season: year,
        name: team.name,
        roster: players
      };
    }
    await fs.writeFile(
      path.join(OUT_DIR, `${year}.json`),
      JSON.stringify({ players: playersOut, teams: teamsOut }, null, 2)
    );
    console.log(`✓ ${year}: ${Object.keys(teamsOut).length} times`);
  }
}

main().catch(console.error);