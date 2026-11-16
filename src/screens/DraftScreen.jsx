import { useState } from "react";
import { useGameStore } from "@/store/useGameStore.js";
import { TEAMS } from "@/data/index.js";
import PlayerCard from "@/components/PlayerCard.jsx";
import SlotPanel from "@/components/SlotPanel.jsx";
import { availableSlots } from "@/core/draft/eligibility.js";

export default function DraftScreen() {
  const { draft, startDraft, rerollTeam, rerollYear, pick } = useGameStore();
  const [pendingPlayer, setPendingPlayer] = useState(null);

  if (!draft) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <img src="/logo.svg" alt="HoopDraft" className="w-[420px]" />
        <p className="text-slate-300 text-lg">
          Monte seu time dos sonhos e vença os playoffs.
        </p>
        <button
          onClick={startDraft}
          className="bg-nba-red hover:bg-red-700 px-10 py-4 rounded-xl font-display text-2xl transition"
        >
          INICIAR DRAFT
        </button>
        <p className="text-xs text-slate-500 mt-8">HoopDraft — NBA Draft &amp; Playoff Simulator</p>
      </div>
    );
  }

  const offer = draft.currentOffer ? TEAMS[draft.currentOffer.key] : null;
  const filled = Object.values(draft.slots).filter(Boolean).length;

  const handlePick = player => {
    const avail = availableSlots(player, draft.slots);
    if (avail.length === 1) {
      pick(player.id, avail[0]);
      setPendingPlayer(null);
    } else {
      setPendingPlayer({ player, avail });
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-nba-gold">HOOPDRAFT</h1>
          <p className="text-slate-400 text-sm">
            Rodada {draft.round} / 6 · Seed {draft.seed}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={rerollTeam}
            disabled={draft.rerolls.team <= 0}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 px-4 py-2 rounded-lg text-sm"
          >
            Reroll Time ({draft.rerolls.team})
          </button>
          <button
            onClick={rerollYear}
            disabled={draft.rerolls.year <= 0}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 px-4 py-2 rounded-lg text-sm"
          >
            Reroll Ano ({draft.rerolls.year})
          </button>
        </div>
      </header>

      <div className="flex gap-6">
        <div className="flex-1">
          {offer && (
            <>
              <div className="mb-4">
                <span className="font-display text-2xl text-white">
                  {offer.teamId} {offer.season}
                </span>
                <span className="ml-2 text-slate-400 text-sm">{offer.name}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offer.roster.map(p => (
                  <PlayerCard
                    key={p.id}
                    player={p}
                    disabled={availableSlots(p, draft.slots).length === 0}
                    onPick={handlePick}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <SlotPanel slots={draft.slots} />
      </div>

      {pendingPlayer && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPendingPlayer(null)}
        >
          <div
            className="bg-slate-900 rounded-2xl p-6 w-96"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl mb-4">
              Escolha a posição — {pendingPlayer.player.name}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {pendingPlayer.avail.map(slot => (
                <button
                  key={slot}
                  onClick={() => {
                    pick(pendingPlayer.player.id, slot);
                    setPendingPlayer(null);
                  }}
                  className="bg-slate-800 hover:bg-nba-blue py-3 rounded-lg font-bold"
                >
                  {slot === "SIXTH" ? "6º HOMEM" : slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-slate-400 text-sm">
        {filled}/6 jogadores escalados
      </div>
    </div>
  );
}