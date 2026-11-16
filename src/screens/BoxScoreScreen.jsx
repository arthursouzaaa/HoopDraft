import { useGameStore } from "@/store/useGameStore.js";

export default function BoxScoreScreen() {
  const { lastGame, back } = useGameStore();
  if (!lastGame) return null;

  const renderBox = (team, box, score) => (
    <div className="flex-1">
      <div className="font-display text-2xl mb-2">
        {team.name} — {score}
      </div>
      <table className="w-full text-sm">
        <thead className="text-slate-400 text-xs">
          <tr>
            <th className="text-left">Jogador</th>
            <th>PTS</th>
            <th>REB</th>
            <th>AST</th>
            <th>3PM</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(box).map(b => (
            <tr key={b.id} className="border-t border-slate-800">
              <td className="text-left py-1">{b.name}</td>
              <td className="text-center">{b.pts}</td>
              <td className="text-center">{b.reb}</td>
              <td className="text-center">{b.ast}</td>
              <td className="text-center">{b.tpm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={back} className="mb-4 text-slate-400 hover:text-white">
        ← Voltar
      </button>
      <h1 className="font-display text-4xl text-nba-gold mb-6">BOX SCORE</h1>
      <div className="flex gap-6">
        {renderBox(lastGame.teamA, lastGame.boxA, lastGame.scoreA)}
        {renderBox(lastGame.teamB, lastGame.boxB, lastGame.scoreB)}
      </div>
      <div className="mt-6 text-center text-slate-300">
        MVP: <span className="text-nba-gold font-bold">{lastGame.mvp.name}</span> —{" "}
        {lastGame.mvp.line.pts} PTS
      </div>
    </div>
  );
}