import { WorkoutSplit } from 'shared';

const SPLIT_LABELS: Record<string, string> = {
  [WorkoutSplit.FULL_BODY]: 'Full Body',
  [WorkoutSplit.UPPER_LOWER]: 'Upper/Lower',
  [WorkoutSplit.PPL]: 'Push Pull Legs',
  [WorkoutSplit.PUSH_PULL]: 'Push/Pull',
  [WorkoutSplit.BRO_SPLIT]: 'Bro Split',
  [WorkoutSplit.TORSO_LIMB]: 'Torso/Limb',
  [WorkoutSplit.ARNOLD]: 'Arnold Split',
};

/** Maps a WorkoutSplit enum value to its Czech display label. Falls back to the raw value if no label is defined. */
export const formatSplit = (split: string): string => SPLIT_LABELS[split] ?? split;

/** Formats a date string as a human-readable Czech label, with special cases for today and yesterday. */
export const formatSessionDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === now.toDateString()) return 'Dnes';
  if (date.toDateString() === yesterday.toDateString()) return 'Včera';

  return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' });
};

/** Formats a date string as a short localized Czech date. */
export const formatShortDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('cs-CZ');

/** Formats a duration in minutes. Returns an em dash for undefined or zero. */
export const formatDuration = (mins?: number): string => (mins ? `${mins} min` : '—');

/** Scales total volume to thousands and formats with one decimal place. */
export const formatVolume = (vol: number): string => (vol / 1000).toFixed(1);
