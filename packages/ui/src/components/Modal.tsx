import type { ReactNode } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { cn } from '../utils/cn';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

/** Accessible dialog built on Headless UI. Traps focus, locks background scroll, and animates in and out. */
export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50" transition>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-md transition duration-200 ease-out data-closed:opacity-0" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className={cn(
              'relative w-full max-w-md overflow-hidden rounded-xl bg-surface-container border border-outline-variant/20 p-6 text-left shadow-2xl transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0',
              className,
            )}
          >
            {title && (
              <DialogTitle
                as="h3"
                className="text-headline-md font-sans font-bold leading-6 text-on-surface mb-6 tracking-tight"
              >
                {title}
              </DialogTitle>
            )}
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
