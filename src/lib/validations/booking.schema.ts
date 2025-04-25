import { z } from 'zod';

export const createBookingSchema = z.object({
  hospitalId: z.string().min(1, 'Hospital ID is required'),
  serviceId: z.string().min(1, 'Service ID is required'),
  timeSlot: z.object({
    id: z.string().min(1, 'Time slot ID is required'),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;