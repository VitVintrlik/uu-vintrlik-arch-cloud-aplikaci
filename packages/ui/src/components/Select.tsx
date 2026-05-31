import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

import { cn } from '../utils/cn';

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

export type SelectProps<T extends string = string> = {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
};

/** Accessible generic dropdown built on Headless UI Listbox. Supports any value type and error state styling. */
export const Select = <T extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Vyberte...',
  className,
  error,
  disabled,
  ariaLabel,
}: SelectProps<T>) => {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn('relative w-full', className)}>
      <Listbox value={value} onChange={onChange} disabled={disabled} aria-label={ariaLabel}>
        <div className="relative">
          <ListboxButton
            className={cn(
              'relative w-full cursor-pointer rounded-lg border bg-surface-container-high p-3 pr-10 text-left font-mono text-body-md text-on-surface transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-error/50 focus:border-error focus:ring-error/50'
                : 'border-outline-variant/20 hover:border-outline-variant/40 data-open:border-primary-fixed data-open:ring-1 data-open:ring-primary-fixed/20',
            )}
          >
            <span className={cn('block truncate', !selectedOption && 'text-on-surface-variant/40')}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-on-surface-variant" aria-hidden="true" />
            </span>
          </ListboxButton>

          <ListboxOptions
            anchor="bottom start"
            transition
            className="z-50 [--anchor-gap:4px] w-[var(--button-width)] max-h-60 overflow-auto rounded-lg border border-outline-variant/20 bg-surface-container-high py-1 shadow-lg focus:outline-none text-body-md font-mono transition duration-100 ease-in data-closed:opacity-0"
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                className="relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-on-surface transition-colors data-focus:bg-surface-container-highest"
                value={option.value}
              >
                <span className="block truncate data-selected:font-medium">{option.label}</span>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-fixed hidden data-selected:flex">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};
