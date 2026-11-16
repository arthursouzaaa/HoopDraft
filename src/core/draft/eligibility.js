export function canFillSlot(player, slot) {
  if (slot === "SIXTH") return true;
  return player.positions.includes(slot);
}

export function availableSlots(player, slots) {
  return Object.keys(slots).filter(
    s => slots[s] === null && canFillSlot(player, s)
  );
}

export function rosterHasEligible(roster, slots) {
  return roster.some(p => availableSlots(p, slots).length > 0);
}