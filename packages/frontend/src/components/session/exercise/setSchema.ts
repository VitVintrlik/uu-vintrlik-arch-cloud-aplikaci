import { z } from 'zod';

/** Zod schema validating a single set entry. Coerces string inputs from the form and enforces RPE range 1–10. */
export const setSchema = z.object({
  weight: z.coerce.number().min(0, 'Váha musí být nezáporná'),
  reps: z.coerce.number().int().positive('Opakování musí být kladné'),
  rpe: z.coerce.number().int().min(1).max(10, 'RPE musí být 1-10'),
});

export type SetFormValues = z.infer<typeof setSchema>;
