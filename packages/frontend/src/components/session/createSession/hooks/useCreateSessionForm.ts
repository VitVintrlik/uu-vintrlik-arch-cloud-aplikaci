import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { WorkoutSplit } from 'shared';

import { formatSplit } from '../../../../utils/formatters';

const schema = z.object({
  name: z.string().min(1, 'Název je povinný'),
  split: z.nativeEnum(WorkoutSplit),
});

export type CreateSessionFormData = z.infer<typeof schema>;

/** Manages the new session form state. Auto-populates the name field when the user selects a split. */
export const useCreateSessionForm = (isOpen: boolean) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateSessionFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      split: WorkoutSplit.FULL_BODY,
    },
  });

  const selectedSplit = watch('split');

  useEffect(() => {
    if (isOpen) {
      setValue('name', `${formatSplit(selectedSplit)} ${new Date().toLocaleDateString('cs-CZ')}`);
    }
  }, [selectedSplit, setValue, isOpen]);

  return { register, handleSubmit, errors, selectedSplit, setValue, reset };
};
