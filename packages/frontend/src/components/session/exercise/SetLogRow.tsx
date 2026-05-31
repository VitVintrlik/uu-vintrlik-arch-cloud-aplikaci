import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { TableRow, TableCell, Input, Button } from '@uu/kinetic-ui';
import type { ExerciseKey } from 'shared';

import { useAddExerciseMutation } from '../../../hooks/api/useExercises';
import { setSchema, type SetFormValues } from './setSchema';

type SetLogRowProps = {
  sessionId: string;
  exerciseKey: ExerciseKey;
  setNumber: number;
  prefillValues?: { weight: number; reps: number; rpe: number };
  onSaved?: () => void;
};

/** Inline form row for logging a new set. Pre-fills values from the previous set if available. */
export const SetLogRow = ({
  sessionId,
  exerciseKey,
  setNumber,
  prefillValues,
  onSaved,
}: SetLogRowProps) => {
  const addExercise = useAddExerciseMutation(sessionId);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SetFormValues>({
    resolver: zodResolver(setSchema),
    defaultValues: {
      weight: prefillValues?.weight,
      reps: prefillValues?.reps,
      rpe: prefillValues?.rpe,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: SetFormValues) => {
    addExercise.mutate(
      {
        exerciseKey,
        sets: setNumber,
        reps: data.reps,
        weight: data.weight,
        rpe: data.rpe,
      },
      {
        onSuccess: () => onSaved?.(),
      },
    );
  };

  return (
    <TableRow className="border-b-0 bg-surface-container/40 hover:bg-surface-container/40">
      <TableCell className="pl-6 font-mono text-on-surface-variant w-24">{setNumber}</TableCell>
      <TableCell className="w-[28%]">
        <div className="flex flex-col gap-1">
          <Input
            {...register('weight')}
            type="number"
            placeholder="0"
            className="w-full max-w-[80px]"
            hasError={!!errors.weight}
          />
          {errors.weight && (
            <span className="text-xs text-error font-mono">{errors.weight.message}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="w-[28%]">
        <div className="flex flex-col gap-1">
          <Input
            {...register('reps')}
            type="number"
            placeholder="0"
            className="w-full max-w-[80px]"
            hasError={!!errors.reps}
          />
          {errors.reps && (
            <span className="text-xs text-error font-mono">{errors.reps.message}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="w-[20%]">
        <div className="flex flex-col gap-1">
          <Input
            {...register('rpe')}
            type="number"
            min={1}
            max={10}
            placeholder="1-10"
            className="w-full max-w-[80px]"
            hasError={!!errors.rpe}
          />
          {errors.rpe && <span className="text-xs text-error font-mono">{errors.rpe.message}</span>}
        </div>
      </TableCell>
      <TableCell className="pr-6 text-right w-16">
        <Button
          onClick={handleSubmit(onSubmit)}
          isLoading={addExercise.isPending}
          disabled={!isValid}
          size="icon"
          variant="ghost"
          className="text-primary-fixed hover:text-primary-dim disabled:opacity-30"
          icon={<Check size={20} />}
        />
      </TableCell>
    </TableRow>
  );
};
