import { motion } from "framer-motion";

const posColor = {
  PG: "bg-blue-500",
  SG: "bg-emerald-500",
  SF: "bg-yellow-500",
  PF: "bg-orange-500",
  C: "bg-red-500"
};

export default function PlayerCard({ player, onPick, disabled }) {
  return (
    <motion.div
      whileHover={disabled ? {} : { y: -6, scale: 1.02 }}
      className={`relative rounded-2xl p-4 bg-slate-900/80 border border-slate-700/60 shadow-card
                  ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer card-glow"}`}
      onClick={() => !disabled && onPick(player)}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display text-2xl text-white leading-tight">
            {player.name}
          </div>
          <div className="flex gap-1 mt-1">
            {player.positions.map(p => (
              <span
                key={p}
                className={`${posColor[p]} text-[10px] font-bold px-1.5 py-0.5 rounded text-black`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl text-nba-gold">
            {player.ratings.overall}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400">
            OVR
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <Stat label="PPG" value={player.stats.ppg.toFixed(1)} />
        <Stat label="RPG" value={player.stats.rpg.toFixed(1)} />
        <Stat label="APG" value={player.stats.apg.toFixed(1)} />
      </div>
    </motion.div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-slate-800/60 rounded-lg py-1">
      <div className="font-bold text-white">{value}</div>
      <div className="text-[10px] text-slate-400">{label}</div>
    </div>
  );
}