export const WorkoutSplit = {
  FULL_BODY: 'FULL_BODY',
  UPPER_LOWER: 'UPPER_LOWER',
  PPL: 'PPL',
  PUSH_PULL: 'PUSH_PULL',
  BRO_SPLIT: 'BRO_SPLIT',
  TORSO_LIMB: 'TORSO_LIMB',
  ARNOLD: 'ARNOLD',
} as const;

export type WorkoutSplit = (typeof WorkoutSplit)[keyof typeof WorkoutSplit];

export const SessionStatus = {
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED',
} as const;

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

export type WorkoutSession = {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  split: WorkoutSplit;
  status: SessionStatus;
  note?: string;
};
