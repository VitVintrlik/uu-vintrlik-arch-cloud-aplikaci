import { Check } from 'lucide-react';
import { Button, Textarea } from '@uu/kinetic-ui';

type SummaryStepProps = {
  snapshotTime: string;
  exerciseCount: number;
  note: string;
  onNoteChange: (note: string) => void;
  onConfirm: () => void;
  isPending: boolean;
};

/** Second step of the finish workout flow. Shows workout stats and a textarea for an optional session note. */
export const SummaryStep = ({
  snapshotTime,
  exerciseCount,
  note,
  onNoteChange,
  onConfirm,
  isPending,
}: SummaryStepProps) => {
  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-fixed">
        <Check size={28} className="text-on-primary-fixed" strokeWidth={3} />
      </div>

      <div className="space-y-1">
        <h2 className="text-headline-md font-bold text-on-surface font-sans">Trénink dokončen!</h2>
        <p className="text-body-md text-on-surface-variant">Skvělá práce</p>
      </div>

      <div className="flex gap-10">
        <div className="flex flex-col items-center gap-1">
          <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-mono">
            ČAS
          </span>
          <span className="text-headline-md font-bold text-primary-fixed font-mono">
            {snapshotTime}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-label-sm uppercase tracking-wider text-on-surface-variant font-mono">
            CVIKY
          </span>
          <span className="text-headline-md font-bold text-primary-fixed font-mono">
            {exerciseCount}
          </span>
        </div>
      </div>

      <div className="w-full text-left space-y-2">
        <label className="text-label-sm uppercase tracking-wider text-on-surface-variant font-mono block">
          Poznámka k tréninku
        </label>
        <Textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Jak se ti dnes trénovalo?"
          rows={4}
        />
      </div>

      <Button
        variant="primary"
        onClick={onConfirm}
        isLoading={isPending}
        className="w-full font-bold uppercase tracking-widest"
      >
        Uložit a zavřít
      </Button>
    </div>
  );
};
