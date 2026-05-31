export type ExerciseKey =
  // Hrudník
  | 'bench-press'
  | 'incline-bench-press'
  | 'decline-bench-press'
  | 'dumbbell-press'
  | 'incline-dumbbell-press'
  | 'chest-dips'
  | 'cable-flyes'
  | 'pec-deck'
  | 'push-ups'
  | 'dumbbell-flyes'
  // Záda
  | 'deadlift'
  | 'pull-ups'
  | 'barbell-row'
  | 'cable-row'
  | 'lat-pulldown'
  | 'dumbbell-row'
  | 't-bar-row'
  | 'face-pull'
  | 'hyperextension'
  | 'chin-ups'
  | 'seated-cable-row'
  | 'straight-arm-pulldown'
  // Nohy
  | 'squat'
  | 'leg-press'
  | 'romanian-deadlift'
  | 'leg-extension'
  | 'leg-curl'
  | 'calf-raise'
  | 'hack-squat'
  | 'bulgarian-split-squat'
  | 'lunges'
  | 'sumo-squat'
  | 'hip-thrust'
  | 'seated-calf-raise'
  | 'step-ups'
  // Ramena
  | 'overhead-press'
  | 'dumbbell-shoulder-press'
  | 'lateral-raise'
  | 'front-raise'
  | 'rear-delt-fly'
  | 'arnold-press'
  | 'upright-row'
  | 'shrugs'
  | 'cable-lateral-raise'
  // Ruce
  | 'bicep-curl'
  | 'hammer-curl'
  | 'ez-bar-curl'
  | 'preacher-curl'
  | 'concentration-curl'
  | 'cable-curl'
  | 'tricep-extension'
  | 'skull-crusher'
  | 'tricep-pushdown'
  | 'tricep-dips'
  | 'overhead-tricep-extension'
  // Core
  | 'plank'
  | 'ab-rollout'
  | 'cable-crunch'
  | 'hanging-leg-raise'
  | 'russian-twist'
  | 'sit-ups'
  | 'crunches'
  | 'hollow-hold'
  | 'leg-raise'
  | 'dragon-flag';

export type ExerciseCategory = 'Hrudník' | 'Záda' | 'Nohy' | 'Ramena' | 'Ruce' | 'Core';

export type ExerciseDefinition = {
  key: ExerciseKey;
  name: string;
  category: ExerciseCategory;
};

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  // Hrudník
  { key: 'bench-press', name: 'Bench Press', category: 'Hrudník' },
  { key: 'incline-bench-press', name: 'Incline Bench Press', category: 'Hrudník' },
  { key: 'decline-bench-press', name: 'Decline Bench Press', category: 'Hrudník' },
  { key: 'dumbbell-press', name: 'Dumbbell Press', category: 'Hrudník' },
  { key: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', category: 'Hrudník' },
  { key: 'chest-dips', name: 'Chest Dips', category: 'Hrudník' },
  { key: 'cable-flyes', name: 'Cable Flyes', category: 'Hrudník' },
  { key: 'pec-deck', name: 'Pec Deck', category: 'Hrudník' },
  { key: 'push-ups', name: 'Push Ups', category: 'Hrudník' },
  { key: 'dumbbell-flyes', name: 'Dumbbell Flyes', category: 'Hrudník' },

  // Záda
  { key: 'deadlift', name: 'Deadlift', category: 'Záda' },
  { key: 'pull-ups', name: 'Pull Ups', category: 'Záda' },
  { key: 'barbell-row', name: 'Barbell Row', category: 'Záda' },
  { key: 'cable-row', name: 'Cable Row', category: 'Záda' },
  { key: 'lat-pulldown', name: 'Lat Pulldown', category: 'Záda' },
  { key: 'dumbbell-row', name: 'Dumbbell Row', category: 'Záda' },
  { key: 't-bar-row', name: 'T-Bar Row', category: 'Záda' },
  { key: 'face-pull', name: 'Face Pull', category: 'Záda' },
  { key: 'hyperextension', name: 'Hyperextension', category: 'Záda' },
  { key: 'chin-ups', name: 'Chin Ups', category: 'Záda' },
  { key: 'seated-cable-row', name: 'Seated Cable Row', category: 'Záda' },
  { key: 'straight-arm-pulldown', name: 'Straight Arm Pulldown', category: 'Záda' },

  // Nohy
  { key: 'squat', name: 'Squat', category: 'Nohy' },
  { key: 'leg-press', name: 'Leg Press', category: 'Nohy' },
  { key: 'romanian-deadlift', name: 'Romanian Deadlift', category: 'Nohy' },
  { key: 'leg-extension', name: 'Leg Extension', category: 'Nohy' },
  { key: 'leg-curl', name: 'Leg Curl', category: 'Nohy' },
  { key: 'calf-raise', name: 'Calf Raise', category: 'Nohy' },
  { key: 'hack-squat', name: 'Hack Squat', category: 'Nohy' },
  { key: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'Nohy' },
  { key: 'lunges', name: 'Lunges', category: 'Nohy' },
  { key: 'sumo-squat', name: 'Sumo Squat', category: 'Nohy' },
  { key: 'hip-thrust', name: 'Hip Thrust', category: 'Nohy' },
  { key: 'seated-calf-raise', name: 'Seated Calf Raise', category: 'Nohy' },
  { key: 'step-ups', name: 'Step Ups', category: 'Nohy' },

  // Ramena
  { key: 'overhead-press', name: 'Overhead Press', category: 'Ramena' },
  { key: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', category: 'Ramena' },
  { key: 'lateral-raise', name: 'Lateral Raise', category: 'Ramena' },
  { key: 'front-raise', name: 'Front Raise', category: 'Ramena' },
  { key: 'rear-delt-fly', name: 'Rear Delt Fly', category: 'Ramena' },
  { key: 'arnold-press', name: 'Arnold Press', category: 'Ramena' },
  { key: 'upright-row', name: 'Upright Row', category: 'Ramena' },
  { key: 'shrugs', name: 'Shrugs', category: 'Ramena' },
  { key: 'cable-lateral-raise', name: 'Cable Lateral Raise', category: 'Ramena' },

  // Ruce
  { key: 'bicep-curl', name: 'Bicep Curl', category: 'Ruce' },
  { key: 'hammer-curl', name: 'Hammer Curl', category: 'Ruce' },
  { key: 'ez-bar-curl', name: 'EZ Bar Curl', category: 'Ruce' },
  { key: 'preacher-curl', name: 'Preacher Curl', category: 'Ruce' },
  { key: 'concentration-curl', name: 'Concentration Curl', category: 'Ruce' },
  { key: 'cable-curl', name: 'Cable Curl', category: 'Ruce' },
  { key: 'tricep-extension', name: 'Tricep Extension', category: 'Ruce' },
  { key: 'skull-crusher', name: 'Skull Crusher', category: 'Ruce' },
  { key: 'tricep-pushdown', name: 'Tricep Pushdown', category: 'Ruce' },
  { key: 'tricep-dips', name: 'Tricep Dips', category: 'Ruce' },
  { key: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', category: 'Ruce' },

  // Core
  { key: 'plank', name: 'Plank', category: 'Core' },
  { key: 'ab-rollout', name: 'Ab Rollout', category: 'Core' },
  { key: 'cable-crunch', name: 'Cable Crunch', category: 'Core' },
  { key: 'hanging-leg-raise', name: 'Hanging Leg Raise', category: 'Core' },
  { key: 'russian-twist', name: 'Russian Twist', category: 'Core' },
  { key: 'sit-ups', name: 'Sit Ups', category: 'Core' },
  { key: 'crunches', name: 'Crunches', category: 'Core' },
  { key: 'hollow-hold', name: 'Hollow Hold', category: 'Core' },
  { key: 'leg-raise', name: 'Leg Raise', category: 'Core' },
  { key: 'dragon-flag', name: 'Dragon Flag', category: 'Core' },
];
