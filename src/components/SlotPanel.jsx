const SLOTS = ["PG", "SG", "SF", "PF", "C", "SIXTH"];

export default function SlotPanel({ slots, onSelectEmpty }) {
  return (
    <div className="rounded-2xl bg-slate-900/70 border border-slate-700/60 p-4 w-72">
      <div className="font-display text-xl mb-3 text-white">SEU TIME</div>
      <div className="space-y-2">
        {SLOTS.map(slot => {
          const p = slots[slot];
          return (
            <div
              key={slot}
              onClick={() => !p && onSelectEmpty?.(slot)}
              className={`flex items-center justify-between rounded-xl px-3 py-2 border
                ${
                  p
                    ? "bg-emerald-900/30 border-emerald-700/40"
                    : "bg-slate-800/40 border-slate-700/50 cursor-pointer hover:border-nba-gold"
                }`}
            >
              <span className="text-xs font-bold text-slate-300 w-12">
                {slot === "SIXTH" ? "6º" : slot}
              </span>
              <span className="text-sm truncate flex-1 text-right">
                {p ? p.name : "— vazio —"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}