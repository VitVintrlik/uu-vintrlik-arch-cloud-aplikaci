import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { TableRow, TableCell, Input, Button } from '@uu/kinetic-ui';

import { useUpdateExerciseMutation } from '../../../hooks/api/useExercises';
import { setSchema, type SetFormValues } from './setSchema';

type SetEditRowProps = {
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  currentValues: { weight: number; reps: number; rpe: number };
  onSaved: () => void;
  onCancel: () => void;
};

/** Inline edit row for updating an existing set's weight, reps, and RPE. */
export const SetEditRow = ({
  sessionId,
  exerciseId,
  setNumber,
  currentValues,
  onSaved,
  onCancel,
}: SetEditRowProps) => {
  const updateExercise = useUpdateExerciseMutation(sessionId);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SetFormValues>({
    resolver: zodResolver(setSchema),
    defaultValues: currentValues,
    mode: 'onTouched',
  });

  const onSubmit = (data: SetFormValues) => {
    updateExercise.mutate({ id: exerciseId, ...data }, { onSuccess: () => onSaved() });
  };

  return (
    <TableRow className="border-b-0 bg-surface-container/40 hover:bg-surface-container/40">
      <TableCell className="pl-6 font-mono text-on-surface-variant w-24">{setNumber}</TableCell>
      <TableCell className="w-[28%]">
        <Input
          {...register('weight')}
          type="number"
          placeholder="0"
          className="w-full max-w-[80px]"
          hasError={!!errors.weight}
          autoFocus
        />
      </TableCell>
      <TableCell className="w-[28%]">
        <Input
          {...register('reps')}
          type="number"
          placeholder="0"
          className="w-full max-w-[80px]"
          hasError={!!errors.reps}
        />
      </TableCell>
      <TableCell className="w-[20%]">
        <Input
          {...register('rpe')}
          type="number"
          min={1}
          max={10}
          placeholder="1-10"
          className="w-full max-w-[80px]"
          hasError={!!errors.rpe}
        />
      </TableCell>
      <TableCell className="pr-6 text-right w-16">
        <div className="flex items-center justify-end gap-1">
          <Button
            onClick={onCancel}
            size="icon"
            variant="ghost"
            className="text-on-surface-variant hover:text-on-surface"
            icon={<X size={14} />}
          />
          <Button
            onClick={handleSubmit(onSubmit)}
            isLoading={updateExercise.isPending}
            disabled={!isValid}
            size="icon"
            variant="ghost"
            className="text-primary-fixed hover:text-primary-dim disabled:opacity-30"
            icon={<Check size={16} />}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
