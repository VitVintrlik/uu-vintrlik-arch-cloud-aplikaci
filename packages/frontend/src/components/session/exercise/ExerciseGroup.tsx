import { useState } from 'react';

import { Trash2, Plus, Pencil } from 'lucide-react';

import {
  Badge,
  Card,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Button,
} from '@uu/kinetic-ui';
import type { ExerciseEntry, ExerciseKey } from 'shared';

import { useDeleteExerciseMutation } from '../../../hooks/api/useExercises';
import { SetLogRow } from './SetLogRow';
import { SetEditRow } from './SetEditRow';

type ExerciseGroupProps = {
  sessionId: string;
  exerciseKey: ExerciseKey;
  exerciseName: string;
  exerciseCategory: string;
  sets: ExerciseEntry[];
  isActive: boolean;
  onGroupDeleted: () => void;
};

const thClass = 'py-3 text-xs tracking-widest font-bold text-primary-fixed uppercase';

/** Displays all logged sets for a single exercise with inline add, edit, and delete controls. */
export const ExerciseGroup = ({
  sessionId,
  exerciseKey,
  exerciseName,
  exerciseCategory,
  sets,
  isActive,
  onGroupDeleted,
}: ExerciseGroupProps) => {
  const [showInputRow, setShowInputRow] = useState(false);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const deleteExercise = useDeleteExerciseMutation(sessionId);

  const nextSetNumber = sets.length + 1;
  const lastSet = sets[sets.length - 1];

  const handleDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      await Promise.all(sets.map((set) => deleteExercise.mutateAsync(set.id)));
      onGroupDeleted();
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <Card className="bg-surface-container-low border-outline-variant/10 p-0 overflow-hidden">
      <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-outline-variant/10">
        <div className="flex items-baseline gap-3">
          <span className="text-white font-sans font-bold text-xl">{exerciseName}</span>
          <Badge variant="secondary">{exerciseCategory}</Badge>
        </div>
        {isActive && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteAll}
            disabled={isDeletingAll}
            className="text-on-surface-variant hover:text-error transition-colors -mt-1"
            icon={<Trash2 size={16} />}
          />
        )}
      </div>

      <Table>
        <TableHeader className="border-white/10">
          <TableRow>
            <TableHead className={`pl-6 w-24 ${thClass}`}>Série</TableHead>
            <TableHead className={`w-[28%] ${thClass}`}>Váha</TableHead>
            <TableHead className={`w-[28%] ${thClass}`}>Opakování</TableHead>
            <TableHead className={`w-[20%] ${thClass}`}>RPE</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sets.map((set) =>
            isActive && editingSetId === set.id ? (
              <SetEditRow
                key={set.id}
                sessionId={sessionId}
                exerciseId={set.id}
                setNumber={set.sets}
                currentValues={{ weight: set.weight, reps: set.reps, rpe: set.rpe }}
                onSaved={() => setEditingSetId(null)}
                onCancel={() => setEditingSetId(null)}
              />
            ) : (
              <TableRow key={set.id} className="border-outline-variant/5">
                <TableCell className="pl-6 font-mono text-on-surface-variant w-24">
                  {set.sets}
                </TableCell>
                <TableCell className="font-mono w-[28%]">{set.weight} kg</TableCell>
                <TableCell className="font-mono w-[28%]">{set.reps}</TableCell>
                <TableCell className="font-mono text-on-surface-variant w-[20%]">
                  {set.rpe}
                </TableCell>
                <TableCell className="pr-6 text-right w-16">
                  {isActive && (
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingSetId(set.id)}
                        className="text-on-surface-variant hover:text-on-surface transition-colors"
                        icon={<Pencil size={14} />}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteExercise.mutate(set.id)}
                        disabled={deleteExercise.isPending}
                        className="text-on-surface-variant hover:text-error transition-colors"
                        icon={<Trash2 size={16} />}
                      />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ),
          )}
          {isActive && showInputRow && (
            <SetLogRow
              sessionId={sessionId}
              exerciseKey={exerciseKey}
              setNumber={nextSetNumber}
              prefillValues={
                lastSet
                  ? { weight: lastSet.weight, reps: lastSet.reps, rpe: lastSet.rpe }
                  : undefined
              }
              onSaved={() => setShowInputRow(false)}
            />
          )}
          {isActive && (
            <TableRow
              className="cursor-pointer border-outline-variant/5 group"
              onClick={() => setShowInputRow(true)}
            >
              <TableCell colSpan={5} className="py-3 text-center">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-white group-hover:text-primary-fixed uppercase tracking-widest transition-colors">
                  <Plus size={12} />
                  Přidat sérii
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
