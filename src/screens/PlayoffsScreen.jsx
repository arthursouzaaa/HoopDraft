import { useGameStore } from "@/store/useGameStore.js";
import Bracket from "@/components/Bracket.jsx";

export default function PlayoffsScreen() {
  const { bracket, lineup, simulateRound, reset } = useGameStore();
  if (!bracket) return null;

  const champ = bracket.series.find(s => s.id === "FINAL" && s.done)?.winner;

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-4xl text-nba-gold">HOOPDRAFT · PLAYOFFS</h1>
          <p className="text-slate-400 text-sm">
            Força: OFF {lineup.strength.offense.toFixed(1)} · DEF{" "}
            {lineup.strength.defense.toFixed(1)}
          </p>
        </div>
        <button
          onClick={reset}
          className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm"
        >
          Novo Draft
        </button>
      </header>

      {champ ? (
        <div className="text-center py-20">
          <div className="font-display text-6xl text-nba-gold">🏆 CAMPEÃO 🏆</div>
          <div className="text-3xl mt-4">{champ.name}</div>
        </div>
      ) : (
        <Bracket bracket={bracket} onSimRound={simulateRound} />
      )}
    </div>
  );
}