import { useNavigate } from 'react-router-dom';

import { Modal, Button, FormField, Input, Select } from '@uu/kinetic-ui';
import { WorkoutSplit } from 'shared';

import { useCreateSessionMutation } from '../../../hooks/api/useSessions';
import { useCreateSessionForm } from './hooks/useCreateSessionForm';
import { formatSplit } from '../../../utils/formatters';

type CreateSessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/** Modal form for starting a new workout session. Requires a split selection and auto-generates a default name. */
export const CreateSessionModal = ({ isOpen, onClose }: CreateSessionModalProps) => {
  const navigate = useNavigate();
  const createSession = useCreateSessionMutation();
  const { register, handleSubmit, errors, selectedSplit, setValue, reset } =
    useCreateSessionForm(isOpen);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: { name: string; split: WorkoutSplit }) => {
    try {
      const session = await createSession.mutateAsync({ name: data.name, split: data.split });
      handleClose();
      navigate(`/session/${session.id}`);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nový trénink">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField label="Split">
          <Select
            value={selectedSplit}
            onChange={(val) => setValue('split', val)}
            options={Object.values(WorkoutSplit).map((split) => ({
              value: split,
              label: formatSplit(split),
            }))}
          />
        </FormField>

        <FormField label="Název tréninku" error={errors.name?.message}>
          <Input
            {...register('name')}
            autoFocus
            placeholder="Např. Full Body 12.05.2024"
            hasError={!!errors.name}
          />
        </FormField>

        <div className="flex gap-3 mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1 font-sans font-bold uppercase tracking-widest"
          >
            Zrušit
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={createSession.isPending}
            className="flex-1 font-sans font-bold uppercase tracking-widest"
          >
            {createSession.isPending ? 'Zakládání...' : 'Začít'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
