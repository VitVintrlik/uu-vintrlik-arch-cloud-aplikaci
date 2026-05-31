import { useState } from 'react';

import { Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Button, Text } from '@uu/kinetic-ui';
import { SessionStatus, EXERCISE_LIBRARY, type ExerciseKey } from 'shared';

import { ExerciseGroup } from '../components/session/exercise/ExerciseGroup';
import { ExerciseSelectionOverlay } from '../components/session/exercise/ExerciseSelectionOverlay';
import { buildGroupedExercises } from '../components/session/exercise/utils/groupExercises';
import { FinishWorkoutModal } from '../components/session/finishWorkout/FinishWorkoutModal';
import { SessionHeader } from '../components/session/SessionHeader';
import { SessionDetailSkeleton } from '../components/session/SessionDetailSkeleton';
import { useSessionDetailQuery } from '../hooks/api/useSessions';

/** Workout logging page. Displays grouped exercise sets and allows adding, editing, and deleting entries while a session is active. */
const SessionDetail = () => {
  const { id } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFinishModalOpen, setFinishModalOpen] = useState(false);
  const [pendingKeys, setPendingKeys] = useState<ExerciseKey[]>([]);

  const { data: session, isLoading } = useSessionDetailQuery(id ?? '');

  if (isLoading) return <SessionDetailSkeleton />;
  if (!session) return <Text variant="error">Trénink nebyl nalezen.</Text>;

  const isActive = session.status === SessionStatus.ACTIVE;
  const groupedExercises = buildGroupedExercises(session.exerciseEntries, pendingKeys);

  return (
    <div className="space-y-10 pb-20 max-w-4xl mx-auto">
      <SessionHeader onFinish={() => setFinishModalOpen(true)} />

      <div className="space-y-6">
        {groupedExercises.map(({ key, sets }) => {
          const exerciseDef = EXERCISE_LIBRARY.find((ex) => ex.key === key);
          return (
            <ExerciseGroup
              key={key}
              sessionId={session.id}
              exerciseKey={key}
              exerciseName={exerciseDef?.name ?? key}
              exerciseCategory={exerciseDef?.category ?? ''}
              sets={sets}
              isActive={isActive}
              onGroupDeleted={() => setPendingKeys((prev) => prev.filter((k) => k !== key))}
            />
          );
        })}
      </div>

      {isActive && (
        <Button
          onClick={() => setModalOpen(true)}
          variant="secondary"
          className="w-full h-auto py-8 border-2 border-dashed border-outline-variant/30 hover:bg-surface-container-low transition-all"
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="text-white" size={32} />
            <span className="text-label-md font-bold uppercase tracking-widest text-white">
              Přidat cvik
            </span>
          </div>
        </Button>
      )}

      <ExerciseSelectionOverlay
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(key) => {
          setPendingKeys((prev) => [...prev, key]);
          setModalOpen(false);
        }}
      />

      <FinishWorkoutModal isOpen={isFinishModalOpen} onClose={() => setFinishModalOpen(false)} />
    </div>
  );
};

export default SessionDetail;
