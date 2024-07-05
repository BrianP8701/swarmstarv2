import { z } from 'zod';

export const PersonSchema = z.object({
    id: z.number().optional(),
    user_id: z.number(),
    first_name: z.string(),
    middle_name: z.string().optional(),
    last_name: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
    notes: z.string().optional(),
    type: z.enum(['lead', 'prospect', 'client', 'past_client', 'agent', 'broker', 'attorney', 'other']),
    status: z.enum(['active', 'inactive']).optional(),
    language: z.string().optional(),
    created: z.date().optional(),
    updated: z.date().optional(),
    viewed: z.date().optional(),
});

export type Person = z.infer<typeof PersonSchema>;
