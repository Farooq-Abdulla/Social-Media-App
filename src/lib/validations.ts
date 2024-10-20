import { z } from "zod";
const requiredString=z.string().trim().min(1, "required")

export const updateUserProfileSchema = z.object({
    displayName: requiredString,
    bio: z.string().max(1000, "Must be at most 1000 characters"),
});

export type UpdateUserProfileValues= z.infer<typeof updateUserProfileSchema>