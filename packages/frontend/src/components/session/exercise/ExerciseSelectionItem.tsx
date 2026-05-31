import { Plus } from 'lucide-react';

import type { ExerciseDefinition } from 'shared';

type ExerciseSelectionItemProps = {
  exercise: ExerciseDefinition;
  onSelect: (exerciseKey: ExerciseDefinition['key']) => void;
};

/** Single row in the exercise selection overlay representing one exercise from the library. */
export const ExerciseSelectionItem = ({ exercise, onSelect }: ExerciseSelectionItemProps) => {
  return (
    <div
      onClick={() => onSelect(exercise.key)}
      className="flex items-center gap-4 p-3 bg-surface-container border border-white/5 rounded-lg hover:border-white/20 transition-all cursor-pointer group active:scale-[0.98]"
    >
      <div className="flex-1 font-sans text-[16px] text-white font-medium">{exercise.name}</div>
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container shrink-0">
        <Plus size={20} />
      </div>
    </div>
  );
};
