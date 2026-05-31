import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '@uu/kinetic-ui';
import { useFinishSessionMutation, useSessionDetailQuery } from '../../../hooks/api/useSessions';
import { formatElapsedTime } from '../utils/timerUtils';
import { ConfirmStep } from './ConfirmStep';
import { SummaryStep } from './SummaryStep';

type FinishWorkoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/** Two-step modal guiding the user through finishing a workout: confirmation, then a summary with optional note. */
export const FinishWorkoutModal = ({ isOpen, onClose }: FinishWorkoutModalProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: session } = useSessionDetailQuery(id ?? '');
  const finishSession = useFinishSessionMutation();
  const [step, setStep] = useState<'confirm' | 'summary'>('confirm');
  const [note, setNote] = useState('');
  const [snapshotTime, setSnapshotTime] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('confirm');
      setNote('');
      setSnapshotTime('');
    }
  }, [isOpen]);

  if (!session) return null;

  const exerciseCount = session.exerciseEntries.reduce(
    (acc, entry) => acc.add(entry.exerciseKey),
    new Set<string>(),
  ).size;

  const handleProceed = () => {
    setSnapshotTime(formatElapsedTime(session.startTime));
    setStep('summary');
  };

  const handleConfirm = () => {
    finishSession.mutate(
      { id: id!, note },
      {
        onSuccess: () => {
          onClose();
          navigate('/sessions');
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {step === 'confirm' ? (
        <ConfirmStep onClose={onClose} onProceed={handleProceed} />
      ) : (
        <SummaryStep
          snapshotTime={snapshotTime}
          exerciseCount={exerciseCount}
          note={note}
          onNoteChange={setNote}
          onConfirm={handleConfirm}
          isPending={finishSession.isPending}
        />
      )}
    </Modal>
  );
};
