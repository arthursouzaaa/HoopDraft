export default function Bracket({ bracket, onSimRound }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-3xl text-nba-gold">
          {bracket.round === 4 ? "FINAL NBA" : `RODADA ${bracket.round}`}
        </h2>
        <button
          onClick={onSimRound}
          className="bg-nba-red hover:bg-red-700 px-6 py-2 rounded-lg font-bold"
        >
          SIMULAR RODADA
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bracket.series.map(s => (
          <div
            key={s.id}
            className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-3"
          >
            <TeamRow team={s.a} wins={s.winsA} winner={s.done && s.winner?.key === s.a.key} />
            <div className="my-1 border-t border-slate-700/60" />
            <TeamRow team={s.b} wins={s.winsB} winner={s.done && s.winner?.key === s.b.key} />
            {s.done && (
              <div className="mt-2 text-xs text-slate-400">
                {s.games.length} jogos · {s.winner.name} avança
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamRow({ team, wins, winner }) {
  return (
    <div className={`flex justify-between items-center py-1 ${winner ? "text-nba-gold font-bold" : ""}`}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 w-6">#{team.seed}</span>
        <span className="text-sm">{team.name}</span>
      </div>
      <span className="font-display text-lg">{wins}</span>
    </div>
  );
}