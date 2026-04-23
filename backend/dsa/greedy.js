/**
 * Greedy: Earliest-Free-Slot Scheduler — Pure JavaScript
 * Used in: Auto-scheduling appointments to doctors
 * Complexity: O(n log n) due to sort
 */
function earliestFreeSlot(busySlots, durationMin = 15, dayStart = 9, dayEnd = 17) {
  const sorted = [...busySlots]
    .map(s => ({ start: new Date(s.start), end: new Date(s.end) }))
    .sort((a, b) => a.start - b.start);

  const today = new Date();
  today.setHours(dayStart, 0, 0, 0);
  let cursor = new Date(today);
  const endOfDay = new Date(today);
  endOfDay.setHours(dayEnd, 0, 0, 0);

  for (const slot of sorted) {
    if (slot.start - cursor >= durationMin * 60 * 1000) {
      return { start: new Date(cursor), end: new Date(cursor.getTime() + durationMin*60000) };
    }
    if (slot.end > cursor) cursor = new Date(slot.end);
  }
  if (endOfDay - cursor >= durationMin * 60 * 1000) {
    return { start: new Date(cursor), end: new Date(cursor.getTime() + durationMin*60000) };
  }
  // next day 9 AM
  const next = new Date(today); next.setDate(next.getDate()+1); next.setHours(dayStart,0,0,0);
  return { start: next, end: new Date(next.getTime() + durationMin*60000) };
}
module.exports = { earliestFreeSlot };
