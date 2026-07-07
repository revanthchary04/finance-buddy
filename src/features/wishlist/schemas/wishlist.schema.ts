import { z } from "zod";

export const wishlistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  target_amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  priority: z.enum(["low", "medium", "high"]),
  target_date: z.string().optional(),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type WishlistFormData = z.infer<typeof wishlistSchema>;
