import { z } from "zod";
const requiredString=z.string().trim().min(1, "required")

export const createPostSchema= z.object({
    content:requiredString,
    mediaIds:z.array(z.string()).max(5, "Cannot have more than 5 attachments")
})

export const updateUserProfileSchema = z.object({
    displayName: requiredString,
    bio: z.string().max(1000, "Must be at most 1000 characters"),
});

export type UpdateUserProfileValues= z.infer<typeof updateUserProfileSchema>

export const createCommentSchema=z.object({
    content: requiredString
})