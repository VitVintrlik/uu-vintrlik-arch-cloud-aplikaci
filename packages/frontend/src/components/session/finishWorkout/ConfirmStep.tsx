import { CircleAlert } from 'lucide-react';
import { Button } from '@uu/kinetic-ui';

type ConfirmStepProps = {
  onClose: () => void;
  onProceed: () => void;
};

/** First step of the finish workout flow. Asks for confirmation before proceeding to the summary. */
export const ConfirmStep = ({ onClose, onProceed }: ConfirmStepProps) => {
  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-surface-container-high">
        <CircleAlert size={28} className="text-primary-fixed" />
      </div>

      <div className="space-y-1">
        <h2 className="text-headline-md font-bold text-on-surface font-sans">Ukončit trénink?</h2>
        <p className="text-body-md text-on-surface-variant">Tento trénink bude dokončen.</p>
      </div>

      <div className="flex gap-3 w-full">
        <Button
          variant="ghost"
          onClick={onClose}
          className="flex-1 font-bold uppercase tracking-widest"
        >
          Zrušit
        </Button>
        <Button
          variant="primary"
          onClick={onProceed}
          className="flex-1 font-bold uppercase tracking-widest"
        >
          Ukončit
        </Button>
      </div>
    </div>
  );
};
