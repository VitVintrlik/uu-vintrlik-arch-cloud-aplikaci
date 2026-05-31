import { useMemo, useState } from 'react';

import { Search } from 'lucide-react';

import { Badge, Input, Modal } from '@uu/kinetic-ui';
import {
  EXERCISE_LIBRARY,
  type ExerciseCategory,
  type ExerciseDefinition,
  type ExerciseKey,
} from 'shared';

import { cn } from '../../../utils/cn';
import { ExerciseSelectionItem } from './ExerciseSelectionItem';

const ALL_CATEGORY = 'VŠE';
const CATEGORIES = [
  ALL_CATEGORY,
  ...Array.from(new Set(EXERCISE_LIBRARY.map((ex) => ex.category))),
] as (ExerciseCategory | typeof ALL_CATEGORY)[];

type ExerciseSelectionOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exerciseKey: ExerciseKey) => void;
};

/** Modal for browsing and selecting exercises from the library. Supports text search and category filtering. */
export const ExerciseSelectionOverlay = ({
  isOpen,
  onClose,
  onSelect,
}: ExerciseSelectionOverlayProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | typeof ALL_CATEGORY>(
    ALL_CATEGORY,
  );

  const groupedExercises = useMemo(() => {
    const filtered = EXERCISE_LIBRARY.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === ALL_CATEGORY || ex.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.reduce(
      (acc, ex) => {
        if (!acc[ex.category]) {
          acc[ex.category] = [];
        }
        acc[ex.category].push(ex);
        return acc;
      },
      {} as Record<string, ExerciseDefinition[]>,
    );
  }, [searchTerm, selectedCategory]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Přidat cvik" className="max-w-2xl bg-surface">
      <div className="flex flex-col gap-6 h-[70vh]">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-on-surface-variant">
            <Search size={20} />
          </div>
          <Input
            placeholder="Hledat cvik..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'cursor-pointer px-4 py-1.5 whitespace-nowrap',
                selectedCategory === category
                  ? 'bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed/90'
                  : 'bg-surface-container-high text-white/60 hover:text-white hover:bg-surface-container-highest',
              )}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
          {Object.entries(groupedExercises).length === 0 ? (
            <div className="text-center text-on-surface-variant pt-10">
              Žádné cviky nebyly nalezeny.
            </div>
          ) : (
            Object.entries(groupedExercises).map(([categoryName, exercises]) => (
              <div key={categoryName}>
                <h3 className="font-mono text-sm text-white font-bold tracking-widest border-l-2 border-primary-fixed pl-3 uppercase mb-2">
                  {categoryName}
                </h3>
                <div className="space-y-2">
                  {exercises.map((exercise) => (
                    <ExerciseSelectionItem
                      key={exercise.key}
                      exercise={exercise}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
